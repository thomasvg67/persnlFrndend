import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Nav from "../components/Nav";
// import '../assets/plugins/editors/quill/quill.snow.css';
import '../assets/css/apps/todolist.css';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AppsToDoList = () => {

    const url = import.meta.env.VITE_BASE_URL;
    // const [token, setToken] = useState(localStorage.getItem('token') || null);
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);

    const hasLoaded = useRef(false);
    function loadScript(src, options = {}) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;

            // Options for loading behavior
            if (options.async) script.async = true;
            if (options.defer) script.defer = true;

            script.onload = () => resolve(script);
            script.onerror = () => reject(new Error(`Failed to load ${src}`));

            document.body.appendChild(script);
        });
    }
    function formatToMMDDYYYY(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0'); // JS months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    useEffect(() => {
        if (hasLoaded.current) return;
        hasLoaded.current = true;

        (async () => {
            try {
                console.log('Loading padStart fix...');
                await loadScript('/assets/js/ie11fix/fn.fix-padStart.js', { async: true });

                console.log('Loading Quill...');
                await loadScript('/plugins/editors/quill/quill.js', { async: true });

                console.log('Loading todoList...');
                await loadScript('/assets/js/apps/todoList.js', { defer: true });

                console.log('All scripts loaded in order!');

                getTodos();

            } catch (err) {
                console.error(err);
            }
        })();

        return () => {
        };
    }, []);




    //get todos list
    const [todos, setTodos] = useState([]);
    const [pendingtodos, setPendingTodos] = useState([]);
    const [trashtodos, setTrashtodos] = useState([]);
    const [taskdonetodos, setTaskdonetodos] = useState([]);
    const [importanttodos, setImportanttodos] = useState([]);
    const getTodos = () => {
        setLoading(true);
        axios.get(url + '/api/todolist/', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => { setTodos(res.data); })
            .catch((err) => { console.log(err); })

        axios.get(url + '/api/todolist/pending', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => { setPendingTodos(res.data); })
            .catch((err) => { console.log(err); })

        axios.get(url + '/api/todolist/trash', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => { setTrashtodos(res.data); })
            .catch((err) => { console.log(err); })

        axios.get(url + '/api/todolist/taskdone', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => { setTaskdonetodos(res.data); })
            .catch((err) => { console.log(err); })

        axios.get(url + '/api/todolist/important', { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => { setImportanttodos(res.data); })
            .catch((err) => { console.log(err); })
            .finally(() => setLoading(false));
    }

    // Save todos
    const [task, setTask] = useState('');
    const [description, setDescription] = useState('');
    const [startdate, setStartdate] = useState('');
    const [id, setId] = useState('');

    const handleSubmit = (e) => {
        const payload = {
            "task": task,
            "description": description,
            "start_date": startdate,
            "dlt_sts": 1,
            "task_done": 0,
            "important": 0,
            "created_by": "admin",
            "priority": "middle",
        };
        axios.post(url + '/api/todolist/', payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })

        setTask('');
        setDescription('');
        setStartdate('');
        setId('');
    };

    //Edit Todos
    const handleEdit = (id) => {
        axios.get(url + '/api/todolist/' + id, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                setTask(res.data.task);
                setDescription(res.data.description);
                setStartdate(formatToMMDDYYYY(res.data.start_date));
                setId(res.data._id);
            })
            .catch((err) => { console.log(err); })
    }

    // Update Todos
    const handleUpdate = () => {
        const payload = {
            "id": id,
            "task": task,
            "description": description,
            "start_date": startdate,
            "dlt_sts": 1,
            "task_done": 0,
            "important": 0,
        };
        axios.put(url + '/api/todolist/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })

        setTask('');
        setDescription('');
        setStartdate('');
        setId('');
    }

    // delete Todos
    const handleDelete = (id) => {
        axios.delete(url + '/api/todolist/' + id, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    // Mark Todos as important
    const handleImportant = (id) => {
        const payload = {};
        axios.put(url + '/api/todolist/markimportant/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    // Mark Todos as Task Done
    const handleTaskDone = (id) => {
        const payload = {};
        axios.put(url + '/api/todolist/taskdone/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    // Mark Todos as Not Task Done
    const handleTaskDoneRemove = (id) => {
        const payload = {};
        axios.put(url + '/api/todolist/taskdoneremove/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    const handleTask = (e, id) => {
        if (e.target.checked === true) {
            handleTaskDone(id);
        } else {
            handleTaskDoneRemove(id);
        }
    }

    const handleRevive = (id) => {
        const payload = {};
        axios.put(url + '/api/todolist/revive/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    const handlePermanentDelete = (id) => {
        axios.delete(url + '/api/todolist/permanentdelete/' + id, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    const handlePriority = (priority, id) => {
        const payload = {
            "priority": priority,
        };
        axios.put(url + '/api/todolist/priority/' + id, payload, { headers: { Authorization: `Bearer ${token}` }, withCredentials: true })
            .then((res) => {
                console.log(res);
                getTodos();
            })
            .catch((err) => { console.log(err); })
    }

    return (
        <div className="alt-menu sidebar-noneoverflow">
            <Navbar />
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay"></div>
                <div className="search-overlay"></div>
                <Sidebar />

                <div className="mt-container"></div>
                <div id="content" className="main-content">
                    <div className="layout-px-spacing">

                        <div className="row layout-top-spacing">
                            <div className="col-xl-12 col-lg-12 col-md-12">

                                <div className="mail-box-container">
                                    <div className="mail-overlay"></div>

                                    <div className="tab-title">
                                        <div className="row">
                                            <div className="col-md-12 col-sm-12 col-12 text-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-clipboard"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                                <h5 className="app-title">Todo List</h5>
                                            </div>

                                            <div className="todoList-sidebar-scroll">
                                                <div className="col-md-12 col-sm-12 col-12 mt-4 pl-0">
                                                    <ul className="nav nav-pills d-block" id="pills-tab" role="tablist">
                                                        <li className="nav-item">
                                                            <a className="nav-link list-actions active" id="all-list" data-toggle="pill" href="#pills-inbox" role="tab" aria-selected="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3" y2="6"></line><line x1="3" y1="12" x2="3" y2="12"></line><line x1="3" y1="18" x2="3" y2="18"></line></svg> Inbox <span className="todo-badge badge"></span></a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link list-actions" id="todo-task-done" data-toggle="pill" href="#pills-sentmail" role="tab" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> Done <span className="todo-badge badge"></span></a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link list-actions" id="todo-task-pending" data-toggle="pill" href="#pills-pending" role="tab" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg> Pending <span className="todo-badge badge"></span></a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link list-actions" id="todo-task-important" data-toggle="pill" href="#pills-important" role="tab" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Important <span className="todo-badge badge"></span></a>
                                                        </li>
                                                        <li className="nav-item">
                                                            <a className="nav-link list-actions" id="todo-task-trash" data-toggle="pill" href="#pills-trash" role="tab" aria-selected="false"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg> Trash</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>

                                            <a className="btn" id="addTask" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg> New Task</a>
                                        </div>
                                    </div>

                                    <div id="todo-inbox" className="accordion todo-inbox">
                                        <div className="search">
                                            <input type="text" className="form-control input-search" name="input-search" placeholder="Search Here..." />
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-menu mail-menu d-lg-none"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                                        </div>

                                        <div className="todo-box">

                                            <div id="ct" className="todo-box-scroll ps ps--active-y">
                                                {todos.map((todo, i) => {
                                                    const chkbox = 'todo_' + (i + 1);
                                                    var prior;
                                                    if (todo.priority === 'high') {
                                                        prior = 'dropdown-toggle danger';
                                                    } else if (todo.priority === 'low') {
                                                        prior = 'dropdown-toggle primary';
                                                    } else {
                                                        prior = 'dropdown-toggle warning';
                                                    }
                                                    const date = new Date(todo.start_date);
                                                    const formatted = date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    return (
                                                        <div key={todo._id} className="todo-item all-list">
                                                            <div className="todo-item-inner">
                                                                <div className="n-chk text-center">
                                                                    <label htmlFor={chkbox} className="new-control new-checkbox checkbox-primary">
                                                                        <input type="checkbox" id={chkbox} name={chkbox} className="new-control-input inbox-chkbox"
                                                                            onClick={(e) => handleTask(e, todo._id)} />
                                                                        <span className="new-control-indicator"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="todo-content">
                                                                    <h5 className="todo-heading" data-todoheading={todo.task}>{todo.task}</h5>
                                                                    <p className="meta-date">{formatted}</p>
                                                                    <p className="todo-text" data-todohtml={todo.description} data-todotext={JSON.stringify({ ops: [{ insert: `${todo.description}\n` }] })}>{todo.description}</p>
                                                                </div>

                                                                <div className="priority-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown p-dropdown">
                                                                        <a className={prior} href="#" role="button" id="dropdownMenuLink-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-1">
                                                                            <a className="dropdown-item danger" href="#" onClick={(e) => handlePriority('high', todo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> High</a>
                                                                            <a className="dropdown-item warning" href="#" onClick={(e) => handlePriority('middle', todo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Middle</a>
                                                                            <a className="dropdown-item primary" href="#" onClick={(e) => handlePriority('low', todo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Low</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="action-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown">
                                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-2">
                                                                            <a className="edit dropdown-item" role="button" href="#" onClick={(e) => { e.preventDefault(); handleEdit(todo._id); }}>Edit</a>
                                                                            <a className="important dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleImportant(todo._id); }} >Important</a>
                                                                            <a className="dropdown-item delete" href="#" onClick={(e) => { e.preventDefault(); handleDelete(todo._id) }} >Delete</a>
                                                                            <a className="dropdown-item permanent-delete" href="#">Permanent Delete</a>
                                                                            <a className="dropdown-item revive" href="#">Revive Task</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {pendingtodos.map((pendingtodo, i) => {
                                                    const chkbox = 'pendingtodo_' + (i + 1);
                                                    var prior;
                                                    if (pendingtodo.priority === 'high') {
                                                        prior = 'dropdown-toggle danger';
                                                    } else if (pendingtodo.priority === 'low') {
                                                        prior = 'dropdown-toggle primary';
                                                    } else {
                                                        prior = 'dropdown-toggle warning';
                                                    }
                                                    const date = new Date(pendingtodo.start_date);
                                                    const formatted = date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    return (
                                                        <div key={pendingtodo._id} className="todo-item todo-task-pending">
                                                            <div className="todo-item-inner">
                                                                <div className="n-chk text-center">
                                                                    <label htmlFor={chkbox} className="new-control new-checkbox checkbox-primary">
                                                                        <input type="checkbox" id={chkbox} name={chkbox} className="new-control-input inbox-chkbox"
                                                                            onClick={(e) => handleTask(e, pendingtodo._id)} />
                                                                        <span className="new-control-indicator"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="todo-content">
                                                                    <h5 className="todo-heading" data-todoheading={pendingtodo.task}>{pendingtodo.task}</h5>
                                                                    <p className="meta-date">{formatted}</p>
                                                                    <p className="todo-text" data-todohtml={pendingtodo.description} data-todotext={JSON.stringify({ ops: [{ insert: `${pendingtodo.description}\n` }] })}>{pendingtodo.description}</p>
                                                                </div>

                                                                <div className="priority-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown p-dropdown">
                                                                        <a className={prior} href="#" role="button" id="dropdownMenuLink-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-1">
                                                                            <a className="dropdown-item danger" href="#" onClick={(e) => handlePriority('high', pendingtodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> High</a>
                                                                            <a className="dropdown-item warning" href="#" onClick={(e) => handlePriority('middle', pendingtodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Middle</a>
                                                                            <a className="dropdown-item primary" href="#" onClick={(e) => handlePriority('low', pendingtodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Low</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="action-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown">
                                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-2">
                                                                            <a className="edit dropdown-item" role="button" href="#" onClick={(e) => { e.preventDefault(); handleEdit(pendingtodo._id); }}>Edit</a>
                                                                            <a className="important dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleImportant(pendingtodo._id); }} >Important</a>
                                                                            <a className="dropdown-item delete" href="#" onClick={(e) => { e.preventDefault(); handleDelete(pendingtodo._id) }} >Delete</a>
                                                                            <a className="dropdown-item permanent-delete" href="#">Permanent Delete</a>
                                                                            <a className="dropdown-item revive" href="#">Revive Task</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {taskdonetodos.map((taskdonetodo, i) => {
                                                    const chkbox = 'taskdonetodo_' + (i + 1);
                                                    var prior;
                                                    if (taskdonetodo.priority === 'high') {
                                                        prior = 'dropdown-toggle danger';
                                                    } else if (taskdonetodo.priority === 'low') {
                                                        prior = 'dropdown-toggle primary';
                                                    } else {
                                                        prior = 'dropdown-toggle warning';
                                                    }
                                                    const date = new Date(taskdonetodo.start_date);
                                                    const formatted = date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    return (
                                                        <div key={taskdonetodo._id} className="todo-item all-list todo-task-done">
                                                            <div className="todo-item-inner">
                                                                <div className="n-chk text-center">
                                                                    <label htmlFor={chkbox} className="new-control new-checkbox checkbox-primary">
                                                                        <input type="checkbox" id={chkbox} name={chkbox} className="new-control-input inbox-chkbox" defaultChecked
                                                                            onClick={(e) => handleTask(e, taskdonetodo._id)} />
                                                                        <span className="new-control-indicator"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="todo-content">
                                                                    <h5 className="todo-heading" data-todoheading={taskdonetodo.task}>{taskdonetodo.task}</h5>
                                                                    <p className="meta-date">{formatted}</p>
                                                                    <p className="todo-text" data-todohtml={taskdonetodo.description} data-todotext={JSON.stringify({ ops: [{ insert: `${taskdonetodo.description}\n` }] })}>{taskdonetodo.description}</p>
                                                                </div>

                                                                <div className="priority-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown p-dropdown">
                                                                        <a className={prior} href="#" role="button" id="dropdownMenuLink-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-1">
                                                                            <a className="dropdown-item danger" href="#" onClick={(e) => handlePriority('high', taskdonetodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> High</a>
                                                                            <a className="dropdown-item warning" href="#" onClick={(e) => handlePriority('middle', taskdonetodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Middle</a>
                                                                            <a className="dropdown-item primary" href="#" onClick={(e) => handlePriority('low', taskdonetodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Low</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="action-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown">
                                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-2">
                                                                            <a className="edit dropdown-item" role="button" href="#" onClick={(e) => { e.preventDefault(); handleEdit(taskdonetodo._id); }}>Edit</a>
                                                                            <a className="important dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleImportant(taskdonetodo._id); }} >Important</a>
                                                                            <a className="dropdown-item delete" href="#" onClick={(e) => { e.preventDefault(); handleDelete(taskdonetodo._id) }} >Delete</a>
                                                                            <a className="dropdown-item permanent-delete" href="#">Permanent Delete</a>
                                                                            <a className="dropdown-item revive" href="#">Revive Task</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {importanttodos.map((importanttodo, i) => {
                                                    const chkbox = 'importanttodo_' + (i + 1);
                                                    var prior;
                                                    if (importanttodo.priority === 'high') {
                                                        prior = 'dropdown-toggle danger';
                                                    } else if (importanttodo.priority === 'low') {
                                                        prior = 'dropdown-toggle primary';
                                                    } else {
                                                        prior = 'dropdown-toggle warning';
                                                    }
                                                    const date = new Date(importanttodo.start_date);
                                                    const formatted = date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    return (
                                                        <div key={importanttodo._id} className="todo-item all-list todo-task-important">
                                                            <div className="todo-item-inner">
                                                                <div className="n-chk text-center">
                                                                    <label htmlFor={chkbox} className="new-control new-checkbox checkbox-primary">
                                                                        <input type="checkbox" id={chkbox} name={chkbox} className="new-control-input inbox-chkbox"
                                                                            onClick={(e) => handleTask(e, importanttodo._id)} />
                                                                        <span className="new-control-indicator"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="todo-content">
                                                                    <h5 className="todo-heading" data-todoheading={importanttodo.task}>{importanttodo.task}</h5>
                                                                    <p className="meta-date">{formatted}</p>
                                                                    <p className="todo-text" data-todohtml={importanttodo.description} data-todotext={JSON.stringify({ ops: [{ insert: `${importanttodo.description}\n` }] })}>{importanttodo.description}</p>
                                                                </div>

                                                                <div className="priority-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown p-dropdown">
                                                                        <a className={prior} href="#" role="button" id="dropdownMenuLink-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-1">
                                                                            <a className="dropdown-item danger" href="#" onClick={(e) => handlePriority('high', importanttodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> High</a>
                                                                            <a className="dropdown-item warning" href="#" onClick={(e) => handlePriority('middle', importanttodo._id)} ><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Middle</a>
                                                                            <a className="dropdown-item primary" href="#" onClick={(e) => handlePriority('low', importanttodo._id)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Low</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="action-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown">
                                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-2">
                                                                            <a className="edit dropdown-item" role="button" href="#" onClick={(e) => { e.preventDefault(); handleEdit(importanttodo._id); }}>Edit</a>
                                                                            <a className="important dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleImportant(importanttodo._id); }} >Important</a>
                                                                            <a className="dropdown-item delete" href="#" onClick={(e) => { e.preventDefault(); handleDelete(importanttodo._id) }} >Delete</a>
                                                                            <a className="dropdown-item permanent-delete" href="#">Permanent Delete</a>
                                                                            <a className="dropdown-item revive" href="#">Revive Task</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                {trashtodos.map((trashtodo, i) => {
                                                    const chkbox = 'trashtodo_' + (i + 1);
                                                    const date = new Date(trashtodo.start_date);
                                                    const formatted = date.toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: '2-digit',
                                                        year: 'numeric',
                                                    });
                                                    return (
                                                        <div key={trashtodo._id} className="todo-item all-list todo-task-trash">
                                                            <div className="todo-item-inner">
                                                                <div className="n-chk text-center">
                                                                    <label htmlFor={chkbox} className="new-control new-checkbox checkbox-primary">
                                                                        <input type="checkbox" id={chkbox} name={chkbox} className="new-control-input inbox-chkbox" />
                                                                        <span className="new-control-indicator"></span>
                                                                    </label>
                                                                </div>

                                                                <div className="todo-content">
                                                                    <h5 className="todo-heading" data-todoheading={trashtodo.task}> Trash : {trashtodo.task}</h5>
                                                                    <p className="meta-date">{formatted}</p>
                                                                    <p className="todo-text" data-todohtml={trashtodo.description} data-todotext={JSON.stringify({ ops: [{ insert: `${trashtodo.description}\n` }] })}>{trashtodo.description}</p>
                                                                </div>

                                                                <div className="priority-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown p-dropdown">
                                                                        <a className="dropdown-toggle warning" href="#" role="button" id="dropdownMenuLink-1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-1">
                                                                            <a className="dropdown-item danger" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> High</a>
                                                                            <a className="dropdown-item warning" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Middle</a>
                                                                            <a className="dropdown-item primary" href="#"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-alert-octagon"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12" y2="16"></line></svg> Low</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="action-dropdown custom-dropdown-icon">
                                                                    <div className="dropdown">
                                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink-2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                                        </a>

                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink-2">
                                                                            <a className="edit dropdown-item" role="button" href="#" onClick={(e) => { e.preventDefault(); handleEdit(trashtodo._id); }}>Edit</a>
                                                                            <a className="important dropdown-item" href="#" onClick={(e) => { e.preventDefault(); handleImportant(trashtodo._id); }} >Important</a>
                                                                            <a className="dropdown-item delete" href="#" onClick={(e) => { e.preventDefault(); handleDelete(trashtodo._id) }} >Delete</a>
                                                                            <a className="dropdown-item permanent-delete" href="#" onClick={(e) => { e.preventDefault(); handlePermanentDelete(trashtodo._id) }} >Permanent Delete</a>
                                                                            <a className="dropdown-item revive" href="#" onClick={(e) => { e.preventDefault(); handleRevive(trashtodo._id) }}>Revive Task</a>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>


            </div>

            <div className="modal fade" id="todoShowListItem" tabIndex="-1" role="dialog" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x close" data-dismiss="modal"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            <div className="compose-box">
                                <div className="compose-content">
                                    <h5 className="task-heading"></h5>
                                    <p className="task-text"></p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" data-dismiss="modal"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg> Close</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="addTaskModal" tabIndex="-1" role="dialog" aria-labelledby="addTaskModalTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-body">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x close" data-dismiss="modal"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            <div className="compose-box">
                                <div className="compose-content" id="addTaskModalTitle">
                                    <h5 className="">Add Task</h5>
                                    <form>
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="d-flex mail-to mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3 flaticon-notes"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                    <div className="w-100">
                                                        <input id="task" type="text" placeholder="Task" className="form-control" name="task"
                                                            value={task} onChange={(e) => setTask(e.target.value)} required />
                                                        <span className="validation-text"></span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
                                                <div className="d-flex mail-to mb-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3 flaticon-notes"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                                                    <div className="w-100">
                                                        <input id="startdate" type="date" placeholder="Start Date" className="form-control" name="startdate"
                                                            value={startdate} onChange={(e) => setStartdate(e.target.value)} required />
                                                        <span className="validation-text"></span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="d-flex  mail-subject mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-file-text flaticon-menu-list"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            <div className="w-100" style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    config={{
                                                        licenseKey: 'GPL'
                                                    }}
                                                    data={description}
                                                    onReady={(editor) => {
                                                        console.log('Editor is ready!', editor);
                                                    }}
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        setDescription(data);
                                                    }}
                                                />
                                                <span className="validation-text"></span>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" data-dismiss="modal"><i className="flaticon-cancel-12"></i> Discard</button>
                            <button className="btn add-tsk" onClick={() => handleSubmit()} >Add Task</button>
                            <button className="btn edit-tsk" onClick={() => handleUpdate()} >Save</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <Footer/> */}
            <Footer />
        </div>
    )
}

export default AppsToDoList;