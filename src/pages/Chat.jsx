import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { AuthContext } from '../contexts/AuthContext';
import socket from '../contexts/socket';
// import '../assets/css/apps/mailing-chat.css';
// import '../assets/js/apps/mailbox-chat.js';


const Chat = () => {

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const { token, user } = useContext(AuthContext);

  const [activeChat, setActiveChat] = useState(null);

  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.connect();
    if (user?.uid) {
      socket.emit('join-user-room', user.uid);
    }

    // Handler for sender's own messages (optimistic updates)
    const senderHandler = (msg) => {
      // Update messages in active chat
      // if (activeChat?.chatId === msg.chatId) {
      //   setMessages(prev => [...prev, {
      //     _id: msg._id,
      //     msg_cnt: msg.content,
      //     msg_sid: msg.senderId,
      //     msg_rid: msg.receiverId,
      //     createdAt: msg.createdAt,
      //     isCurrentUser: true
      //   }]);
      // }

      // Update chat list order
      setChatList(prev => {
        const existingChatIndex = prev.findIndex(c => c.chatId === msg.chatId);
        if (existingChatIndex >= 0) {
          const updatedChats = [...prev];
          const [movedChat] = updatedChats.splice(existingChatIndex, 1);
          return [{
            ...movedChat,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt
          }, ...updatedChats];
        }
        return prev;
      });
    };

    // Handler for received messages
    const receiverHandler = (msg) => {
      // 🛑 Ignore if the sender is the current user
      if (msg.senderId === user.uid) return;
      // Update unread counts if needed
      if (activeChat?.chatId !== msg.chatId) {
        setUnreadCounts(prev => ({
          ...prev,
          [msg.chatId]: (prev[msg.chatId] || 0) + 1
        }));
      }

      // Update messages in active chat
      if (activeChat?.chatId === msg.chatId) {
        setMessages(prev => [...prev, {
          _id: msg._id,
          msg_cnt: msg.content,
          msg_sid: msg.senderId,
          msg_rid: msg.receiverId,
          createdAt: msg.createdAt,
          msg_sts: msg.status,
          isCurrentUser: false
        }]);
      }

      // Update chat list order
      setChatList(prev => {
        const existingChatIndex = prev.findIndex(c => c.chatId === msg.chatId);
        if (existingChatIndex >= 0) {
          const updatedChats = [...prev];
          const [movedChat] = updatedChats.splice(existingChatIndex, 1);
          return [{
            ...movedChat,
            lastMessage: msg.content,
            lastMessageTime: msg.createdAt,
            unreadCount: activeChat?.chatId === msg.chatId ? 0 : (movedChat.unreadCount || 0) + 1
          }, ...updatedChats];
        }

        // If new chat (shouldn't happen but just in case)
        return prev;
      });
    };

    // Handler for read receipts
    const readHandler = ({ chatId, unreadCount }) => {
      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: unreadCount || 0
      }));

      // Update chat list unread count
      setChatList(prev => prev.map(chat =>
        chat.chatId === chatId
          ? { ...chat, unreadCount: unreadCount || 0 }
          : chat
      ));
    };


    socket.on('new-message-sender', senderHandler);
    socket.on('new-message-receiver', receiverHandler);
    socket.on('messages-read', readHandler);
    // socket.on('new-message', receiverHandler); // Fallback for any other cases

    // Handle when messages are marked as read
    // socket.on('messages-read', ({ chatId }) => {
    //   setUnreadCounts(prev => ({
    //     ...prev,
    //     [chatId]: 0
    //   }));
    // });

    return () => {
      socket.off('new-message-sender', senderHandler);
      socket.off('new-message-receiver', receiverHandler);
      socket.off('messages-read', readHandler);
      // socket.off('new-message', receiverHandler);
      // socket.off('messages-read');
      socket.disconnect();
    };
  }, [user?.uid, activeChat?.chatId]);

  useEffect(() => {
    if (activeChat?.chatId) {
      socket.emit('join-chat', activeChat.chatId);
    }
  }, [activeChat]);

  useEffect(() => {
    if (chatList.length && socket.connected) {
      chatList.forEach(chat => {
        socket.emit('join-chat', chat.chatId);
      });
    }
  }, [chatList]);


  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.length >= 3) {
        axios
          .get(`${VITE_BASE_URL}/api/chat/chat-users?q=${search}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then(res => {
            if (Array.isArray(res.data)) {
              setSuggestions(res.data);
            } else {
              setSuggestions([]);
              console.error('Expected array from server');
            }
          })
          .catch(err => {
            console.error('Error fetching suggestions', err);
            setSuggestions([]);
          });
      } else {
        setSuggestions([]);
      }
    }, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  // Add this useEffect to load existing chats on component mount
  useEffect(() => {
    const fetchChatList = async () => {
      try {
        const res = await axios.get(`${VITE_BASE_URL}/api/chat/chats`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Sort by lastMessageTime descending
        const sortedChats = res.data.sort((a, b) =>
          new Date(b.lastMessageTime || b.cht_crt || 0) -
          new Date(a.lastMessageTime || a.cht_crt || 0)
        );
        // Calculate initial unread counts
        const initialUnreadCounts = {};
        sortedChats.forEach(chat => {
          initialUnreadCounts[chat._id] = chat.unreadCount || 0;
        });

        setUnreadCounts(initialUnreadCounts);
        setChatList(sortedChats);
      } catch (err) {
        console.error('Error fetching chat list', err);
      }
    };

    fetchChatList();
  }, [token, VITE_BASE_URL]);

  // Update handleSelectSuggestion to properly add to chat list
  const handleSelectSuggestion = async (selectedUser) => {
    try {
      const res = await axios.post(`${VITE_BASE_URL}/api/chat/add-or-get-chat`, {
        userId: selectedUser.uId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userInfo = res.data.user || selectedUser;
      const newChat = {
        chatId: res.data._id,
        name: userInfo.name,
        userId: userInfo.uId,
        ph: userInfo.ph,
        lastMessage: 'Chat started',
        lastMessageTime: new Date().toISOString()
      };

      // Add new chat to the top of the list
      setChatList(prev => [
        newChat,
        ...prev.filter(chat => chat.userId !== userInfo.uId)
      ]);

      setActiveChat(newChat);
      setSearch('');
      setSuggestions([]);
    } catch (err) {
      console.error('Error adding/starting chat', err);
    }
  };


  // In your useEffect that fetches messages
  useEffect(() => {
    if (!activeChat?.chatId) {
      setMessages([]); // Clear messages when no chat is selected
      return;
    }

    let isMounted = true; // Flag to prevent state updates after component unmounts

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${VITE_BASE_URL}/api/chat/messages/${activeChat.chatId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (isMounted) {
          // Filter out messages where msg_sts === 0 and sort by date
          const filteredMessages = res.data
            .filter(msg => msg.msg_sts !== 0)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          setMessages(filteredMessages);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Error fetching messages', err);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false; // Cleanup function to prevent state updates after unmount
    };
  }, [activeChat?.chatId, token, VITE_BASE_URL]); // Only re-run when chatId changes


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;

    const tempId = new Date().getTime().toString();

    try {

      setMessage('');
      // Optimistic update for chat list
      setChatList(prev => {
        const existingChatIndex = prev.findIndex(c => c.chatId === activeChat.chatId);
        if (existingChatIndex >= 0) {
          const updatedChats = [...prev];
          const updatedChat = {
            ...updatedChats[existingChatIndex],
            lastMessage: message,
            lastMessageTime: new Date().toISOString()
          };
          updatedChats.splice(existingChatIndex, 1);
          return [updatedChat, ...updatedChats];
        }
        return prev;
      });



      const response = await axios.post(`${VITE_BASE_URL}/api/chat/send-message`, {
        chatId: activeChat.chatId,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });



    } catch (err) {
      console.error('Error sending message:', err);
      // Rollback optimistic updates
      // No need to rollback chat list as it will update via socket
    }
  };

  const handleDeleteMessages = async () => {
    try {
      const { data } = await axios.post(`${VITE_BASE_URL}/api/chat/delete-messages`, {
        chatId: activeChat.chatId,
        messageIds: selectedMessages
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        // Update state with filtered messages
        setMessages(data.messages);
        // Reset selection
        setIsDeleteMode(false);
        setShowDeleteButton(false);
        setSelectedMessages([]);
      }
    } catch (err) {
      console.error('Error deleting messages:', err);
    }
  };

  // Function to mark messages as read
  const markMessagesAsRead = async (chatId) => {
    try {
      await axios.post(`${VITE_BASE_URL}/api/chat/mark-as-read`, { chatId }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUnreadCounts(prev => ({
        ...prev,
        [chatId]: 0
      }));
    } catch (err) {
      console.error('Error marking messages as read', err);
    }
  };

  const handleChatSelect = async (chat) => {
    // Mark messages as read when opening chat
    if (unreadCounts[chat.chatId] > 0) {
      try {
        await axios.post(`${VITE_BASE_URL}/api/chat/mark-as-read`, {
          chatId: chat.chatId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Optimistically update UI
        setUnreadCounts(prev => ({
          ...prev,
          [chat.chatId]: 0
        }));

        setChatList(prev => prev.map(c =>
          c.chatId === chat.chatId
            ? { ...c, unreadCount: 0 }
            : c
        ));
      } catch (err) {
        console.error('Error marking messages as read', err);
      }
    }

    setActiveChat(chat);
  };

  return (


    <div>
      <div>
        <Navbar />
        {/*  BEGIN MAIN CONTAINER  */}
        <div className="main-container sidebar-closed sbar-open" id="container">
          <div className="overlay" />
          <div className="cs-overlay" />
          <div className="search-overlay" />
          <Sidebar />
          {/*  END SIDEBAR  */}
          {/*  BEGIN CONTENT AREA  */}
          <div id="content" className="main-content">
            <div className="layout-px-spacing">
              <div className="chat-section layout-top-spacing">
                <div className="row">
                  <div className="col-xl-12 col-lg-12 col-md-12">
                    <div className="chat-system">
                      <div className="hamburger"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu mail-menu d-lg-none"><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={18} x2={21} y2={18} /></svg></div>
                      <div className="user-list-box">
                        <div className="search">
                          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                          <input type="text" className="form-control" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
                          {suggestions.length > 0 && (
                            <div className="chat-search-suggestions">
                              {suggestions.map((user) => (
                                <div
                                  key={user._id}
                                  className="suggestion-item"
                                  onClick={() => {
                                    handleSelectSuggestion(user)
                                  }}
                                  style={{ cursor: 'pointer' }}
                                >
                                  <div className="f-body">
                                    <div className="meta-info">
                                      <span className="user-name">{user.name}</span>-
                                      <span className="user-name">{user.loc}</span>-
                                      <span className="user-meta-time">{user.ph}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                        {/* <div className="people">

                          <div className="person" data-chat="person2">
                            <div className="user-info">
                              <div className="f-head">
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                              </div>
                              <div className="f-body">
                                <div className="meta-info">
                                  <span className="user-name" data-name="Alma Clarke">Alma Clarke</span>
                                  <span className="user-meta-time">1:44 PM</span>
                                </div>
                                <span className="preview">I've forgotten how it felt before</span>
                              </div>
                            </div>
                          </div>


                        </div> */}
                        <div className="people">
                          {chatList.map((chat) => {
                            const unreadCount = unreadCounts[chat.chatId] || chat.unreadCount || 0;
                            return (
                              <div
                                key={chat.chatId}
                                className={`person ${activeChat?.chatId === chat.chatId ? 'active' : ''} ${unreadCount > 0 ? 'unread-chat' : ''}`}
                                onClick={() => handleChatSelect(chat)}
                              >
                                <div className="user-info">
                                  <div className="f-head">
                                    <img src="assets/img/90x90.jpg" alt="avatar" />

                                  </div>
                                  <div className="f-body">
                                    <div className="meta-info">
                                      <span className="user-name" data-name={chat.name}>
                                        {chat.name}
                                      </span>
                                      <span className="user-meta-time">
                                        {chat.lastMessageTime
                                          ? new Date(chat.lastMessageTime).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: true
                                          }).replace(':', '.')
                                          : 'Now'}
                                      </span>

                                      {unreadCount > 0 && (
                                        <span className="unread-badge">{unreadCount}</span>
                                      )}
                                      <span className="user-chat-arrow">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-down">

                                          <polyline points="19 12 12 19 5 12"></polyline>
                                        </svg>
                                      </span>
                                    </div>
                                    <span className="preview">
                                      {chat.lastMessage || 'Start a chat'}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="chat-box">
                        {!activeChat && (

                          <div className="chat-not-selected">
                            <p> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg> Click User To Chat</p>
                          </div>
                        )}
                        <div className="overlay-phone-call">
                          <div className="">
                            <div className="calling-user-info">
                              <div className="">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle go-back-chat"><circle cx={12} cy={12} r={10} /><polyline points="12 8 8 12 12 16" /><line x1={16} y1={12} x2={8} y2={12} /></svg>
                                <span className="user-name" />
                                <span className="call-status">Calling...</span>
                              </div>
                            </div>
                            <div className="calling-user-img">
                              <div className="">
                                <img src="assets/img/90x90.jpg" alt="dynamic-image" />
                              </div>
                              <div className="timer"><label className="minutes">00</label> : <label className="seconds">00</label></div>
                            </div>
                            <div className="calling-options">
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-video switch-to-video-call"><polygon points="23 7 16 12 23 17 23 7" /><rect x={1} y={5} width={15} height={14} rx={2} ry={2} /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mic switch-to-microphone"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1={12} y1={19} x2={12} y2={23} /><line x1={8} y1={23} x2={16} y2={23} /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus add-more-caller"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone-off cancel-call"><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7 2 2 0 0 1 1.72 2v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><line x1={23} y1={1} x2={1} y2={23} /></svg>
                            </div>
                          </div>
                        </div>
                        <div className="overlay-video-call">
                          <img src="assets/img/175x115.jpg" className="video-caller" alt="video-chat" />
                          <div className="">
                            <div className="calling-user-info">
                              <div className="d-flex">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-left-circle go-back-chat"><circle cx={12} cy={12} r={10} /><polyline points="12 8 8 12 12 16" /><line x1={16} y1={12} x2={8} y2={12} /></svg>
                                <div className="">
                                  <span className="user-name" />
                                  <div className="timer"><label className="minutes">00</label> : <label className="seconds">00</label></div>
                                </div>
                                <span className="call-status">Calling...</span>
                              </div>
                            </div>
                            <div className="calling-user-img">
                              <div className="">
                                <img src="assets/img/90x90.jpg" alt="dynamic-image" />
                              </div>
                            </div>
                            <div className="calling-options">
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone switch-to-phone-call"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mic switch-to-microphone"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1={12} y1={19} x2={12} y2={23} /><line x1={8} y1={23} x2={16} y2={23} /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus add-more-caller"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-video-off cancel-call"><path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" /><line x1={1} y1={1} x2={23} y2={23} /></svg>
                            </div>
                          </div>
                        </div>
                        <div className="chat-box-inner">
                          <div className="chat-meta-user">
                            <div className="current-chat-user-name"><span><img src="assets/img/90x90.jpg" alt="dynamic-image" /><span className="name" /></span></div>
                            <div className="chat-action-btn align-self-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone  phone-call-screen"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-video video-call-screen"><polygon points="23 7 16 12 23 17 23 7" /><rect x={1} y={5} width={15} height={14} rx={2} ry={2} /></svg>
                              <div className="dropdown d-inline-block">
                                <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuLink-2">
                                  <a className="dropdown-item" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-settings"><circle cx={12} cy={12} r={3} /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg> Settings</a>
                                  <a className="dropdown-item" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> Mail</a>
                                  <a className="dropdown-item" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-copy"><rect x={9} y={9} width={13} height={13} rx={2} ry={2} /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg> Copy</a>
                                  <a className="dropdown-item" href="javascript:void(0);" onClick={() => {
                                    setIsDeleteMode(true);
                                    setShowDeleteButton(true);
                                  }}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> Delete</a>
                                  <a className="dropdown-item" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-share-2"><circle cx={18} cy={5} r={3} /><circle cx={6} cy={12} r={3} /><circle cx={18} cy={19} r={3} /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg> Share</a>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* <div className="chat-conversation-box">
                            <div id="chat-conversation-box-scroll" className="chat-conversation-box-scroll">

                              <div className="chat " data-chat="person2">
                                <div className="conversation-start">
                                  <span>Today, 5:38 PM</span>
                                </div>
                                <div className="bubble you">
                                  Hello!
                                </div>
                                <div className="bubble me">
                                  Hey!
                                </div>
                                <div className="bubble me">
                                  How was your day so far.
                                </div>
                                <div className="bubble you">
                                  It was a bit dramatic.
                                </div>
                              </div>


                            </div>
                          </div> */}

                          {/* // In your message rendering section */}
                          <div className="chat-conversation-box">
                            <div id="chat-conversation-box-scroll" className="chat-conversation-box-scroll">
                              <div className={`chat ${activeChat ? 'active-chat' : ''}`}>
                                {activeChat ? (
                                  messages.length > 0 ? (
                                    messages.map((msg) => {
                                      const isCurrentUser = msg.isCurrentUser;
                                      const isUnread = !isCurrentUser && msg.msg_sts === 1;
                                      const isSelected = selectedMessages.includes(msg._id);

                                      return (
                                        <div
                                          key={msg._id}
                                          className={`bubble ${isCurrentUser ? 'me' : 'you'} ${isSelected ? 'selected' : ''} ${msg.temp ? 'temp-message' : ''}`}
                                          onClick={() => {
                                            if (isDeleteMode) {
                                              setSelectedMessages(prev =>
                                                prev.includes(msg._id)
                                                  ? prev.filter(id => id !== msg._id)
                                                  : [...prev, msg._id]
                                              );
                                            }
                                          }}
                                        >
                                          {isDeleteMode && (
                                            <input
                                              type="checkbox"
                                              checked={isSelected}
                                              readOnly
                                              className="message-checkbox"
                                            />
                                          )}
                                          {msg.msg_cnt}


                                        </div>
                                      );
                                    })
                                  ) : (
                                    <div className="no-messages">No messages in this chat</div>
                                  )
                                ) : (
                                  <div className="no-chat-selected">Please select a chat</div>
                                )}
                              </div>
                            </div>
                          </div>

                          {showDeleteButton && (
                            <div className="delete-actions">
                              <button
                                className="btn btn-danger"
                                onClick={handleDeleteMessages}
                                disabled={selectedMessages.length === 0}
                              >
                                Delete Selected ({selectedMessages.length})
                              </button>
                              <button
                                className="btn btn-secondary"
                                onClick={() => {
                                  setIsDeleteMode(false);
                                  setShowDeleteButton(false);
                                  setSelectedMessages([]);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                          {/* <div className="chat-footer">
                            <div className="chat-input">
                              <form className="chat-form" action="javascript:void(0);">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                <input type="text" className="mail-write-box form-control" placeholder="Message" />
                              </form>
                            </div>
                          </div> */}

                          <div className="chat-footer">
                            <div className="chat-input">
                              <form className="chat-form" onSubmit={handleSendMessage}>
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-message-square">
                                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                                <input
                                  type="text"
                                  className="mail-write-box form-control"
                                  placeholder="Message"
                                  value={message}
                                  onChange={(e) => setMessage(e.target.value)}
                                />
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  END CONTENT AREA  */}
        </div>
        {/* END MAIN CONTAINER */}
      </div>

    </div>
  )
}

export default Chat
