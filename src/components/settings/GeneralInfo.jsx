import React from 'react';

const GeneralInfo = ({
  name, setName,
  job, setJob,
  dobDay, setDobDay,
  dobMonth, setDobMonth,
  dobYear, setDobYear,
  onImageChange,
  onPdfChange,
  role, setRole, isEditableRole,
}) => {
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const roleOptions = [
    { label: 'User', value: 'usr' },  
    { label: 'Employee Type 1', value: 'emplyT1' },
    { label: 'Employee Type 2', value: 'emplyT2' },
    { label: 'Employee Type 3', value: 'emplyT3' },
    { label: 'Office Admin', value: 'offAdm' },
    { label: 'Admin', value: 'adm' }
  ];

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
      <form id="general-info" className="section general-info">
        <div className="info">
          <h6 className="">General Information</h6>
          <div className="row">
            <div className="col-lg-11 mx-auto">
              <div className="row align-items-start justify-content-between">

                {/* Upload Picture (Left) */}
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <div className="upload mt-4 pr-md-4">
                    <input type="file" className="dropify" data-default-file="assets/img/200x200.jpg" data-max-file-size="2M" accept=".jpg,.jpeg*" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 300 * 1024) {
                        alert("Image must be less than 300KB");
                        e.target.value = null;
                        return;
                      }
                      onImageChange(e);
                    }} />
                    <p className="mt-2"><i className="flaticon-cloud-upload mr-1" /> Upload Picture</p>
                  </div>
                </div>

                {/* Form Fields Center */}
                <div className="col-xl-7 col-lg-6 col-md-8 mt-md-0 mt-4">
                  <div className="form">
                    <div className="row">
                      <div className="col-sm-12">
                        <div className="form-group">
                          <label htmlFor="fullName">Full Name</label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            id="fullName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="col-sm-12">
                        <div className="row">
                          {/* Date of Birth */}
                          <div className="col-md-7">
                            <label className="dob-input">Date of Birth</label>
                            <div className="d-sm-flex d-block mb-3">
                              <div className="form-group mr-1">
                                <select className="form-control" value={dobDay} onChange={(e) => setDobDay(parseInt(e.target.value))}>
                                  <option value="">Day</option>
                                  {[...Array(31)].map((_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="form-group mr-1">
                                <select className="form-control" value={dobMonth} onChange={(e) => setDobMonth(parseInt(e.target.value))}>
                                  <option value="">Month</option>
                                  {monthNames.map((month, i) => (
                                    <option key={i} value={i}>{month}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="form-group mr-1">
                                <select className="form-control" value={dobYear} onChange={(e) => setDobYear(parseInt(e.target.value))}>
                                  <option value="">Year</option>
                                  {Array.from({ length: 50 }, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>;
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Profession */}
                          <div className="col-md-5">
                            <div className="form-group">
                              <label htmlFor="profession">Profession</label>
                              <input
                                type="text"
                                className="form-control"
                                id="profession"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-12">
                        <div className="form-group">
                          <label htmlFor="role">User Type</label>
                          {isEditableRole ? (
                            <select
                              id="role"
                              className="form-control"
                              value={role}
                              onChange={(e) => setRole(e.target.value)}
                            >
                              {roleOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              value={roleOptions.find(opt => opt.value === role)?.label || ''}
                              readOnly
                            />
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>

                {/* Upload Biodata (Right) */}
                <div className="col-xl-2 col-lg-3 col-md-4">
                  <div className="upload mt-4 pr-md-4">
                    <input type="file" className="dropify" data-default-file="assets/img/200x200.jpg" data-max-file-size="2M" accept=".pdf,.doc,.docx" onChange={(e) => {
                      const file = e.target.files[0];
                      if (file && file.size > 300 * 1024) {
                        alert("Biodata must be less than 300KB");
                        e.target.value = null;
                        return;
                      }
                      onPdfChange(e);
                    }} />
                    <p className="mt-2"><i className="flaticon-cloud-upload mr-1" /> Upload Biodata</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GeneralInfo;
