import React from 'react'

const WorkPlatforms = () => {
  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                        <form id="work-platforms" className="section work-platforms">
                          <div className="info">
                            <h5 className>Work Platforms</h5>
                            <div className="row">
                              <div className="col-md-12 text-right mb-5">
                                <button id="add-work-platforms" className="btn btn-primary">Add</button>
                              </div>
                              <div className="col-md-11 mx-auto">
                                <div className="platform-div">
                                  <div className="form-group">
                                    <label htmlFor="platform-title">Platforms Title</label>
                                    <input type="text" className="form-control mb-4" id="platform-title" placeholder="Platforms Title" defaultValue="Web Design" />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="platform-description">Description</label>
                                    <textarea className="form-control mb-4" id="platform-description" placeholder="Platforms Description" rows={10} defaultValue={"Duis aute irure dolor in reprehenderit in voluptate velit esse eu fugiat nulla pariatur."} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
  )
}

export default WorkPlatforms
