import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import Sidebar from '../../components/Sidebar'

const GnrlNms = () => {
  const [viewMode, setViewMode] = useState('list');

  return (
    <div>
      <div className="alt-menu sidebar-noneoverflow">
        {/*  BEGIN NAVBAR  */}
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
              <div className="row layout-spacing layout-top-spacing" id="cancel-row">
                <div className="col-lg-12">
                  <div className="widget-content searchable-container list">
                    <div className="row">
                      <div className="col-xl-4 col-lg-5 col-md-5 col-sm-7 filtered-list-search layout-spacing align-self-center">
                        <form className="form-inline my-2 my-lg-0">
                          <div className>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx={11} cy={11} r={8} /><line x1={21} y1={21} x2="16.65" y2="16.65" /></svg>
                            <input type="text" className="form-control product-search" id="input-search" placeholder="Search Contacts..." />
                          </div>
                        </form>
                      </div>
                      <div className="col-xl-8 col-lg-7 col-md-7 col-sm-5 text-sm-right text-center layout-spacing align-self-center">
                        <div className="d-flex justify-content-sm-end justify-content-center align-items-center gap-2">
                          <svg id="btn-add-contact" xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={`feather feather-list view-list ${viewMode === 'list' ? 'active-view' : ''}`}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={20} y1={8} x2={20} y2={14} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
                          <div className="d-flex align-items-center gap-2">
                            <button className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-light'}`}
                              onClick={() => setViewMode('list')}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <line x1={8} y1={6} x2={21} y2={6} /><line x1={8} y1={12} x2={21} y2={12} /><line x1={8} y1={18} x2={21} y2={18} /><line x1={3} y1={6} x2={3} y2={6} /><line x1={3} y1={12} x2={3} y2={12} /><line x1={3} y1={18} x2={3} y2={18} />
                              </svg>
                            </button>
                            <button className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-light'}`}
                              onClick={() => setViewMode('grid')}>
                              <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x={3} y={3} width={7} height={7} /><rect x={14} y={3} width={7} height={7} /><rect x={14} y={14} width={7} height={7} /><rect x={3} y={14} width={7} height={7} /></svg>
                            </button>
                          </div>
                        </div>
                        {/* Modal */}
                        <div className="modal fade" id="addContactModal" tabIndex={-1} role="dialog" aria-labelledby="addContactModalTitle" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                              <div className="modal-body">
                                <i className="flaticon-cancel-12 close" data-dismiss="modal" />
                                <div className="add-contact-box">
                                  <div className="add-contact-content">
                                    <form id="addContactModalTitle">
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="contact-name">
                                            <i className="flaticon-user-11" />
                                            <input type="text" id="c-name" className="form-control" placeholder="Name" />
                                            <span className="validation-text" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="contact-email">
                                            <i className="flaticon-mail-26" />
                                            <input type="text" id="c-email" className="form-control" placeholder="Email" />
                                            <span className="validation-text" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <div className="contact-occupation">
                                            <i className="flaticon-fill-area" />
                                            <input type="text" id="c-occupation" className="form-control" placeholder="Occupation" />
                                          </div>
                                        </div>
                                        <div className="col-md-6">
                                          <div className="contact-phone">
                                            <i className="flaticon-telephone" />
                                            <input type="text" id="c-phone" className="form-control" placeholder="Phone" />
                                            <span className="validation-text" />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="row">
                                        <div className="col-md-12">
                                          <div className="contact-location">
                                            <i className="flaticon-location-1" />
                                            <input type="text" id="c-location" className="form-control" placeholder="Location" />
                                          </div>
                                        </div>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                              <div className="modal-footer">
                                <button id="btn-edit" className="float-left btn">Save</button>
                                <button className="btn" data-dismiss="modal"> <i className="flaticon-delete-1" /> Discard</button>
                                <button id="btn-add" className="btn">Add</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className={`searchable-items ${viewMode}`}>
                      <div className="items items-header-section">
                        <div className="item-content">
                          <div className>
                            <div className="n-chk align-self-center text-center">
                              <label className="new-control new-checkbox checkbox-primary">
                                <input type="checkbox" className="new-control-input" id="contact-check-all" />
                                <span className="new-control-indicator" />
                              </label>
                            </div>
                            <h4>Name</h4>
                          </div>
                          <div className="user-email">
                            <h4>Email</h4>
                          </div>
                          <div className="user-location">
                            <h4 style={{ marginLeft: 0 }}>Location</h4>
                          </div>
                          <div className="user-phone">
                            <h4 style={{ marginLeft: 3 }}>Phone</h4>
                          </div>
                          <div className="action-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-trash-2  delete-multiple"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1={10} y1={11} x2={10} y2={17} /><line x1={14} y1={11} x2={14} y2={17} /></svg>
                          </div>
                        </div>
                      </div>
                      <div className="items">
                        <div className="item-content">
                          <div className="user-profile">
                            <div className="n-chk align-self-center text-center">
                              <label className="new-control new-checkbox checkbox-primary">
                                <input type="checkbox" className="new-control-input contact-chkbox" />
                                <span className="new-control-indicator" />
                              </label>
                            </div>
                            <img src="assets/img/90x90.jpg" alt="avatar" />
                            <div className="user-meta-info">
                              <p className="user-name" data-name="Alan Green">Alan Green</p>
                              <p className="user-work" data-occupation="Web Developer">Web Developer</p>
                            </div>
                          </div>
                          <div className="user-email">
                            <p className="info-title">Email: </p>
                            <p className="usr-email-addr" data-email="alan@mail.com">alan@mail.com</p>
                          </div>
                          <div className="user-location">
                            <p className="info-title">Location: </p>
                            <p className="usr-location" data-location="Boston, USA">Boston, USA</p>
                          </div>
                          <div className="user-phone">
                            <p className="info-title">Phone: </p>
                            <p className="usr-ph-no" data-phone="+1 (070) 123-4567">+1 (070) 123-4567</p>
                          </div>
                          <div className="action-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-2 edit"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user-minus delete"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy={7} r={4} /><line x1={23} y1={11} x2={17} y2={11} /></svg>
                          </div>
                        </div>
                      </div>
                      
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*  END CONTENT AREA  */}
        </div>
        {/* END MAIN CONTAINER */}
      </div>

    </div>
  )
}

export default GnrlNms
