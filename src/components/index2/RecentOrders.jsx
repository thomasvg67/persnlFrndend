import React from 'react'

const RecentOrders = () => {
    return (
        <div className="widget widget-table-two p-2">
            <div className="widget-heading">
                <h5 className>Recent Orders</h5>
            </div>
            <div className="widget-content">
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th><div className="th-content">Customer</div></th>
                                <th><div className="th-content">Product</div></th>
                                <th><div className="th-content">Invoice</div></th>
                                <th><div className="th-content th-heading">Price</div></th>
                                <th><div className="th-content">Status</div></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Luke Ivory</span></div></td>
                                <td><div className="td-content product-brand text-primary">Headphone</div></td>
                                <td><div className="td-content product-invoice">#46894</div></td>
                                <td><div className="td-content pricing"><span className>$56.07</span></div></td>
                                <td><div className="td-content"><span className="badge badge-success">Paid</span></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Andy King</span></div></td>
                                <td><div className="td-content product-brand text-warning">Nike Sport</div></td>
                                <td><div className="td-content product-invoice">#76894</div></td>
                                <td><div className="td-content pricing"><span className>$88.00</span></div></td>
                                <td><div className="td-content"><span className="badge badge-primary">Shipped</span></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Laurie Fox</span></div></td>
                                <td><div className="td-content product-brand text-danger">Sunglasses</div></td>
                                <td><div className="td-content product-invoice">#66894</div></td>
                                <td><div className="td-content pricing"><span className>$126.04</span></div></td>
                                <td><div className="td-content"><span className="badge badge-success">Paid</span></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Ryan Collins</span></div></td>
                                <td><div className="td-content product-brand text-warning">Sport</div></td>
                                <td><div className="td-content product-invoice">#89891</div></td>
                                <td><div className="td-content pricing"><span className>$108.09</span></div></td>
                                <td><div className="td-content"><span className="badge badge-primary">Shipped</span></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Irene Collins</span></div></td>
                                <td><div className="td-content product-brand text-primary">Speakers</div></td>
                                <td><div className="td-content product-invoice">#75844</div></td>
                                <td><div className="td-content pricing"><span className>$84.00</span></div></td>
                                <td><div className="td-content"><span className="badge badge-danger">Pending</span></div></td>
                            </tr>
                            <tr>
                                <td><div className="td-content customer-name"><img src="assets/img/90x90.jpg" alt="avatar" /><span>Sonia Shaw</span></div></td>
                                <td><div className="td-content product-brand text-danger">Watch</div></td>
                                <td><div className="td-content product-invoice">#76844</div></td>
                                <td><div className="td-content pricing"><span className>$110.00</span></div></td>
                                <td><div className="td-content"><span className="badge badge-success">Paid</span></div></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default RecentOrders
