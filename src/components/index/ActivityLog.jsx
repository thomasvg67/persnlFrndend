import React from 'react'

const ActivityLog = () => {
    return (
        <div className="col-xl-3 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
            <div className="widget widget-activity-five">
                <div className="widget-heading">
                    <h5 className="">Activity Log</h5>
                    <div className="task-action">
                        <div className="dropdown">
                            <a className="dropdown-toggle" href="#" role="button" id="pendingTask" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                            </a>
                            <div className="dropdown-menu dropdown-menu-right" aria-labelledby="pendingTask" style={{ willChange: 'transform' }}>
                                <a className="dropdown-item" href="javascript:void(0);">View All</a>
                                <a className="dropdown-item" href="javascript:void(0);">Mark as Read</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="widget-content">
                    <div className="w-shadow-top" />
                    <div className="mt-container mx-auto">
                        <div className="timeline-line">
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-secondary"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>New project created : <a href="javscript:void(0);"><span>[Cork Admin Template]</span></a></h5>
                                    </div>
                                    <p>27 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-success"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>Mail sent to <a href="javascript:void(0);">HR</a> and <a href="javascript:void(0);">Admin</a></h5>
                                    </div>
                                    <p>28 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-primary"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12" /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>Server Logs Updated</h5>
                                    </div>
                                    <p>27 Feb, 2020</p>
                                </div>
                            </div>
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-danger"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check"><polyline points="20 6 9 17 4 12" /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>Task Completed : <a href="javscript:void(0);"><span>[Backup Files EOD]</span></a></h5>
                                    </div>
                                    <p>01 Mar, 2020</p>
                                </div>
                            </div>
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-warning"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-file"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><polyline points="13 2 13 9 20 9" /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>Documents Submitted from <a href="javascript:void(0);">Sara</a></h5>
                                        <span className="" />
                                    </div>
                                    <p>10 Mar, 2020</p>
                                </div>
                            </div>
                            <div className="item-timeline timeline-new">
                                <div className="t-dot">
                                    <div className="t-dark"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-server"><rect x={2} y={2} width={20} height={8} rx={2} ry={2} /><rect x={2} y={14} width={20} height={8} rx={2} ry={2} /><line x1={6} y1={6} x2={6} y2={6} /><line x1={6} y1={18} x2={6} y2={18} /></svg></div>
                                </div>
                                <div className="t-content">
                                    <div className="t-uppercontent">
                                        <h5>Server rebooted successfully</h5>
                                        <span className="" />
                                    </div>
                                    <p>06 Apr, 2020</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-shadow-bottom" />
                </div>
            </div>
        </div>
    )
}

export default ActivityLog
