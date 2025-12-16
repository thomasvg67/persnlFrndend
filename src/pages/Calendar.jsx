import React, { useContext, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { AuthContext } from '../contexts/AuthContext';

const Calendar = () => {
    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;
    const { token } = useContext(AuthContext);

    useEffect(() => {
        window.VITE_BASE_URL = VITE_BASE_URL;
        window.AUTH_TOKEN = token;

        // Only initialize after token is available
        if (window.initCalendar && token) {
            window.initCalendar();
        }
    }, [token]);


    return (
        <div >
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
                            <div className="row layout-top-spacing" id="cancel-row">
                                <div className="col-xl-12 col-lg-12 col-md-12">
                                    <div className="statbox widget box box-shadow">
                                        <div className="widget-content widget-content-area">
                                            <div className="calendar-upper-section">
                                                <div className="row">
                                                    <div className="col-md-8 col-12">
                                                        <div className="labels">
                                                            <p className="label label-primary">Work</p>
                                                            <p className="label label-warning">Travel</p>
                                                            <p className="label label-success">Personal</p>
                                                            <p className="label label-danger">Important</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 col-12">
                                                        <form action="javascript:void(0);" className="form-horizontal mt-md-0 mt-3 text-md-right text-center">
                                                            <button id="myBtn" className="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar mr-2"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> Add Event</button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="calendar" />
                                        </div>
                                    </div>
                                </div>
                                {/* The Modal */}
                                <div id="addEventsModal" className="modal animated fadeIn">
                                    <div className="modal-dialog modal-dialog-centered">
                                        {/* Modal content */}
                                        <div className="modal-content">
                                            <div className="modal-body">
                                                <span className="close">×</span>
                                                <div className="add-edit-event-box">
                                                    <div className="add-edit-event-content">
                                                        <h5 className="add-event-title modal-title">Add Events</h5>
                                                        <h5 className="edit-event-title modal-title">Edit Events</h5>
                                                        <form className>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <label htmlFor="start-date" for="write-e">Event Title:</label>
                                                                    <div className="d-flex event-title">
                                                                        <input id="write-e" type="text" placeholder="Enter Title" className="form-control" name="task" />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-12">
                                                                    <label htmlFor="event-category">Category:</label>
                                                                    <select id="event-category" className="form-control">
                                                                        <option value="">Select Category</option>
                                                                        <option value="birthday">Birthday</option>
                                                                        <option value="medical-insurance">Medical Insurance</option>
                                                                        <option value="health-insurance">Health Insurance</option>
                                                                        <option value="vehicle-insurance">Vehicle Insurance</option>
                                                                        <option value="deposit">Deposit</option>
                                                                        <option value="wedding-anniversary">Wedding Anniversary</option>
                                                                        <option value="others">Others</option>
                                                                    </select>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6 col-12">
                                                                    <div className="form-group start-date">
                                                                        <label htmlFor="start-date">From:</label>
                                                                        <div className="d-flex">
                                                                            <input id="start-date" placeholder="Start Date" className="form-control" type="text" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 col-sm-6 col-12">
                                                                    <div className="form-group end-date">
                                                                        <label htmlFor="end-date" >To:</label>
                                                                        <div className="d-flex">
                                                                            <input id="end-date" placeholder="End Date" type="text" className="form-control" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <label htmlFor="taskdescription" className>Event Description:</label>
                                                                    <div className="d-flex event-description">
                                                                        <textarea id="taskdescription" placeholder="Enter Description" rows={3} className="form-control" name="taskdescription" defaultValue={""} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-md-12">
                                                                    <div className="event-badge">
                                                                        <p className>Badge:</p>
                                                                        <div className="d-sm-flex d-block">
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-primary">
                                                                                    <input type="radio" className="new-control-input" name="marker" defaultValue="bg-primary" />
                                                                                    <span className="new-control-indicator" />Work
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-warning">
                                                                                    <input type="radio" className="new-control-input" name="marker" defaultValue="bg-warning" />
                                                                                    <span className="new-control-indicator" />Travel
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-success">
                                                                                    <input type="radio" className="new-control-input" name="marker" defaultValue="bg-success" />
                                                                                    <span className="new-control-indicator" />Personal
                                                                                </label>
                                                                            </div>
                                                                            <div className="n-chk">
                                                                                <label className="new-control new-radio radio-danger">
                                                                                    <input type="radio" className="new-control-input" name="marker" defaultValue="bg-danger" />
                                                                                    <span className="new-control-indicator" />Important
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="modal-footer">
                                                <button id="discard" className="btn" data-dismiss="modal">Discard</button>
                                                <button id="add-e" className="btn">Add Task</button>
                                                <button id="edit-event" className="btn">Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  END CONTENT AREA  */}
                </div>
            </div>

        </div>
    )
}

export default Calendar
