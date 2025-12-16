import React from 'react'

const Wallet = () => {
    return (
        <div className="widget widget-account-invoice-three">
            <div className="widget-heading">
                <div className="wallet-usr-info">
                    <div className="usr-name">
                        <span><img src="assets/img/90x90.jpg" alt="admin-profile" className="img-fluid" /> Alan Green</span>
                    </div>
                    <div className="add">
                        <span><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-plus"><line x1={12} y1={5} x2={12} y2={19} /><line x1={5} y1={12} x2={19} y2={12} /></svg></span>
                    </div>
                </div>
                <div className="wallet-balance">
                    <p>Wallet Balance</p>
                    <h5 className><span className="w-currency">$</span>2953</h5>
                </div>
            </div>
            <div className="widget-amount">
                <div className="w-a-info funds-received">
                    <span>Received <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-up"><polyline points="18 15 12 9 6 15" /></svg></span>
                    <p>$97.99</p>
                </div>
                <div className="w-a-info funds-spent">
                    <span>Spent <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevron-down"><polyline points="6 9 12 15 18 9" /></svg></span>
                    <p>$53.00</p>
                </div>
            </div>
            <div className="widget-content">
                <div className="bills-stats">
                    <span>Pending</span>
                </div>
                <div className="invoice-list">
                    <div className="inv-detail">
                        <div className="info-detail-1">
                            <p>Netflix</p>
                            <p><span className="w-currency">$</span> <span className="bill-amount">13.85</span></p>
                        </div>
                        <div className="info-detail-2">
                            <p>BlueHost VPN</p>
                            <p><span className="w-currency">$</span> <span className="bill-amount">15.66</span></p>
                        </div>
                    </div>
                    <div className="inv-action">
                        <a href="javascript:void(0);" className="btn btn-outline-primary view-details">View Details</a>
                        <a href="javascript:void(0);" className="btn btn-outline-primary pay-now">Pay Now $29.51</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet
