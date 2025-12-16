import React from 'react'

const TopSellProd = () => {
    return (
        <div className="widget widget-table-three p-2">
            <div className="widget-heading">
                <h5 className>Top Selling Product</h5>
            </div>
            <div className="widget-content">
                <div className="table-responsive">
                    <table className="table table-scroll">
                        <thead>
                            <tr>
                                <th><div className="th-content">Product</div></th>
                                <th><div className="th-content th-heading">Price</div></th>
                                <th><div className="th-content th-heading">Discount</div></th>
                                <th><div className="th-content">Sold</div></th>
                                <th><div className="th-content">Source</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="td-content product-name"><img src="assets/img/90x90.jpg" alt="product" /><div className="align-self-center"><p className="prd-name">Headphone</p><p className="prd-category text-primary">Digital</p></div></div></td>
                                <td><div className="td-content"><span className="pricing">$168.09</span></div></td>
                                <td><div className="td-content"><span className="discount-pricing">$60.09</span></div></td>
                                <td><div className="td-content">170</div></td>
                                <td><div className="td-content"><a href="javascript:void(0);" className="text-danger"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg> Direct</a></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content product-name"><img src="assets/img/90x90.jpg" alt="product" /><div className="align-self-center"><p className="prd-name">Shoes</p><p className="prd-category text-warning">Faishon</p></div></div></td>
                                <td><div className="td-content"><span className="pricing">$108.09</span></div></td>
                                <td><div className="td-content"><span className="discount-pricing">$47.09</span></div></td>
                                <td><div className="td-content">130</div></td>
                                <td><div className="td-content"><a href="javascript:void(0);" className="text-primary"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg> Google</a></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content product-name"><img src="assets/img/90x90.jpg" alt="product" /><div className="align-self-center"><p className="prd-name">Watch</p><p className="prd-category text-danger">Accessories</p></div></div></td>
                                <td><div className="td-content"><span className="pricing">$88.00</span></div></td>
                                <td><div className="td-content"><span className="discount-pricing">$20.00</span></div></td>
                                <td><div className="td-content">66</div></td>
                                <td><div className="td-content"><a href="javascript:void(0);" className="text-warning"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg> Ads</a></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content product-name"><img src="assets/img/90x90.jpg" alt="product" /><div className="align-self-center"><p className="prd-name">Laptop</p><p className="prd-category text-primary">Digital</p></div></div></td>
                                <td><div className="td-content"><span className="pricing">$110.00</span></div></td>
                                <td><div className="td-content"><span className="discount-pricing">$33.00</span></div></td>
                                <td><div className="td-content">35</div></td>
                                <td><div className="td-content"><a href="javascript:void(0);" className="text-info"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg> Email</a></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content product-name"><img src="assets/img/90x90.jpg" alt="product" /><div className="align-self-center"><p className="prd-name">Camera</p><p className="prd-category text-primary">Digital</p></div></div></td>
                                <td><div className="td-content"><span className="pricing">$126.04</span></div></td>
                                <td><div className="td-content"><span className="discount-pricing">$26.04</span></div></td>
                                <td><div className="td-content">30</div></td>
                                <td><div className="td-content"><a href="javascript:void(0);" className="text-secondary"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-chevrons-right"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg> Referral</a></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default TopSellProd
