import React from 'react'

const TotalBalance = () => {
    return (
        <div className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 layout-spacing">
            <div className="widget widget-account-invoice-two">
                <div className="widget-content">
                    <div className="account-box">
                        <div className="info">
                            <div className="inv-title">
                                <h5 className="">Total Balance</h5>
                            </div>
                            <div className="inv-balance-info">
                                <p className="inv-balance">$ 41,741.42</p>
                                <span className="inv-stats balance-credited">+ 2453</span>
                            </div>
                        </div>
                        <div className="acc-action">
                            <div className="">
                                <a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg></a>
                                <a href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-credit-card"><rect x={1} y={4} width={22} height={16} rx={2} ry={2} /><line x1={1} y1={10} x2={23} y2={10} /></svg></a>
                            </div>
                            <a href="javascript:void(0);">Upgrade</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalBalance
