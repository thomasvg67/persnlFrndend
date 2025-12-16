import React from 'react'

const Contact = ({ email, setEmail, ph, setPh, loc, setLoc, country, setCountry,
  address, setAddress,
  website, setWebsite }) => {
  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
      <form id="contact" className="section contact">
        <div className="info">
          <h5 className="">Contact</h5>
          <div className="row">
            <div className="col-md-11 mx-auto">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <select className="form-control" id="country" value={country} onChange={(e) => setCountry(e.target.value)} >
                      <option value="">All Countries</option>
                      <option value="United States">United States</option>
                      <option value="India">India</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="Brazil">Brazil</option>
                      <option value="Norway">Norway</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input type="text" className="form-control mb-4" id="address" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" className="form-control mb-4" id="location" placeholder="Location" value={loc} onChange={(e) => setLoc(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input type="text" className="form-control mb-4" id="phone" placeholder="Write your phone number here" value={ph} onChange={(e) => setPh(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-control mb-4" id="email" placeholder="Write your email here" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="website1">Website</label>
                    <input type="text" className="form-control mb-4" id="website1" placeholder="Write your website here" valuevalue={website} onChange={(e) => setWebsite(e.target.value)} />
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

export default Contact
