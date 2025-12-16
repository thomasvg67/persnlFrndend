import React from 'react'

const Skills = ({ skills, setSkills, newSkillName, setNewSkillName, newSkillLevel, setNewSkillLevel, addSkill, updateSkillLevel }) => {
  return (
    <div className="col-xl-12 col-lg-12 col-md-12 layout-spacing">
                        <div id="skill" className="section skill">
                          <div className="info">
                            <h5 className="">Skills</h5>
                            <div className="row progress-bar-section">
                              <div className="col-md-12 mx-auto">
                                <div className="form-group">
                                  <div className="row">
                                    <div className="col-md-11 mx-auto">
                                      <div className="input-form">
                                        <input type="text" className="form-control" id="skills" placeholder="Add Your Skills Here" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} />
                                        <button id="add-skills" className="btn btn-primary" onClick={addSkill}>Add</button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                               {skills.map((skill, index) => (
                              <div className="col-md-11 mx-auto" key={index}>
                                <div className="custom-progress top-right progress-up" style={{ width: '100%' }}>
                                  <p className="skill-name">{skill.name}</p>
                                  <input type="range" min={0} max={100} className="custom-range progress-range-counter" value={skill.level} onChange={(e) => updateSkillLevel(index, Number(e.target.value))} />
                                  <div className="range-count"><span className="range-count-number" data-rangecountnumber={25}>{skill.level}</span> <span className="range-count-unit">%</span></div>
                                </div>
                              </div>
                               ))}
                            </div>
                          </div>
                        </div>
                      </div>
  )
}

export default Skills
