import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import GeneralInfo from '../components/settings/GeneralInfo'
import About from '../components/settings/About'
import Contact from '../components/settings/Contact'
import Password from '../components/settings/Password'
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import Education from '../components/settings/Education';
import WorkExp from '../components/settings/WorkExp';
import Skills from '../components/settings/Skills';
import SocialMedias from '../components/settings/SocialMedias';

const NewUser = () => {

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const { token } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [loc, setLoc] = useState('');
  const [ph, setPh] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [education, setEducation] = useState([]);
  const [workExp, setWorkExp] = useState([]);
  const [socials, setSocials] = useState({
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    github: ''
  });
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(50);
  const [role, setRole] = useState('emplyT1');

  // Fetch user data on mount
  useEffect(() => {

  }, []);

  const handleCreateUser = async () => {
    if (!name || !email || !ph) {
      toast.error('❌ Name, Email, and Phone are required!');
      return;
    }

    try {
      const dob = dobYear && dobMonth && dobDay
        ? new Date(dobYear, dobMonth, dobDay)
        : null;

      const payload = {
        name,
        email,
        ph,
        uname: email,    // 👈 use email as username
        pwd: email,      // 👈 use email as password
        job,
        dob,
        bio,
        loc,
        country,
        address,
        website,
        socials,
        skills,
        education,
        workExp,
        role,
      };

      await axios.post(`${VITE_BASE_URL}/api/users/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('✅ New user created successfully!');

      // clear all fields
setName('');
setJob('');
setDobDay('');
setDobMonth('');
setDobYear('');
setOldPassword('');
setNewPassword('');
setConfirmPassword('');
setBio('');
setCountry('');
setAddress('');
setLoc('');
setPh('');
setEmail('');
setWebsite('');
setEducation([]);
setWorkExp([]);
setSkills([]);
setSocials({
  facebook: '',
  twitter: '',
  linkedin: '',
  instagram: '',
  github: '',
});
setNewSkillName('');
setNewSkillLevel(50);
setRole('emplyT1');
    } catch (err) {
      console.error('❌ User creation failed:', err);
      toast.error('Failed to create new user');
    }
  };


  const addSkill = () => {
    if (!newSkillName) return;
    setSkills([...skills, { name: newSkillName, level: newSkillLevel }]);
    setNewSkillName('');
    setNewSkillLevel(50);
  };

  const updateSkillLevel = (index, level) => {
    const updated = [...skills];
    updated[index].level = level;
    setSkills(updated);
  };

  return (
    <div className="alt-menu sidebar-noneoverflow">
      <div>
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
              <div className="account-settings-container layout-top-spacing">
                <div className="account-content">
                  <div className="scrollspy-example" data-spy="scroll" data-target="#account-settings-scroll" data-offset={-100}>
                    <div className="row">
                      <GeneralInfo name={name} setName={setName}
                        job={job} setJob={setJob}
                        dobDay={dobDay} setDobDay={setDobDay}
                        dobMonth={dobMonth} setDobMonth={setDobMonth}
                        dobYear={dobYear} setDobYear={setDobYear}
                        onImageChange={(e) => setProfileImage(e.target.files[0])}
                        onPdfChange={(e) => setBiodataPdf(e.target.files[0])}
                        role={role} setRole={setRole}
                        isEditableRole={true} />

                      <Contact
                        email={email} setEmail={setEmail}
                        ph={ph} setPh={setPh}
                        loc={loc} setLoc={setLoc}
                        country={country} setCountry={setCountry}
                        address={address} setAddress={setAddress}
                        website={website} setWebsite={setWebsite} />

                      <SocialMedias socials={socials} setSocials={setSocials} />

                      <About bio={bio} setBio={setBio} />

                      <Skills
                        skills={skills}
                        setSkills={setSkills}
                        newSkillName={newSkillName}
                        setNewSkillName={setNewSkillName}
                        newSkillLevel={newSkillLevel}
                        setNewSkillLevel={setNewSkillLevel}
                        addSkill={addSkill}
                        updateSkillLevel={updateSkillLevel}
                      />
                      <Education education={education} setEducation={setEducation} />
                      <WorkExp workExp={workExp} setWorkExp={setWorkExp} />
                    </div>
                  </div>
                </div>
                <div className="account-settings-footer">
                  <div className="as-footer-container">
                    <button id="multiple-reset" className="btn btn-primary">Reset All</button>
                    <div className="blockui-growl-message">
                      <i className="flaticon-double-check" />&nbsp; Settings Saved Successfully
                    </div>
                    <button onClick={handleCreateUser} id="multiple-messages" className="btn btn-success">Save Changes</button>
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

export default NewUser
