import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Footer from '../components/Footer'
import '../assets/plugins/table/datatable/datatables.css';
import '../assets/css/forms/theme-checkbox-radio.css';
import '../assets/plugins/table/datatable/dt-global_style.css';
import '../assets/plugins/table/datatable/custom_dt_custom.css';


const ListTable = () => {

       useEffect(() => {
        // Dynamically load the external JS file
        const script = document.createElement('script');
        script.src = '/assets/js/apps/invoice-list.js'; // Adjust path as needed
        script.async = true;
        
        document.body.appendChild(script);

        // Cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);
    
    return (
        <div className="alt-menu sidebar-noneoverflow">
            <Navbar />
            {/*  END NAVBAR  */}
            {/*  BEGIN MAIN CONTAINER  */}
            <div className="main-container sidebar-closed sbar-open" id="container">
                <div className="overlay" />
                <div className="cs-overlay" />
                <div className="search-overlay" />
                {/*  BEGIN SIDEBAR  */}
                <Sidebar />
                {/*  END SIDEBAR  */}
                {/*  BEGIN CONTENT AREA  */}
                <div id="content" className="main-content">
                    <div className="layout-px-spacing">
                        <div className="row" id="cancel-row">
                            <div className="col-xl-12 col-lg-12 col-sm-12 layout-top-spacing layout-spacing">
                                <div className="widget-content widget-content-area br-6">
                                    <table id="invoice-list" className="table table-hover" style={{ width: '100%' }}>
                                        <thead>
                                            <tr>
                                                <th className="checkbox-column"> Record no. </th>
                                                <th>Invoice Id</th>
                                                <th>Name</th>
                                                <th>Email</th>
                                                <th>Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#098424</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Alma Clarke </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> alma.clarke@gmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 10 Feb 2021</span></td>
                                                <td><span className="inv-amount">$234.40</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
<td>
  <div className="action-icons d-flex align-items-center">
    <a className="action-edit mr-3" href="apps_invoice-edit.html" title="Edit">
      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke="#007bff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        className="feather feather-edit-3">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </a>
    <a className="action-delete" href="javascript:void(0);" title="Delete">
      <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none"
        stroke="#dc3545" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"
        className="feather feather-trash">
        <polyline points="3 6 5 6 21 6" />
        <path
          d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      </svg>
    </a>
  </div>
</td>

                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#095841</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Kelly Young </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> youngkelly@hotmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 06 Feb 2021</span></td>
                                                <td><span className="inv-amount">$49.00</span></td>
                                                <td><span className="badge badge-danger inv-status">Pending</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#091768</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Vincent Carpenter </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> vincentcarpenter@gmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 30 Jan 2021</span></td>
                                                <td><span className="inv-amount">$400</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#089472</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Andy King </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> kingandy07@company.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 28 Jan 2021</span></td>
                                                <td><span className="inv-amount">$149.00</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#087916</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Mary McDonald </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> maryDonald007@gamil.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 25 Jan 2021</span></td>
                                                <td><span className="inv-amount">$79.00</span></td>
                                                <td><span className="badge badge-danger inv-status">Pending</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#086773</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Nia Hillyer </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> niahillyer666@comapny.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 20 Jan 2021</span></td>
                                                <td><span className="inv-amount">$59.21</span></td>
                                                <td><span className="badge badge-danger inv-status">Pending</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#086643</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Amy Diaz </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> amy968@gmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 14 Jan 2021</span></td>
                                                <td><span className="inv-amount">$100.00</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#084743</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Donna Rogers </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> donnaRogers@hotmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 03 Jan 2021</span></td>
                                                <td><span className="inv-amount">$405.15</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#082693</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Grace Roberts </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> graceRoberts@company.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 31 Dec 2020</span></td>
                                                <td><span className="inv-amount">$344.00</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#081681</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> James Taylor </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> jamestaylor468@gmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 27 Dec 2020</span></td>
                                                <td><span className="inv-amount">$20.00</span></td>
                                                <td><span className="badge badge-danger inv-status">Pending</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#081452</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/profile-30.png" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Alexander Gray </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> alexGray3188@gmail.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 20 Dec 2020</span></td>
                                                <td><span className="inv-amount">$1044.00</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="checkbox-column"> 1 </td>
                                                <td><a href="apps_invoice-preview.html"><span className="inv-number">#081451</span></a></td>
                                                <td>
                                                    <div className="d-flex">
                                                        <div className="usr-img-frame mr-2 rounded-circle">
                                                            <img alt="avatar" className="img-fluid rounded-circle" src="assets/img/90x90.jpg" />
                                                        </div>
                                                        <p className="align-self-center mb-0 user-name"> Laurie Fox </p>
                                                    </div>
                                                </td>
                                                <td><span className="inv-email"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg> lauriefox@company.com</span></td>
                                                <td><span className="inv-date"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg> 15 Dec 2020</span></td>
                                                <td><span className="inv-amount">$2275.45</span></td>
                                                <td><span className="badge badge-success inv-status">Paid</span></td>
                                                <td>
                                                    <div className="dropdown">
                                                        <a className="dropdown-toggle" href="#" role="button" id="dropdownMenuLink2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-more-horizontal"><circle cx={12} cy={12} r={1} /><circle cx={19} cy={12} r={1} /><circle cx={5} cy={12} r={1} /></svg>
                                                        </a>
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuLink2">
                                                            <a className="dropdown-item action-edit" href="apps_invoice-edit.html"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>Edit</a>
                                                            <a className="dropdown-item action-delete" href="javascript:void(0);"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>Delete</a>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*  END CONTENT AREA  */}

            </div> <Footer />
        </div>

    )
}

export default ListTable
