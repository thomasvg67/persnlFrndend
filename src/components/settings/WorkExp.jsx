import React, { useEffect } from 'react';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = Array.from({ length: 40 }, (_, i) => 2025 - i); // 2025 to 1986

const WorkExp = ({ workExp, setWorkExp }) => {

  useEffect(() => {
      if (workExp.length === 0) {
        setWorkExp([
          {
            company: '',
      title: '',
      location: '',
            startMonth: '',
            startYear: '',
            endMonth: '',
            endYear: '',
            description: ''
          }
        ]);
      }
    }, [workExp, setWorkExp]);

  const handleChange = (index, field, value) => {
    const updated = [...workExp];
    updated[index][field] = value;
    setWorkExp(updated);
  };

  const addWorkExp = () => {
    if (workExp.length >= 3) return;
    setWorkExp([...workExp, {
      company: '',
      title: '',
      location: '',
      startMonth: '',
      startYear: '',
      endMonth: '',
      endYear: '',
      description: ''
    }]);
  };

  const removeWorkExp = (index) => {
    const updated = [...workExp];
    updated.splice(index, 1);
    setWorkExp(updated);
  };

  // Ensure at least one empty section if no data
  const effectiveWorkExp = workExp.length === 0
    ? [{
        company: '',
        title: '',
        location: '',
        startMonth: '',
        startYear: '',
        endMonth: '',
        endYear: '',
        description: ''
      }]
    : workExp;

  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                  <form id="work-experience" className="section work-experience">
                    <div className="info">
                      <h5 className="">Work Experience</h5>
                      {effectiveWorkExp.map((exp, idx) => (
                      <div className="row" key={idx}>
                        <div className="col-md-12 text-right mb-5">
                             {idx === 0 && workExp.length < 3 && (
                          <button type="button" id="add-work-exp" className="btn btn-primary"  onClick={addWorkExp}>Add</button>
                           )}
                {idx !== 0 && (
                  <button type="button" className="btn btn-danger" onClick={() => removeWorkExp(idx)}>Close</button>
                )}
                        </div>
                        
                        <div className="col-md-11 mx-auto" >
                          <div className="work-section">
                            <div className="row">
                              <div className="col-md-12">
                                <div className="form-group">
                                  <label htmlFor="degree2">Company Name</label>
                                  <input type="text" className="form-control mb-4" id="degree2" placeholder="Add your work here" value={exp.company} onChange={e => handleChange(idx, 'company', e.target.value)} />
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="degree3">Job Tilte</label>
                                      <input type="text" className="form-control mb-4" id="degree3" placeholder="Add your work here" value={exp.title} onChange={e => handleChange(idx, 'title', e.target.value)} />
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label htmlFor="degree4">Location</label>
                                      <input type="text" className="form-control mb-4" id="degree4" placeholder="Add your work here" value={exp.location} onChange={e => handleChange(idx, 'location', e.target.value)} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="form-group">
                                      <label>Starting From</label>
                                      <div className="row">
                                        <div className="col-md-6">
                                          <select className="form-control mb-4" id="wes-from1"  value={exp.startMonth} onChange={e => handleChange(idx, 'startMonth', e.target.value)}>
                                             <option value="">Month</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                                          </select>
                                        </div>
                                        <div className="col-md-6">
                                          <select className="form-control mb-4" id="wes-from2" value={exp.startYear} onChange={e => handleChange(idx, 'startYear', e.target.value)}>
                                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
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
                                          <select className="form-control" id="eiend-in1" value={exp.endMonth} onChange={e => handleChange(idx, 'endMonth', e.target.value)}>
                                            <option value="">Month</option>
                            {months.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                                        </div>
                                        <div className="col-md-6">
                                          <select className="form-control input-sm" id="eiend-in2" value={exp.endYear} onChange={e => handleChange(idx, 'endYear', e.target.value)}>
                                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                          </select>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-md-12">
                                <textarea className="form-control" placeholder="Description" rows={10} value={exp.description} onChange={e => handleChange(idx, 'description', e.target.value)} />
                              </div>
                            </div>
                          </div>
                        </div>
                         
                      </div> ))}
                    </div>
                  </form>
                </div>
  )
}

export default WorkExp
