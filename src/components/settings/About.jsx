import React from 'react'

const About = ({ bio, setBio }) => {
  return (
    
      <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                  <form id="about" className="section about">
                    <div className="info">
                      <h5 className="">About</h5>
                      <div className="row">
                        <div className="col-md-11 mx-auto">
                          <div className="form-group">
                            <label htmlFor="aboutBio">Bio</label>
                            <textarea className="form-control" id="aboutBio" placeholder="Tell something interesting about yourself" rows={10} value={bio} onChange={(e) => setBio(e.target.value)} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
    
  )
}

export default About
