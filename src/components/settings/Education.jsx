import React, { useEffect } from 'react';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = Array.from({ length: 40 }, (_, i) => 2025 - i); // 2025 to 1986

const Education = ({ education, setEducation }) => {

     useEffect(() => {
    if (education.length === 0) {
      setEducation([
        {
          college: '',
          startMonth: '',
          startYear: '',
          endMonth: '',
          endYear: '',
          description: ''
        }
      ]);
    }
  }, [education, setEducation]);

  const handleChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const addEducation = () => {
    if (education.length >= 3) return;
    setEducation([...education, {
      college: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      description: ''
    }]);
  };

   const removeEducation = (index) => {
    const updated = [...education];
    updated.splice(index, 1);
    setEducation(updated);
  };

    const effectiveEducation = education.length === 0
    ? [{
        college: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: ''
      }]
    : education;

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                  <form id="edu-experience" className="section edu-experience">
                    <div className="info">
                      <h5 className="">Education</h5>
                       {effectiveEducation.map((edu, idx) => (
                      <div className="row" key={idx}>
                        <div className="col-md-12 text-right mb-5">
                            {idx === 0 && education.length < 3 && (
                          <button type="button" id="add-education" className="btn btn-primary"  onClick={addEducation} >Add</button>
                           )}
                {idx !== 0 && (
                  <button type="button" className="btn btn-danger" onClick={() => removeEducation(idx)}>Close</button>
                )}
                        </div>
                        
                        <div className="col-md-11 mx-auto">
                          <div className="edu-section">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label htmlFor="degree1">Enter Your Collage Name</label>
                                  <input type="text" className="form-control mb-4" id="degree1" placeholder="Add your education here" value={edu.college} onChange={e => handleChange(idx, 'college', e.target.value)} />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Starting From</label>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <select className="form-control mb-4" id="s-from1" value={edu.startMonth}  onChange={(e) => handleChange(idx, 'startMonth', e.target.value)} >
                                            <option value="">Month</option>
                                {months.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                                          </select>
                                        </div>
                                        <div className="col-md-6">
                                          <select className="form-control mb-4" id="s-from2"  value={edu.startYear} onChange={(e) => handleChange(idx, 'startYear', e.target.value)} >
                                            <option value="">Year</option>
                                {years.map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Ending In</label>
                                      <div className="row">
                                        <div className="col-md-6 mb-4">
                                          <select className="form-control" id="end-in1" value={edu.endMonth}  onChange={(e) => handleChange(idx, 'endMonth', e.target.value)}>
                                             <option value="">Month</option>
                                {months.map((m) => (
                                  <option key={m} value={m}>{m}</option>
                                ))}
                                          </select>
                                        </div>
                                        <div className="col-md-6">
                                          <select className="form-control input-sm" id="end-in2"  value={edu.endYear} onChange={(e) => handleChange(idx, 'endYear', e.target.value)}>
                                            <option value="">Year</option>
                                {years.map((y) => (
                                  <option key={y} value={y}>{y}</option>
                                ))}
                                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <textarea className="form-control" placeholder="Description" rows={10}   value={edu.description}  onChange={(e) => handleChange(idx, 'description', e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>     
                      </div>
                    ))}
                    </div>
                  </form>
                </div>
  )
}

export default Education
