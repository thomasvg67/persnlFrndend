import React from 'react'

const RecentActivities = () => {
    return (
        <div className="widget widget-activity-four p-2">
            <div className="widget-heading">
                <h5 className>Recent Activities</h5>
            </div>
            <div className="widget-content">
                <div className="mt-container mx-auto">
                    <div className="timeline-line">
                        <div className="item-timeline timeline-primary">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p><span>Updated</span> Server Logs</p>
                                <span className="badge">Pending</span>
                                <p className="t-time">Just Now</p>
                            </div>
                        </div>
                        <div className="item-timeline timeline-success">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Send Mail to <a href="javascript:void(0);">HR</a> and <a href="javascript:void(0);">Admin</a></p>
                                <span className="badge">Completed</span>
                                <p className="t-time">2 min ago</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-danger">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Backup <span>Files EOD</span></p>
                                <span className="badge">Pending</span>
                                <p className="t-time">14:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-dark">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Collect documents from <a href="javascript:void(0);">Sara</a></p>
                                <span className="badge">Completed</span>
                                <p className="t-time">16:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-warning">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Conference call with <a href="javascript:void(0);">Marketing Manager</a>.</p>
                                <span className="badge">In progress</span>
                                <p className="t-time">17:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-secondary">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Rebooted Server</p>
                                <span className="badge">Completed</span>
                                <p className="t-time">17:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-warning">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Send contract details to Freelancer</p>
                                <span className="badge">Pending</span>
                                <p className="t-time">18:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-dark">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Kelly want to increase the time of the project.</p>
                                <span className="badge">In Progress</span>
                                <p className="t-time">19:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-success">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Server down for maintanence</p>
                                <span className="badge">Completed</span>
                                <p className="t-time">19:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-secondary">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Malicious link detected</p>
                                <span className="badge">Block</span>
                                <p className="t-time">20:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-warning">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Rebooted Server</p>
                                <span className="badge">Completed</span>
                                <p className="t-time">23:00</p>
                            </div>
                        </div>
                        <div className="item-timeline timeline-primary">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p><span>Updated</span> Server Logs</p>
                                <span className="badge">Pending</span>
                                <p className="t-time">Just Now</p>
                            </div>
                        </div>
                        <div className="item-timeline timeline-success">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Send Mail to <a href="javascript:void(0);">HR</a> and <a href="javascript:void(0);">Admin</a></p>
                                <span className="badge">Completed</span>
                                <p className="t-time">2 min ago</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-danger">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Backup <span>Files EOD</span></p>
                                <span className="badge">Pending</span>
                                <p className="t-time">14:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-dark">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Collect documents from <a href="javascript:void(0);">Sara</a></p>
                                <span className="badge">Completed</span>
                                <p className="t-time">16:00</p>
                            </div>
                        </div>
                        <div className="item-timeline  timeline-warning">
                            <div className="t-dot" data-original-title title>
                            </div>
                            <div className="t-text">
                                <p>Conference call with <a href="javascript:void(0);">Marketing Manager</a>.</p>
                                <span className="badge">In progress</span>
                                <p className="t-time">17:00</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tm-action-btn">
                    <button className="btn"><span>View All</span> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-arrow-right"><line x1={5} y1={12} x2={19} y2={12} /><polyline points="12 5 19 12 12 19" /></svg></button>
                </div>
            </div>
        </div>
    )
}

export default RecentActivities
