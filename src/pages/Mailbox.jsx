import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import '../assets/css/apps/mailbox.css';
import Footer from '../components/Footer';

const Mailbox = () => {
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
  const { token, user } = useContext(AuthContext);

  const [composeData, setComposeData] = useState({
    to: '',
    cc: '',
    subject: '',
    content: '',
    // from: 'noreplay@zoomlabs.in', // Default from address
    from: '',
    attachments: []
  });
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalType, setModalType] = useState('compose'); // 'compose', 'reply', 'forward'
  const [attachments, setAttachments] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [emailSuggestions, setEmailSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeField, setActiveField] = useState(null); // 'to' or 'cc'
  const [searchText, setSearchText] = useState('');
const [validationErrors, setValidationErrors] = useState({});


  useEffect(() => {
    if (user && user.email) {
      setComposeData(prev => ({
        ...prev,
        from: user.email
      }));
    }
  }, [user]);

  // Single useEffect for fetching emails
  useEffect(() => {
    const fetchEmails = async () => {
      if (!user?.email || !token) return;

      try {
        setLoading(true);
        const res = await axios.get(`${VITE_BASE_URL}/api/emails`, {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            email: user.email,
            category: category
          }
        });

        const allEmails = res.data.emails || [];
        let filteredEmails = [];

        if (category === 'inbox') {
          filteredEmails = allEmails.filter(email => {
            const toMatch = Array.isArray(email.to)
              ? email.to.includes(user.email)
              : email.to === user.email;

            const ccMatch = Array.isArray(email.cc)
              ? email.cc.includes(user.email)
              : email.cc === user.email;

            return email.category === 'inbox' && (toMatch || ccMatch);
          });
          // Calculate unread count for inbox
          const inboxUnread = filteredEmails.filter(email => !email.read).length;
          setUnreadCount(inboxUnread);
        } else if (category === 'sent') {
          filteredEmails = allEmails.filter(
            email => email.from === user.email && email.category === 'sent'
          );
          setUnreadCount(0);
        } else if (category === 'drafts') {
          filteredEmails = allEmails.filter(
            email => email.from === user.email && email.category === 'drafts'
          );
        } else if (['spam', 'trash', 'important'].includes(category)) {
          filteredEmails = allEmails.filter(email =>
            email.category === category &&
            (
              (Array.isArray(email.to) ? email.to.includes(user.email) : email.to === user.email) ||
              (Array.isArray(email.cc) ? email.cc.includes(user.email) : email.cc === user.email) ||
              email.from === user.email
            )
          );
        } else if (['personal', 'work', 'social', 'private'].includes(category)) {
          filteredEmails = allEmails.filter(email =>
            email.category === category &&
            (
              (Array.isArray(email.to) ? email.to.includes(user.email) : email.to === user.email) ||
              (Array.isArray(email.cc) ? email.cc.includes(user.email) : email.cc === user.email) ||
              email.from === user.email
            )
          );
        } else {
          filteredEmails = [];
        }


        setEmails(filteredEmails);
      } catch (err) {
        console.error('Failed to fetch emails:', err);
        setError('Failed to fetch emails');
      } finally {
        setLoading(false);
      }
    };

    fetchEmails();
  }, [category, user?.email, token, VITE_BASE_URL]);


  useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchText.length >= 3 || searchText.length === 0) {
      loadEmails({ search: searchText });
    }
  }, 300); // 300ms debounce

  return () => clearTimeout(delayDebounce);
}, [searchText]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setComposeData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const invalidFiles = files.filter(file => !validTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError(`Invalid file type: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // setComposeData(prev => ({
    //   ...prev,
    //   attachments: files
    // }));
    setAttachments(prev => [...prev, ...files]);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleSendEmail = async () => {
  setIsSending(true);
  setError(null);
  setSuccess(null);

  const newErrors = {};

  // Validate fields
  if (!composeData.to.trim()) newErrors.to = 'required field';
  if (!composeData.subject.trim()) newErrors.subject = 'required field';
  if (!composeData.content.trim()) newErrors.content = 'required field';

  // Validate email format for 'to' and 'cc'
  const toList = composeData.to.split(',').map(e => e.trim()).filter(Boolean);
  const ccList = composeData.cc ? composeData.cc.split(',').map(e => e.trim()).filter(Boolean) : [];

  const allEmails = [...toList, ...ccList];
  const invalidEmails = allEmails.filter(email => !validateEmail(email));

  if (invalidEmails.length > 0) {
    newErrors.to = `Invalid email(s): ${invalidEmails.join(', ')}`;
  }

  if (Object.keys(newErrors).length > 0) {
    setValidationErrors(newErrors);
    setIsSending(false);
    return;
  }

  // Clear previous errors if validation passes
  setValidationErrors({});

  try {
    const formData = new FormData();
    // formData.append('from', composeData.from);
    // formData.append('to', JSON.stringify(toList));
    // formData.append('cc', JSON.stringify(ccList));
    formData.append('to', toList.join(','));
formData.append('cc', ccList.join(','));
    formData.append('subject', composeData.subject);
    formData.append('content', composeData.content);
    formData.append('category', 'sent');
    formData.append('isDraft', 'false');

    attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });

    await axios.post(`${VITE_BASE_URL}/api/emails/send`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    setSuccess('Email sent successfully!');
    setComposeData({
      to: '',
      cc: '',
      subject: '',
      content: '',
      from: user?.email || '',
      attachments: []
    });
    setAttachments([]);
    fetchEmails();
  } catch (err) {
    console.error(err);
    setError('Failed to send email');
  } finally {
    setIsSending(false);
  }
};


const handleSaveDraft = async () => {
  setIsSending(true);
  setError(null);
  setSuccess(null);

  const hasContent = ['to', 'subject', 'content'].some(
    field => composeData[field] && composeData[field].trim() !== ''
  );

  if (!hasContent) {
    const newErrors = {};
    if (!composeData.to.trim()) newErrors.to = 'Enter To';
    if (!composeData.subject.trim()) newErrors.subject = 'Enter Subject';
    if (!composeData.content.trim()) newErrors.content = 'Enter Content';

    setValidationErrors(newErrors);
    setError('Please fill in at least one field (To, Subject, or Content) to save as draft');
    setIsSending(false);
    return;
  }

  // Clear previous errors if validation passes
  setValidationErrors({});

  try {
    const toList = composeData.to
      ? composeData.to.split(',').map(e => e.trim()).filter(Boolean)
      : [];
    const ccList = composeData.cc
      ? composeData.cc.split(',').map(e => e.trim()).filter(Boolean)
      : [];

    const formData = new FormData();
    // formData.append('from', composeData.from);
    formData.append('from', user.email);
    // formData.append('to', JSON.stringify(toList));
    // formData.append('cc', JSON.stringify(ccList));
    formData.append('to', toList.join(','));
formData.append('cc', ccList.join(','));
    formData.append('subject', composeData.subject);
    formData.append('content', composeData.content);
    formData.append('category', 'draft');
    formData.append('isDraft', 'true');

    attachments.forEach((file, index) => {
      formData.append(`attachments`, file);
    });

    await axios.post(`${VITE_BASE_URL}/api/emails/drafts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`
      }
    });

    setSuccess('Draft saved successfully!');
    setComposeData({
      to: '',
      cc: '',
      subject: '',
      content: '',
      from: user?.email || '',
      attachments: []
    });
    setAttachments([]);
    fetchEmails();
  } catch (err) {
    console.error(err);
    setError('Failed to save draft');
  } finally {
    setIsSending(false);
  }
};


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const markEmailAsRead = async (emailId, readState = true) => {
    if (!emailId || !user?.email) return;

    try {
      await axios.patch(
        `${VITE_BASE_URL}/api/emails/${emailId}/read`,
        { read: readState, userEmail: user.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update the local state
      setEmails(prev => prev.map(e =>
        e._id === emailId ? { ...e, read: readState } : e
      ));

      // Also update selectedEmail if it's the same email
      if (selectedEmail?._id === emailId) {
        setSelectedEmail(prev => ({ ...prev, read: readState }));
      }

      // Update unread count if in inbox
      if (category === 'inbox') {
        setUnreadCount(prev => readState ? prev - 1 : prev + 1);
      }
    } catch (err) {
      console.error("Failed to update email read status", err);
    }
  };

  // Function to handle email selection
  const handleEmailSelect = async (email) => {
    // Only mark as read if not already read (don't mark as unread here)
    if (!email.read) {
      await markEmailAsRead(email._id, true); // Explicitly set to true
    }

    setSelectedEmail(email);

    setTimeout(() => {
      const collapseId = `#mailCollapse${email._id}`;
      const $collapseEl = window.$(collapseId);
      if ($collapseEl.length) {
        $collapseEl.collapse('show');
      }
    }, 100);
  };

  const handleMarkAsRead = async (readState) => {
    if (selectedEmails.length === 0) return;

    try {
      await Promise.all(selectedEmails.map(emailId =>
        axios.patch(`${VITE_BASE_URL}/api/emails/${emailId}/read`,
          { read: readState, userEmail: user.email },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ));

      setEmails(prev => prev.map(e =>
        selectedEmails.includes(e._id) ? { ...e, read: readState } : e
      ));

      // Update unread count if in inbox
      if (category === 'inbox') {
        const changedCount = emails.filter(e =>
          selectedEmails.includes(e._id) && e.read !== readState
        ).length;

        setUnreadCount(prev => readState ? prev - changedCount : prev + changedCount);
      }
    } catch (err) {
      console.error("Mark as read/unread failed", err);
    }
  };

  // const handleCategory = async (category) => {
  //   const allowed = ['important', 'spam', 'trash', 'personal', 'work', 'social', 'private'];
  //   if (selectedEmails.length === 0 || !allowed.includes(category)) return;

  //   try {
  //     await Promise.all(selectedEmails.map(emailId =>
  //       axios.put(`${VITE_BASE_URL}/api/emails/${emailId}`,
  //         { category },
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       )
  //     ));

  //     setEmails(prev => prev.filter(e => !selectedEmails.includes(e._id)));
  //     setSelectedEmails([]); // Clear selection after moving
  //   } catch (err) {
  //     console.error(`Failed to mark as ${category}`, err);
  //   }
  // };

  const handleCategory = async (targetCategory) => {
    if (selectedEmails.length === 0) return;

    try {
      await Promise.all(selectedEmails.map(emailId => {
        // Find the email in the current state
        const email = emails.find(e => e._id === emailId);

        // Determine the new category (toggle between targetCategory and inbox)
        const newCategory = email.category === targetCategory ? 'inbox' : targetCategory;

        return axios.put(
          `${VITE_BASE_URL}/api/emails/${emailId}`,
          { category: newCategory },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }));

      // Update local state
      setEmails(prev => prev.map(e =>
        selectedEmails.includes(e._id)
          ? { ...e, category: e.category === targetCategory ? 'inbox' : targetCategory }
          : e
      ));

      // If we're currently viewing the target category, remove the emails that were toggled to inbox
      if (category === targetCategory) {
        setEmails(prev => prev.filter(e =>
          !selectedEmails.includes(e._id) || e.category !== 'inbox'
        ));
      }

      setSelectedEmails([]); // Clear selection after moving
    } catch (err) {
      console.error(`Failed to toggle ${targetCategory} status`, err);
    }
  };

  const handleReviveSelected = async () => {
    if (selectedEmails.length === 0) {
      setError('Please select emails to revive');
      return;
    }

    try {
      await Promise.all(selectedEmails.map(emailId =>
        axios.put(`${VITE_BASE_URL}/api/emails/${emailId}`,
          {
            dltSts: false,
            category: 'inbox'
          },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      ));

      // Update local state
      setEmails(prev => prev.map(e =>
        selectedEmails.includes(e._id)
          ? { ...e, dltSts: false, category: 'inbox' }
          : e
      ));

      // Clear selection
      setSelectedEmails([]);

      setSuccess(`${selectedEmails.length} email(s) revived successfully`);
    } catch (err) {
      console.error("Failed to revive emails", err);
      setError('Failed to revive selected emails');
    }
  };

  const handlePermanentDelete = async () => {
  if (selectedEmails.length === 0) {
    setError('Please select emails to delete');
    return;
  }

  Swal.fire({
    title: `Are you sure you want to permanently delete ${selectedEmails.length} email(s)?`,
    text: "This action cannot be undone!",
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete permanently!',
    reverseButtons: true,
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await Promise.all(selectedEmails.map(emailId =>
          axios.delete(`${VITE_BASE_URL}/api/emails/${emailId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ));

        setEmails(prev => prev.filter(e => !selectedEmails.includes(e._id)));
        setSelectedEmails([]);
        if (selectedEmail && selectedEmails.includes(selectedEmail._id)) {
          setSelectedEmail(null);
        }

        setSuccess(`${selectedEmails.length} email(s) permanently deleted`);
      } catch (err) {
        console.error("Permanent delete failed", err);
        setError('Failed to permanently delete emails');
      }
    } else {
      console.log("Permanent deletion cancelled.");
    }
  });
};


  // Update the handleCompose function (if you have one) or add this:
  const handleCompose = () => {
    setModalType('compose');
    setShowComposeModal(true);
    setComposeData({
      to: '',
      cc: '',
      subject: '',
      content: '',
      from: user?.email || '',
      attachments: []
    });
  };

  // Update your handleReply function:
  const handleReply = () => {
    if (!selectedEmail) return;

    setModalType('reply');
    setShowComposeModal(true);
    setComposeData(prev => ({
      ...prev,
      to: selectedEmail.from,
      cc: '',
      subject: selectedEmail.subject.startsWith('Re:') ? selectedEmail.subject : `Re: ${selectedEmail.subject}`,
      content: `<p><br></p><blockquote>${selectedEmail.content}</blockquote>`,
      attachments: []
    }));
  };

  // Update your handleForward function:
  const handleForward = () => {
    if (!selectedEmail) return;

    setModalType('forward');
    setShowComposeModal(true);
    setComposeData(prev => ({
      ...prev,
      to: '',
      cc: '',
      subject: selectedEmail.subject.startsWith('Fwd:') ? selectedEmail.subject : `Fwd: ${selectedEmail.subject}`,
      content: `<p><br></p><blockquote>${selectedEmail.content}</blockquote>`,
      attachments: []
    }));
  };

  // Add this function to handle modal close
  const handleCloseModal = () => {
    setShowComposeModal(false);
    setComposeData({
      to: '',
      cc: '',
      subject: '',
      content: '',
      from: user?.email || '',
      attachments: []
    });
      setAttachments([]);
  setValidationErrors({});
  setError(null);
  setSuccess(null);
  };
  const handleCheckboxChange = (emailId, isChecked) => {
    if (isChecked) {
      setSelectedEmails(prev => [...prev, emailId]);
    } else {
      setSelectedEmails(prev => prev.filter(id => id !== emailId));
    }
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedEmails(emails.map(email => email._id));
    } else {
      setSelectedEmails([]);
    }
  };

  // const openDraftInCompose = (email) => {
  //   setComposeData({
  //     to: email.to.join(', '),
  //     cc: email.cc?.join(', '),
  //     subject: email.subject,
  //     content: email.content,
  //     attachments: email.attachments || [],
  //     draftId: email._id
  //   });
  //   setShowComposeModal(true);
  // };

  const openDraftInCompose = (email) => {
    setModalType('compose');
    setComposeData({
      to: Array.isArray(email.to) ? email.to.join(', ') : email.to,
      cc: Array.isArray(email.cc) ? email.cc.join(', ') : email.cc,
      subject: email.subject,
      content: email.content,
      from: email.from || user?.email || '',
      attachments: email.attachments || [],
      draftId: email._id
    });
    setAttachments(email.attachments || []);
    setShowComposeModal(true);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const field = activeField;
      const inputValue = composeData[field];

      const parts = inputValue.split(',');
      const currentQuery = parts[parts.length - 1].trim();

      if (currentQuery.length >= 3) {
        axios.get(`${VITE_BASE_URL}/api/emails/suggestions`, {
          params: { search: currentQuery },
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => {
            setEmailSuggestions(res.data);
            setShowSuggestions(true);
          })
          .catch(err => {
            console.error('Suggestion fetch failed', err);
            setEmailSuggestions([]);
            setShowSuggestions(false);
          });
      } else {
        setEmailSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [composeData.to, composeData.cc, activeField]);

  const handleSuggestionClick = (email) => {
    const updatedList = composeData[activeField]
      .split(',')
      .slice(0, -1)
      .concat(email)
      .join(', ') + ', ';

    setComposeData(prev => ({
      ...prev,
      [activeField]: updatedList
    }));

    setShowSuggestions(false);
    setEmailSuggestions([]);
  };

  const formatSmartDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  return isToday
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }); // e.g., "30 Jul"
};


  return (
    <div className="alt-menu sidebar-noneoverflow">
      {/*  BEGIN NAVBAR  */}
      <Navbar />
      {/*  END NAVBAR  */}
      {/*  BEGIN MAIN CONTAINER  */}
      <div className="main-container sidebar-closed sbar-open" id="container">
        <div className="overlay" />
        <div className="cs-overlay" />
        <div className="search-overlay" />
        {/*  BEGIN SIDEBAR  */}
        <Sidebar />
        {/*  END SIDEBAR  */}
        {/*  BEGIN CONTENT AREA  */}
        <div id="content" className="main-content">
          <div className="layout-px-spacing">
            <div className="row layout-top-spacing">
              <div className="col-xl-12 col-lg-12 col-md-12">
                <div className="row">
                  <div className="col-xl-12  col-md-12">
                    <div className="mail-box-container">
                      <div className="mail-overlay" />
                      <div className="tab-title">
                        <div className="row">
                          <div className="col-md-12 col-sm-12 col-12 text-center mail-btn-container">
                            <a onClick={handleCompose} id="btn-compose-mail" className="btn btn-block" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg></a>
                          </div>
                          {/* {error && (
                            <div className="alert alert-danger mt-3">
                              <strong>Error:</strong> {error}
                              {error.includes('SMTP') && (
                                <div className="mt-2">
                                  Note: Email was saved but not sent via SMTP. Contact support.
                                </div>
                              )}
                            </div>
                          )} */}
                          <div className="col-md-12 col-sm-12 col-12 mail-categories-container">
                            <div className="mail-sidebar-scroll">
                              <ul className="nav nav-pills d-block" id="pills-tab" role="tablist">
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions active" id="mailInbox"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg> <span className="nav-names">Inbox</span> <span className="mail-badge badge" /></a> */}
                                  <a onClick={() => setCategory('inbox')} className={`nav-link list-actions ${category === 'inbox' ? 'active' : ''}`} id="mailInbox"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-inbox"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12" /><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg> <span className="nav-names">Inbox</span> {unreadCount > 0 && (<span className="mail-badge badge">{unreadCount}</span>)}</a>
                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions" id="important"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> <span className="nav-names">Important</span></a> */}
                                  <a onClick={() => setCategory('important')} className={`nav-link list-actions ${category === 'important' ? 'active' : ''}`} id="important"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg> <span className="nav-names">Important</span></a>
                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions" id="draft"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> <span className="nav-names">Draft</span> <span className="mail-badge badge" /></a> */}
                                  <a onClick={() => setCategory('drafts')} className={`nav-link list-actions ${category === 'drafts' ? 'active' : ''}`} id="draft"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> <span className="nav-names">Draft</span> <span className="mail-badge badge" /></a>
                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions" id="sentmail"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> <span className="nav-names"> Sent Mail</span></a> */}
                                  <a onClick={() => setCategory('sent')} className="nav-link list-actions" id="sentmail"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-send"><line x1={22} y1={2} x2={11} y2={13} /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg> <span className="nav-names"> Sent Mail</span></a>
                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions" id="spam"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12} y2={16} /></svg> <span className="nav-names">Spam</span></a> */}
                                  <a onClick={() => setCategory('spam')} className={`nav-link list-actions ${category === 'spam' ? 'active' : ''}`} id="spam"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-circle"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12} y2={16} /></svg> <span className="nav-names">Spam</span></a>
                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions" id="trashed"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> <span className="nav-names">Trash</span></a> */}
                                  <a onClick={() => setCategory('trash')} className={`nav-link list-actions ${category === 'trash' ? 'active' : ''}`} id="trashed"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg> <span className="nav-names">Trash</span></a>

                                </li>
                              </ul>
                              <p className="group-section"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1={7} y1={7} x2={7} y2={7} /></svg> Groups</p>
                              <ul className="nav nav-pills d-block group-list" id="pills-tab2" role="tablist">
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions active g-dot-primary" id="personal"><span>Personal</span></a> */}
                                  <a onClick={() => setCategory('personal')} className={`nav-link list-actions g-dot-primary ${category === 'personal' ? 'active' : ''}`} id="personal"><span>Personal</span></a>

                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions g-dot-warning" id="work"><span>Work</span></a> */}
                                  <a onClick={() => setCategory('work')} className={`nav-link list-actions g-dot-warning ${category === 'work' ? 'active' : ''}`} id="work"><span>Work</span></a>

                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions g-dot-success" id="social"><span>Social</span></a> */}
                                  <a onClick={() => setCategory('social')} className={`nav-link list-actions g-dot-success ${category === 'social' ? 'active' : ''}`} id="social"><span>Social</span></a>

                                </li>
                                <li className="nav-item">
                                  {/* <a className="nav-link list-actions g-dot-danger" id="private"><span>Private</span></a> */}
                                  <a onClick={() => setCategory('private')} className={`nav-link list-actions g-dot-danger ${category === 'private' ? 'active' : ''}`} id="private"><span>Private</span></a>

                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div id="mailbox-inbox" className="accordion mailbox-inbox">
                        <div className="search">
                          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu mail-menu d-lg-none"><line x1={3} y1={12} x2={21} y2={12} /><line x1={3} y1={6} x2={21} y2={6} /><line x1={3} y1={18} x2={21} y2={18} /></svg>
                          <input type="text" className="form-control input-search" placeholder="Search Here..." value={searchText} onChange={(e) => setSearchText(e.target.value)}/>
                        </div>
                        <div className="action-center">
                          <div className>
                            <div className="n-chk">
                              <label className="new-control new-checkbox checkbox-primary">
                                <input type="checkbox" className="new-control-input" id="inboxAll"
                                  checked={selectedEmails.length === emails.length && emails.length > 0}
                                  onChange={(e) => handleSelectAll(e.target.checked)} />
                                <span className="new-control-indicator" /><span>Check All</span>
                              </label>
                            </div>
                          </div>
                          <div className>
                            <a className="nav-link dropdown-toggle d-icon label-group" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" data-toggle="tooltip" data-placement="top" data-original-title="Label" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg></a>
                            <div className="dropdown-menu dropdown-menu-right d-icon-menu">
                              <a onClick={() => handleCategory('personal')} className="label-group-item label-personal dropdown-item position-relative g-dot-primary" href="javascript:void(0);"> Personal</a>
                              <a onClick={() => handleCategory('work')} className="label-group-item label-work dropdown-item position-relative g-dot-warning" href="javascript:void(0);"> Work</a>
                              <a onClick={() => handleCategory('social')} className="label-group-item label-social dropdown-item position-relative g-dot-success" href="javascript:void(0);"> Social</a>
                              <a onClick={() => handleCategory('private')} className="label-group-item label-private dropdown-item position-relative g-dot-danger" href="javascript:void(0);"> Private</a>
                            </div>
                            <svg onClick={() => handleCategory('important')} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" data-toggle="tooltip" data-placement="top" data-original-title="Important" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star action-important"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                            <svg onClick={() => handleCategory('spam')} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" data-toggle="tooltip" data-placement="top" data-original-title="Spam" className="feather feather-alert-circle action-spam"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={12} /><line x1={12} y1={16} x2={12} y2={16} /></svg>
                            <svg onClick={handleReviveSelected} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" data-toggle="tooltip" data-placement="top" data-original-title="Revive Mail" strokeLinejoin="round" className="feather feather-activity revive-mail"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
                            <svg onClick={handlePermanentDelete} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" data-toggle="tooltip" data-placement="top" data-original-title="Delete Permanently" className="feather feather-trash permanent-delete"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                            <div className="dropdown d-inline-block more-actions">
                              <a className="nav-link dropdown-toggle" id="more-actions-btns-dropdown" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx={12} cy={12} r={1} /><circle cx={12} cy={5} r={1} /><circle cx={12} cy={19} r={1} /></svg>
                              </a>
                              <div className="dropdown-menu dropdown-menu-right" aria-labelledby="more-actions-btns-dropdown">
                                <a className="dropdown-item action-mark_as_read" href="javascript:void(0);" onClick={() => handleMarkAsRead(true)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-open"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg> Mark as Read
                                </a>
                                <a className="dropdown-item action-mark_as_unRead" href="javascript:void(0);" onClick={() => handleMarkAsRead(false)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-book"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg> Mark as Unread
                                </a>
                                <a className="dropdown-item action-delete" href="javascript:void(0);" onClick={() => handleCategory('trash')}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" data-toggle="tooltip" data-placement="top" data-original-title="Delete" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg> Trash
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="message-box">
                          <div className="message-box-scroll" id="ct">

                            {/* Loading state */}
                            {loading && (
                              <div className="p-5 text-center">
                                <div className="spinner-border" role="status">
                                  <span className="sr-only">Loading...</span>
                                </div>
                              </div>
                            )}

                            {emails && emails.length > 0 ? (
                              emails.map((email, idx) => (
                                <div key={email._id || idx}
                                  // onClick={(e) => {
                                  //   if (e.target === e.currentTarget || e.target.closest('.mail-item')) {
                                  //     handleEmailSelect(email);
                                  //   }
                                  // }} 
                                  onClick={(e) => {
                                    if (e.target.closest('.new-checkbox') || e.target.closest('.n-chk')) return;

                                    if (category === 'drafts') {
                                      openDraftInCompose(email);
                                    } else {
                                      handleEmailSelect(email);
                                    }
                                  }}

                                  id={!email.read ? "unread-promotion-page" : undefined} className={`mail-item mailInbox ${selectedEmail?._id === email._id ? 'active' : ''}`}>
                                  <div className="animated animatedFadeInUp fadeInUp" id="mailHeadingThree">
                                    <div className="mb-0">
                                      <div className="mail-item-heading social collapsed" data-toggle="collapse" role="navigation" data-target={`#mailCollapse${email._id}`} aria-expanded="false">
                                        <div className="mail-item-inner">
                                          <div className="d-flex">
                                            <div className="n-chk text-center">
                                              <label className="new-control new-checkbox checkbox-primary">
                                                <input type="checkbox" className="new-control-input inbox-chkbox" checked={selectedEmails.includes(email._id)}
                                                  onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleCheckboxChange(email._id, e.target.checked);
                                                  }} />
                                                <span className="new-control-indicator" />
                                              </label>
                                            </div>
                                            <div className="f-head">
                                              <img src="assets/img/90x90.jpg" className="user-profile" alt="avatar" />
                                            </div>
                                            <div className="f-body">
                                              <div className="meta-mail-time">
                                                <p className="user-email" data-mailto={category === 'sent' ? email.to : email.from}>
                                                  {category === 'sent' ? `To: ${email.to}` : email.from}
                                                </p>
                                              </div>
                                              <div className="meta-title-tag">
                                                <p className="mail-content-excerpt">
                                                  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-paperclip attachment-indicator">
                                                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                                                  </svg>
                                                  <span className="mail-title">{email.subject || '(No Subject)'} - </span>
                                                  <span dangerouslySetInnerHTML={{ __html: email.content?.substring(0, 150) || '' }} />
                                                </p>
                                                <div className="tags">
                                                  {email.category === 'personal' && <span className="g-dot-primary" />}
                                                  {email.category === 'work' && <span className="g-dot-warning" />}
                                                  {email.category === 'social' && <span className="g-dot-success" />}
                                                  {email.category === 'private' && <span className="g-dot-danger" />}
                                                </div>
                                                <p className="meta-time align-self-center">
                                                  {/* {new Date(email.crtdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} */}
                                                  {formatSmartDate(email.crtdOn)}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        {/* Optionally: Add attachments display */}
                                        {email.attachments?.length > 0 && (
                                          <div className="attachments">
                                            {email.attachments.map((att, aIdx) => (
                                              <span key={aIdx}>{att.filename || 'Attachment'}</span>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                </div>
                              ))
                            ) : (
                              !loading && (
                                <div className="p-5 text-muted text-center">
                                  {category === 'inbox' && 'No emails in inbox'}
                                  {category === 'sent' && 'No sent emails'}
                                  {category === 'important' && 'No important emails'}
                                  {category === 'trash' && 'No trash emails'}
                                  {category === 'drafts' && 'No draft emails'}
                                  {category === 'spam' && 'No spam emails'}
                                </div>
                              )
                            )}


                          </div>
                        </div>


                        {selectedEmail && (
                          <div className="content-box" style={{ display: selectedEmail ? 'block' : 'none' }}>
                            <div className="d-flex msg-close">
                              <svg
                                onClick={() => setSelectedEmail(null)}
                                xmlns="http://www.w3.org/2000/svg"
                                width={24}
                                height={24}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="feather feather-arrow-left close-message"
                              >
                                <line x1={19} y1={12} x2={5} y2={12} />
                                <polyline points="12 19 5 12 12 5" />
                              </svg>
                              <h2 className="mail-title" data-selectedmailtitle>{selectedEmail.subject || '(No Subject)'}</h2>
                            </div>

                            <div id={`mailCollapse${selectedEmail._id}`} className="collapse show" aria-labelledby={`mailHeading${selectedEmail._id}`} data-parent="#mailbox-inbox">
                              <div className="mail-content-container mailInbox" data-mailfrom={selectedEmail.from} data-mailto={selectedEmail.to}>
                                <div className="d-flex justify-content-between">
                                  <div className="d-flex user-info">
                                    {category !== 'sent' ?
                                      <div className="f-head">
                                        <img src="assets/img/90x90.jpg" className="user-profile" alt="avatar" />
                                      </div> : ""}
                                    <div className="f-body">
                                      {category !== 'sent' ?
                                        <div className="meta-title-tag">
                                          <h4 className="mail-usr-name">
                                            {category === 'sent' ? selectedEmail.to : selectedEmail.from}
                                          </h4>
                                        </div> : ""}
                                      <div className="meta-mail-time">
                                        <p className="user-email">
                                          {/* {category === 'sent' ? `To: ${selectedEmail.to} Cc: ${selectedEmail.cc}` : ` ${selectedEmail.from}`} */}
                                           {category === 'sent' ? (
    <>
      To: {Array.isArray(selectedEmail.to) ? selectedEmail.to.join(', ') : selectedEmail.to}
      {selectedEmail.cc && selectedEmail.cc.length > 0 && (
        <>
          {' '}Cc: {Array.isArray(selectedEmail.cc) ? selectedEmail.cc.join(', ') : selectedEmail.cc}
        </>
      )}
    </>
  ) : (
    selectedEmail.from
  )}
                                        </p>
                                        <p></p>
                                        <p className="mail-content-meta-date current-recent-mail">
                                          {formatDate(selectedEmail.crtdOn)}
                                        </p>
                                        {/* <p className="meta-time align-self-center">
                                          {new Date(selectedEmail.crtdOn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p> */}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="action-btns">
                                    <a onClick={handleReply} href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Reply">
                                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-left reply">
                                        <polyline points="9 14 4 9 9 4" />
                                        <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
                                      </svg>
                                    </a>
                                    <a onClick={handleForward} href="javascript:void(0);" data-toggle="tooltip" data-placement="top" data-original-title="Forward">
                                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-corner-up-right forward">
                                        <polyline points="15 14 20 9 15 4" />
                                        <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
                                      </svg>
                                    </a>
                                  </div>
                                </div>

                                <div
                                  className="mail-content"
                                  dangerouslySetInnerHTML={{ __html: selectedEmail.content || '' }}
                                />

                                {selectedEmail.attachments?.length > 0 && (
                                  <div className="attachments">
                                    <h6 className="attachments-section-title">Attachments</h6>
                                    {selectedEmail.attachments.map((attachment, index) => (
                                      <div key={index} className={`attachment file-${attachment.type || 'pdf'}`}>
                                        <div className="media">
                                          <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1={16} y1={13} x2={8} y2={13} />
                                            <line x1={16} y1={17} x2={8} y2={17} />
                                            <polyline points="10 9 9 9 8 9" />
                                          </svg>
                                          <div className="media-body">
                                            <p className="file-name">{attachment.filename || `Attachment ${index + 1}`}</p>
                                            <p className="file-size">{attachment.size ? `${Math.round(attachment.size / 1024)}kb` : 'Unknown size'}</p>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                        )}

                      </div>
                    </div>
                    {/* Modal */}
                    <div className={`modal fade ${showComposeModal ? 'show' : ''}`} id="composeMailModal" tabIndex={-1} role="dialog" aria-hidden="true" style={{ display: showComposeModal ? 'block' : 'none' }}>
                      <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                        <div className="modal-content">
                          <div className="modal-body">
                            <svg onClick={() => setShowComposeModal(false) } xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x close" data-dismiss="modal"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg>
                            <div className="compose-box">
                              <div className="compose-content">
                                <form onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSendEmail();
                                }}>
                                  {/* <div className="row">
                                    <div className="col-md-12">
                                      <div className="d-flex mb-4 mail-form">
                                        <p>From:</p>
                                        <select className="form-control" id="m-form" name="from" value={composeData.from} onChange={handleInputChange}>
                                          <option value={composeData.from}>{composeData.from}</option>
                                          <option value="shaun@mail.com">Shaun Park &lt;shaun@mail.com&gt;</option>
                                        </select>
                                      </div>
                                    </div>
                                  </div> */}

                                  <div className="row">
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center mb-4 mail-to">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user me-2">
                                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                          <circle cx={12} cy={7} r={4} />
                                        </svg>
                                        <input
                                          type="email"
                                          id="m-to"
                                          name="to"
                                          placeholder="To"
                                          className={`form-control flex-grow-1 ${validationErrors.to ? 'border border-danger' : ''}`}
                                          value={composeData.to}
                                          onChange={handleInputChange}
                                          onFocus={() => setActiveField('to')}
                                          autoComplete="off"
                                        />
                                        {/* {validationErrors.to && <small className="text-danger mt-1">{validationErrors.to}</small>} */}
                                        {activeField === 'to' && showSuggestions && emailSuggestions.length > 0 && (
                                          <ul className="suggestion-dropdown">
                                            {emailSuggestions.map((sug, idx) => (
                                              <li key={idx} onClick={() => handleSuggestionClick(sug.email)}>
                                                {sug.name} &lt;{sug.email}&gt;
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-6">
                                      <div className="d-flex align-items-center mb-4 mail-cc">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-list me-2">
                                          <line x1={8} y1={6} x2={21} y2={6} />
                                          <line x1={8} y1={12} x2={21} y2={12} />
                                          <line x1={8} y1={18} x2={21} y2={18} />
                                          <line x1={3} y1={6} x2={3} y2={6} />
                                          <line x1={3} y1={12} x2={3} y2={12} />
                                          <line x1={3} y1={18} x2={3} y2={18} />
                                        </svg>
                                        <input
                                          type="text"
                                          id="m-cc"
                                          name="cc"
                                          placeholder="Cc (comma separated)"
                                          className={`form-control flex-grow-1 ${validationErrors.cc ? 'border border-danger' : ''}`}
                                          value={composeData.cc}
                                          onChange={handleInputChange}
                                          onFocus={() => setActiveField('cc')}
                                          autoComplete="off"
                                        />
                                        {/* {validationErrors.cc && <small className="text-danger mt-1">{validationErrors.cc}</small>} */}
                                        {activeField === 'cc' && showSuggestions && emailSuggestions.length > 0 && (
                                          <ul className="suggestion-dropdown">
                                            {emailSuggestions.map((sug, idx) => (
                                              <li key={idx} onClick={() => handleSuggestionClick(sug.email)}>
                                                {sug.name} &lt;{sug.email}&gt;
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="d-flex mb-4 mail-subject">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                    <div className="w-100">
                                      <input type="text" id="m-subject" name="subject" placeholder="Subject" className={`form-control ${validationErrors.subject ? 'border border-danger' : ''}`} value={composeData.subject} onChange={handleInputChange} />
                                      {/* {validationErrors.subject && <small className="text-danger mt-1">{validationErrors.subject}</small>} */}
                                      <span className="validation-text" />
                                    </div>
                                  </div>
                                  <div className="d-flex">
                                    <input type="file" name="attachments" className="form-control-file" id="mail_File_attachment" multiple="multiple" onChange={handleFileChange} />

                                  </div>
                                  <div className="row">
                                    <div className="col-md-12">
                                      <div className="contact-review mb-3">
                                        <i className="flaticon-chat" />
                                        <p className='mt-2 '>Content : </p>
                                        <div style={{ height: '200px', overflow: 'hidden' }}>
                                          <CKEditor
                                            editor={ClassicEditor}
                                            config={{ licenseKey: 'GPL' }}
                                            data={composeData.content}
                                            onReady={(editor) => {
                                              // console.log('CKEditor ready!', editor);
                                            }}
                                            onChange={(event, editor) => {
                                              const data = editor.getData();
                                              setComposeData(prev => ({
                                                ...prev,
                                                content: data
                                              }));
                                            }}
                                          />
                                          {/* {validationErrors.content && <small className="text-danger mt-2 d-block">{validationErrors.content}</small>} */}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer">
                            {/* Save button - shown for all types */}
                            <button
                              id="btn-save"
                              className="btn float-left"
                              onClick={handleSaveDraft}
                            >
                              {modalType === 'compose' ? 'Save' :
                                modalType === 'reply' ? 'Save Reply' : 'Save Forward'}
                            </button>

                            {/* Discard button - shown for all types */}
                            <button
                              className="btn"
                              onClick={handleCloseModal}
                            >
                              <i className="flaticon-delete-1" /> Discard
                            </button>

                            {/* Send/Reply/Forward button - shown based on type */}
                            {modalType === 'compose' && (
                              <button
                                id="btn-send"
                                className="btn"
                                onClick={handleSendEmail}
                                disabled={isSending}
                              >
                                {isSending ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Sending...
                                  </>
                                ) : 'Send'}
                              </button>
                            )}

                            {modalType === 'reply' && (
                              <button
                                id="btn-reply"
                                className="btn"
                                onClick={handleSendEmail}
                                disabled={isSending}
                              >
                                {isSending ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Replying...
                                  </>
                                ) : 'Reply'}
                              </button>
                            )}

                            {modalType === 'forward' && (
                              <button
                                id="btn-fwd"
                                className="btn"
                                onClick={handleSendEmail}
                                disabled={isSending}
                              >
                                {isSending ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Forwarding...
                                  </>
                                ) : 'Forward'}
                              </button>
                            )}
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div><Footer />
        </div>
        
        {/*  END CONTENT AREA  */}
      </div>
      {/* END MAIN CONTAINER */}
      {/* BEGIN GLOBAL MANDATORY SCRIPTS */}
      {/* END GLOBAL MANDATORY SCRIPTS */}
    </div>

  )
}

export default Mailbox
