import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const Scrum = () => {

    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
    const { token } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [operationLoading, setOperationLoading] = useState(false);
    const [name, setName] = useState('');
    const [lists, setLists] = useState(null);
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDesc, setTaskDesc] = useState('');
    const [selectedList, setSelectedList] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [deleteType, setDeleteType] = useState('task'); // 'task' or 'list'
    const [deleteList, setDeleteList] = useState(null);
    const [deleteTask, setDeleteTask] = useState(null);
    const [clearTasksList, setClearTasksList] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${VITE_BASE_URL}/api/scrum-board`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setLists(res.data);
        } catch (error) {
            console.error('Error fetching lists:', error);
        } finally {
            setLoading(false);
        };
    };

    const handleAddList = async () => {
        setOperationLoading(true);
        try {
            await axios.post(
                `${VITE_BASE_URL}/api/scrum-board/list`,
                { lstName: name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setName('');
            fetchData();
            toast.success('List added successfully!');
            $('#addListModal').modal('hide'); // If you're using jQuery modals
        } catch (err) {
            toast.error('List Name is required');
            console.error('Error adding list:', err);
        } finally {
            setOperationLoading(false);
        }
    };

    const handleEditList = async () => {
        setOperationLoading(true);
        try {
            if (!lists) return;

            await axios.put(
                `${VITE_BASE_URL}/api/scrum-board/list/${selectedList.id}`,
                { lstName: name },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setName('');
            setSelectedList(null);
            fetchData();
            toast.success('List updated successfully!');
            $('#addListModal').modal('hide');

        } catch (err) {
            console.error('Error editing list:', err);
            toast.error(err.response?.data?.message || 'Failed to edit list');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleAddTask = async () => {
        if (!taskTitle.trim()) {
            toast.error('Task title is required');
            return;
        }

        setOperationLoading(true);
        try {
            await axios.post(
                `${VITE_BASE_URL}/api/scrum-board/task`,
                {
                    tskName: taskTitle,
                    tskDesc: taskDesc,
                    listId: selectedList.id,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            $('#addTaskModal').modal('hide');
            setTaskTitle('');
            setTaskDesc('');
            setSelectedList(null);
            fetchData();
            toast.success('Task added successfully!');
        } catch (err) {
            console.error('Add task failed:', err);
            toast.error(err.response?.data?.message || 'Failed to add task');
        } finally {
            setOperationLoading(false);
        }
    };


    const handleEditTask = async () => {
        if (!taskTitle.trim()) {
            toast.error('Task title is required');
            return;
        }
        setOperationLoading(true);
        try {
            await axios.put(
                `${VITE_BASE_URL}/api/scrum-board/task/${selectedTask.id}`,
                {
                    tskName: taskTitle,
                    tskDesc: taskDesc,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            $('#addTaskModal').modal('hide');
            setTaskTitle('');
            setTaskDesc('');
            setSelectedTask(null);
            setSelectedList(null);
            fetchData();
            toast.success('Task updated successfully!');
        } catch (err) {
            console.error('Edit task failed:', err);
            toast.error(err.response?.data?.message || 'Failed to save task');
        } finally {
            setOperationLoading(false);
        }
    };

    const handleDelete = async () => {
        setOperationLoading(true);
        try {
            if (deleteType === 'list' && deleteList) {
                await axios.put(
                    `${VITE_BASE_URL}/api/scrum-board/list/${deleteList.id}/delete`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('List deleted successfully!');
            } else if (deleteType === 'task' && deleteTask) {
                await axios.put(
                    `${VITE_BASE_URL}/api/scrum-board/task/${deleteTask.id}/delete`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('Task deleted successfully!');
            } else if (deleteType === 'clear' && clearTasksList) {
                await axios.put(
                    `${VITE_BASE_URL}/api/scrum-board/list/${clearTasksList.id}/clear-tasks`,
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                toast.success('All tasks in the list cleared!');
            }

            $('#deleteConformation').modal('hide');
            setDeleteList(null);
            setDeleteTask(null);
            setClearTasksList(null);
            fetchData();
        } catch (err) {
            console.error('Delete failed:', err);
            toast.error(err.response?.data?.message || 'Failed to delete');
        } finally {
            setOperationLoading(false);
        }
    };


    const handleClearAllTasks = async (listId) => {
        if (!window.confirm('Are you sure you want to delete all tasks in this list?')) return;
        setOperationLoading(true);
        try {
            await axios.put(
                `${VITE_BASE_URL}/api/scrum-board/list/${listId}/clear-tasks`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            fetchData(); // refresh after clearing
        } catch (err) {
            console.error('Failed to clear tasks:', err);
            toast.error(err.response?.data?.message || 'Failed to clear tasks');
        } finally {
            setOperationLoading(false);
        }
    };


    const onAddList = () => {
        setName('');
        setSelectedList(null);
        $('#addListModal').modal('show');
    };

    const onEditList = (list) => {
        setName(list.title);
        setSelectedList(list);
        $('#addListModal').modal('show');
    };

    const onAddTask = (list) => {
        setSelectedList(list);
        setSelectedTask(null);
        setTaskTitle('');
        setTaskDesc('');
        setShowTaskModal(true);
        $('#addTaskModal').modal('show');
    };

    const onEditTask = (task) => {
        setSelectedTask(task);
        setTaskTitle(task.title || '');
        setTaskDesc(task.text || '');
        setShowTaskModal(true);
        $('#addTaskModal').modal('show');
    };

    const onConfirmDeleteList = (list) => {
        setDeleteType('list');
        setDeleteList(list);
        setDeleteTask(null);
        $('#deleteConformation').modal('show');
    };

    const onConfirmDeleteTask = (task) => {
        setDeleteType('task');
        setDeleteTask(task);
        setDeleteList(null);
        $('#deleteConformation').modal('show');
    };

    const onConfirmClearAllTasks = (list) => {
        setDeleteType('clear');   // custom type for clearing tasks
        setClearTasksList(list);
        setDeleteList(null);
        setDeleteTask(null);
        $('#deleteConformation').modal('show');
    };


    if (loading) return <Loader />;

    return (
        <div className="alt-menu sidebar-noneoverflow">
            <Navbar />
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay" />
                <div className="cs-overlay" />
                <div className="search-overlay" />
                <Sidebar />
                <div id="content" classname="main-content">
                    <div className="layout-px-spacing">
                        <div className="action-btn layout-top-spacing mb-5">
                            <button id="add-list" className="btn btn-dark" onClick={onAddList}>Add List</button>
                        </div>
                        <div className="modal fade" id="addTaskModal" tabIndex={-1} role="dialog" aria-labelledby="addTaskModalTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <div className="compose-box">
                                            <div className="compose-content" id="addTaskModalTitle">
                                                <h5 className="add-task-title" style={{ display: selectedTask ? 'none' : 'block' }}>Add Task</h5>
                                                <h5 className="edit-task-title" style={{ display: selectedTask ? 'block' : 'none' }}>Edit Task</h5>
                                                <div className="addTaskAccordion" id="add_task_accordion">
                                                    <div className="card task-text-progress">
                                                        <div id="collapseTwo" className="collapse show" aria-labelledby="headingTwo" data-parent="#add_task_accordion">
                                                            <div className="card-body">
                                                                <form action="javascript:void(0);" onSubmit={(e) => e.preventDefault()}>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="task-title mb-4">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
                                                                                <input id="s-task" type="text" placeholder="Task" className="form-control" name="task" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} required />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="col-md-12">
                                                                            <div className="task-badge mb-4">
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                                                                                <textarea id="s-text" placeholder="Task Text" className="form-control" name="taskText" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} required />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn" data-dismiss="modal" onClick={() => { setSelectedTask(null); setSelectedList(null); setTaskTitle(''); setTaskDesc(''); }}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg> Discard</button>
                                        {!selectedTask && (<button data-btnfn="addTask" className="btn add-tsk" onClick={handleAddTask}>Add Task</button>)}
                                        {selectedTask && (<button data-btnfn="editTask" className="btn edit-tsk" onClick={handleEditTask}>Save</button>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal fade" id="addListModal" tabIndex={-1} role="dialog" aria-labelledby="addListModalTitle" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <div className="compose-box">
                                            <div className="compose-content" id="addListModalTitle">
                                                <h5 className="add-list-title" style={{ display: selectedList ? 'none' : 'block' }}>Add List</h5>
                                                <h5 className="edit-list-title" style={{ display: selectedList ? 'block' : 'none' }}>Edit List</h5>
                                                <form action="javascript:void(0);" onSubmit={(e) => e.preventDefault()}>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="list-title">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-list"><line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2={3} y2={6} /><line x1={3} y1={12} x2={3} y2={12} /><line x1={3} y1={18} x2={3} y2={18} /></svg>
                                                                <input id="s-list-name" type="text" placeholder="List Name" className="form-control" name="task" value={name} onChange={(e) => setName(e.target.value)} required />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button className="btn" data-dismiss="modal" onClick={() => { setName(''); setSelectedList(null); }}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-x"><line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} /></svg> Discard</button>
                                        {!selectedList && (<button className="btn add-list" onClick={handleAddList}>Add List</button>)}
                                        {selectedList && (<button className="btn edit-list" onClick={handleEditList}>Save</button>)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Modal */}
                        <div className="modal fade" id="deleteConformation" tabIndex={-1} role="dialog" aria-labelledby="deleteConformationLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" role="document">
                                <div className="modal-content" id="deleteConformationLabel">
                                    <div className="modal-header">
                                        <div className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                                        </div>
                                        <h5 className="modal-title" id="exampleModalLabel">Delete the task?</h5>
                                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                        </button>
                                    </div>
                                    <div className="modal-body">
                                        <p className=""> {deleteType === 'list' && "If you delete the list it will be gone forever. Are you sure you want to proceed?"}</p>
                                        <p className=""> {deleteType === 'task' && "If you delete the task it will be gone forever. Are you sure you want to proceed?"}</p>
                                        <p className="">{deleteType === 'clear' && "If you clear all the list it will be gone forever. Are you sure you want to proceed?"}</p>
                                    </div>
                                    <div className="modal-footer">
                                        <button type="button" className="btn" data-dismiss="modal">Cancel</button>
                                        <button type="button" className="btn btn-danger" data-remove="task" onClick={handleDelete}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row scrumboard" id="cancel-row">
                            <div className="col-lg-12 layout-spacing">
                                <div className="task-list-section">

                                    {loading ? (<Loader />) :
                                        lists && lists.length > 0 ? (lists.map((list) => (
                                            <div key={list.id} data-section="s-in-progress" className="task-list-container" data-connect="sorting">
                                                <div className="connect-sorting">
                                                    <div className="task-container-header">
                                                        <h6 className="s-heading" data-listtitle={list.title}>{list.title}</h6>
                                                        <div className="dropdown">
                                                            <a className="dropdown-toggle" href="#" role="button" id={`dropdownMenuLink-${list.id}`} data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                            </a>
                                                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby={`dropdownMenuLink-${list.id}`}>
                                                                <a className="dropdown-item list-edit" href="javascript:void(0);" onClick={() => onEditList(list)}>Edit</a>
                                                                <a className="dropdown-item list-delete" href="javascript:void(0);" onClick={() => onConfirmDeleteList(list)}>Delete</a>
                                                                <a className="dropdown-item list-clear-all" href="javascript:void(0);" onClick={() => onConfirmClearAllTasks(list)}>Clear All</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="connect-sorting-content" data-sortable="true">
                                                        {list.tasks?.map(task => (
                                                            <div key={task.id} data-draggable="true" className="card task-text-progress" style={{}}>
                                                                <div className="card-body">
                                                                    <div className="task-header">
                                                                        <div className="">
                                                                            <h4 className data-tasktitle={task.title}>{task.title}</h4>
                                                                        </div>
                                                                        <div onClick={() => onEditTask(task)}>
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 s-task-edit"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                                                                        </div>
                                                                    </div>
                                                                    <div className="task-body">
                                                                        <div className="task-content">
                                                                            <p className data-tasktext={task.text || 'No description'}>{task.text || 'No description'}</p>
                                                                        </div>
                                                                        <div className="task-bottom">
                                                                            <div className="tb-section-1">
                                                                                <span data-taskdate={task.date || ''}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>{task.date || 'No due date'}</span>
                                                                            </div>
                                                                            <div className="tb-section-2" onClick={() => onConfirmDeleteTask(task)}>
                                                                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2 s-task-delete"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="add-s-task">
                                                        <a className="addTask" onClick={() => onAddTask(list)}><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus-circle"><circle cx={12} cy={12} r={10} /><line x1={12} y1={8} x2={12} y2={16} /><line x1={8} y1={12} x2={16} y2={12} /></svg> Add Task</a>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        ) : (
                                            <div className="text-center mt-4">
                                                <h5>No data saved</h5>
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}


export default Scrum
