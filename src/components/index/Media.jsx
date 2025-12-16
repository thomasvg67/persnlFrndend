import React from 'react'

const Media = () => {
    return (
        <>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                <div className="widget widget-card-one">
                    <div className="widget-content">
                        <div className="media">
                            <div className="w-img">
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                            </div>
                            <div className="media-body">
                                <h6>Jimmy Turner</h6>
                                <p className="meta-date-time">Monday, Nov 18</p>
                            </div>
                        </div>
                        <p>"Duis aute irure dolor" in reprehenderit in voluptate velit esse cillum "dolore eu fugiat" nulla pariatur. Excepteur sint occaecat cupidatat non proident.</p>
                        <div className="w-action">
                            <div className="card-like">
                                <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" /></svg>
                                <span>551 Likes</span>
                            </div>
                            <div className="read-more">
                                <a href="javascript:void(0);">Read More <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg></a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                <div className="widget widget-card-two">
                    <div className="widget-content">
                        <div className="media">
                            <div className="w-img">
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                            </div>
                            <div className="media-body">
                                <h6>Dev Summit - New York</h6>
                                <p className="meta-date-time">Bronx, NY</p>
                            </div>
                        </div>
                        <div className="card-bottom-section">
                            <h5>4 Members Going</h5>
                            <div className="img-group">
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                                <img src="assets/img/90x90.jpg" alt="avatar" />
                            </div>
                            <a href="javascript:void(0);" className="btn">View Details</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                <div className="widget widget-five">
                    <div className="widget-heading">
                        <a href="javascript:void(0)" className="task-info">
                            <div className="usr-avatar">
                                <span>FD</span>
                            </div>
                            <div className="w-title">
                                <h5>Figma Design</h5>
                                <span>Design Reset</span>
                            </div>
                        </a>
                        <div className="task-action">
                            <div className="dropdown">
                                <a className="dropdown-toggle" href="#" role="button" id="pendingTask" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right" aria-labelledby="pendingTask" style={{ willChange: 'transform' }}>
                                    <a className="dropdown-item" href="javascript:void(0);">View Project</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Edit Project</a>
                                    <a className="dropdown-item" href="javascript:void(0);">Mark as Done</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="widget-content">
                        <p>Doloribus nisi vel suscipit modi, optio ex repudiandae voluptatibus officiis commodi. Nesciunt quas aut neque incidunt!</p>
                        <div className="progress-data">
                            <div className="progress-info">
                                <div className="task-count"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-check-square"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg><p>5 Tasks</p></div>
                                <div className="progress-stats"><p>86.2%</p></div>
                            </div>
                            <div className="progress">
                                <div className="progress-bar bg-primary" role="progressbar" style={{ width: '65%' }} aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} />
                            </div>
                        </div>
                        <div className="meta-info">
                            <div className="due-time">
                                <p><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-clock"><circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" /></svg> 3 Days Left</p>
                            </div>
                            <div className="avatar--group">
                                <div className="avatar translateY-axis more-group">
                                    <span className="avatar-title">+6</span>
                                </div>
                                <div className="avatar translateY-axis">
                                    <img alt="avatar" src="assets/img/90x90.jpg" />
                                </div>
                                <div className="avatar translateY-axis">
                                    <img alt="avatar" src="assets/img/90x90.jpg" />
                                </div>
                                <div className="avatar translateY-axis">
                                    <img alt="avatar" src="assets/img/90x90.jpg" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Media
