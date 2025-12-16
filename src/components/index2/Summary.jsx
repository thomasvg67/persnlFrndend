import React from 'react'

const Summary = () => {
    return (
        <div className="widget widget-three p-4">
            <div className="widget-heading">
                <h5 className>Summary</h5>
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
                <div className="order-summary">
                    <div className="summary-list">
                        <div className="w-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-shopping-bag"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1={3} y1={6} x2={21} y2={6} /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                        </div>
                        <div className="w-summary-details">
                            <div className="w-summary-info">
                                <h6>Income</h6>
                                <p className="summary-count">$92,600</p>
                            </div>
                            <div className="w-summary-stats">
                                <div className="progress">
                                    <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{ width: '90%' }} aria-valuenow={90} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="summary-list">
                        <div className="w-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-tag"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1={7} y1={7} x2={7} y2={7} /></svg>
                        </div>
                        <div className="w-summary-details">
                            <div className="w-summary-info">
                                <h6>Profit</h6>
                                <p className="summary-count">$37,515</p>
                            </div>
                            <div className="w-summary-stats">
                                <div className="progress">
                                    <div className="progress-bar bg-gradient-success" role="progressbar" style={{ width: '65%' }} aria-valuenow={65} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="summary-list">
                        <div className="w-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x={1} y={4} width={22} height={16} rx={2} ry={2} /><line x1={1} y1={10} x2={23} y2={10} /></svg>
                        </div>
                        <div className="w-summary-details">
                            <div className="w-summary-info">
                                <h6>Expenses</h6>
                                <p className="summary-count">$55,085</p>
                            </div>
                            <div className="w-summary-stats">
                                <div className="progress">
                                    <div className="progress-bar bg-gradient-warning" role="progressbar" style={{ width: '80%' }} aria-valuenow={80} aria-valuemin={0} aria-valuemax={100} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Summary
