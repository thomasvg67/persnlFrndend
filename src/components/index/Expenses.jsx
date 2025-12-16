import React from 'react'

const Expenses = () => {
  return (
    <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
                                    <div className="widget widget-card-four">
                                        <div className="widget-content">
                                            <div className="w-header">
                                                <div className="w-info">
                                                    <h6 className="value">Expenses</h6>
                                                </div>
                                                <div className="task-action">
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="pendingTask" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="pendingTask" style={{ willChange: 'transform' }}>
                                                            <a className="dropdown-item" href="javascript:void(0);">This Week</a>
                                                            <a className="dropdown-item" href="javascript:void(0);">Last Week</a>
                                                            <a className="dropdown-item" href="javascript:void(0);">Last Month</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="w-content">
                                                <div className="w-info">
                                                    <p className="value">$ 45,141 <span>this week</span> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trending-up"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg></p>
                                                </div>
                                            </div>
                                            <div className="w-progress-stats">
                                                <div className="progress">
                                                    <div className="progress-bar bg-gradient-secondary" role="progressbar" style={{ width: '57%' }} aria-valuenow={57} aria-valuemin={0} aria-valuemax={100} />
                                                </div>
                                                <div className="">
                                                    <div className="w-icon">
                                                        <p>57%</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
  )
}

export default Expenses
