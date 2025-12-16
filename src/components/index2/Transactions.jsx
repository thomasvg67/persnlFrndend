import React from 'react'

const Transactions = () => {
    return (
        <div className="widget widget-table-one p-2">
            <div className="widget-heading">
                <h5 className>Transactions</h5>
                <div className="task-action">
                    <div className="dropdown">
                        <a className="dropdown-toggle" href="#" role="button" id="pendingTask" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="pendingTask" style={{ willChange: 'transform' }}>
                            <a className="dropdown-item" href="javascript:void(0);">View Report</a>
                            <a className="dropdown-item" href="javascript:void(0);">Edit Report</a>
                            <a className="dropdown-item" href="javascript:void(0);">Mark as Done</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className="widget-content">
                <div className="transactions-list t-info">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="avatar avatar-xl">
                                    <span className="avatar-title">SP</span>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Shaun Park</h4>
                                <p className="meta-date">10 Jan 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-inc">
                            <p><span>+$36.11</span></p>
                        </div>
                    </div>
                </div>
                <div className="transactions-list">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Electricity Bill</h4>
                                <p className="meta-date">04 Jan 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-dec">
                            <p><span>-$16.44</span></p>
                        </div>
                    </div>
                </div>
                <div className="transactions-list">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="avatar avatar-xl">
                                    <span className="avatar-title">AD</span>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Amy Diaz</h4>
                                <p className="meta-date">31 Jan 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-inc">
                            <p><span>+$66.44</span></p>
                        </div>
                    </div>
                </div>
                <div className="transactions-list t-secondary">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-home"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Netflix</h4>
                                <p className="meta-date">02 Feb 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-dec">
                            <p><span>-$32.00</span></p>
                        </div>
                    </div>
                </div>
                <div className="transactions-list t-info">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="avatar avatar-xl">
                                    <span className="avatar-title">DA</span>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Daisy Anderson</h4>
                                <p className="meta-date">15 Feb 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-inc">
                            <p><span>+$10.08</span></p>
                        </div>
                    </div>
                </div>
                <div className="transactions-list">
                    <div className="t-item">
                        <div className="t-company-name">
                            <div className="t-icon">
                                <div className="avatar avatar-xl">
                                    <span className="avatar-title">OG</span>
                                </div>
                            </div>
                            <div className="t-name">
                                <h4>Oscar Garner</h4>
                                <p className="meta-date">20 Feb 1:00PM</p>
                            </div>
                        </div>
                        <div className="t-rate rate-dec">
                            <p><span>-$22.00</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Transactions
