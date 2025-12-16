import React from 'react'

const SocialMedias = ({ socials, setSocials }) => {
  const handleChange = (e) => {
    setSocials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                        <form id="social" className="section social">
                          <div className="info">
                            <h5 className="">Social</h5>
                            <div className="row">
                              <div className="col-md-11 mx-auto">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="input-group social-linkedin mb-3">
                                      <div className="input-group-prepend mr-3">
                                        <span className="input-group-text" id="linkedin"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x={2} y={9} width={4} height={12} /><circle cx={4} cy={4} r={2} /></svg></span>
                                      </div>
                                      <input type="text" className="form-control" placeholder="linkedin Username" aria-label="Username" aria-describedby="linkedin" name="linkedin" value={socials.linkedin || ''} onChange={handleChange}  />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-group social-tweet mb-3">
                                      <div className="input-group-prepend mr-3">
                                        <span className="input-group-text" id="tweet"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg></span>
                                      </div>
                                      <input type="text" className="form-control" placeholder="Twitter Username" aria-label="Username" aria-describedby="tweet" name="twitter" value={socials.twitter || ''} onChange={handleChange} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-11 mx-auto">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="input-group social-fb mb-3">
                                      <div className="input-group-prepend mr-3">
                                        <span className="input-group-text" id="fb"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></span>
                                      </div>
                                      <input type="text" className="form-control" placeholder="Facebook Username" aria-label="Username" aria-describedby="fb" name="facebook"  value={socials.facebook || ''} onChange={handleChange} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="input-group social-github mb-3">
                                      <div className="input-group-prepend mr-3">
                                        <span className="input-group-text" id="github"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-github"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg></span>
                                      </div>
                                      <input type="text" className="form-control" placeholder="Github Username" aria-label="Username" aria-describedby="github" name="github" value={socials.github || ''} onChange={handleChange} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
  )
}

export default SocialMedias
