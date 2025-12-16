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
import Loader from '../components/Loader';

const AccSettings = () => {

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const { token, setProfile, updateProfile } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [job, setJob] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [biodataPdf, setBiodataPdf] = useState(null);
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
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);



  // Fetch user data on mount
  useEffect(() => {
    setLoading(true);
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${VITE_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = res.data;
        setName(data.name || '');
        setJob(data.job || '');
        if (data.dob) {
          const dateObj = new Date(data.dob);
          setDobDay(dateObj.getDate());
          setDobMonth(dateObj.getMonth());
          setDobYear(dateObj.getFullYear());
        }
        setBio(data.bio || '');

        setCountry(data.country || '');
        setAddress(data.address || '');
        setLoc(data.loc || '');
        setPh(data.ph || '');
        setEmail(data.email || '');
        setWebsite(data.website || '');
        setSocials(data.socials?.[0] || {});
        setSkills(data.skills || []);
        setEducation(data.education || []);
        setWorkExp(data.workExp || []);
        setRole(data.role || '');



      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [token]);

  const handleSaveAll = async () => {
    setLoading(true);
    try {
      const dobValue = (dobYear && dobMonth !== '' && dobDay)
        ? new Date(dobYear, dobMonth, dobDay).toISOString()
        : '';

      const filteredEducation = education.filter(e =>
        e.college || e.startMonth || e.startYear || e.endMonth || e.endYear
      );

      const filteredWorkExp = workExp.filter(w =>
        w.company || w.title || w.location || w.startMonth || w.startYear || w.endMonth || w.endYear
      );
      const formData = new FormData();
      if (name.trim()) formData.append('name', name);
      if (job.trim()) formData.append('job', job);
      if (dobValue) formData.append('dob', dobValue);
      if (bio.trim()) formData.append('bio', bio);
      if (email.trim()) formData.append('email', email);
      if (ph.trim()) formData.append('ph', ph);
      if (loc.trim()) formData.append('loc', loc);
      if (country.trim()) formData.append('country', country);
      if (address.trim()) formData.append('address', address);
      if (website.trim()) formData.append('website', website);
      if (filteredEducation.length > 0) formData.append('education', JSON.stringify(filteredEducation));
      if (filteredWorkExp.length > 0) formData.append('workExp', JSON.stringify(filteredWorkExp));

      const nonEmptySocials = Object.fromEntries(
        Object.entries(socials).filter(([_, val]) => val.trim())
      );
      if (Object.keys(nonEmptySocials).length > 0) {
        formData.append('socials', JSON.stringify(nonEmptySocials));
      }

      if (skills.length > 0) formData.append('skills', JSON.stringify(skills));
      if (profileImage) formData.append('imageFile', profileImage);
      if (biodataPdf) formData.append('pdfFile', biodataPdf);

      await axios.put(`${VITE_BASE_URL}/api/users/update-profile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      });

      await updateProfile();

      // Change password (only if filled)
      if (oldPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          toast.error("❌ New passwords do not match");
          return;
        }

        await axios.post(`${VITE_BASE_URL}/api/users/change-password`, {
          oldPassword,
          newPassword
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        toast.success('🔐 Password changed successfully');
      }

      toast.success('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Save failed:', err);
      toast.error('Failed to update profile');
    }finally{
      setLoading(false);
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
      {loading && (<Loader />)}
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
                        role={role} setRole={() => { }}  // 👈 Do not allow editing
                        isEditableRole={false} />
                      <Password
                        oldPassword={oldPassword} setOldPassword={setOldPassword}
                        newPassword={newPassword} setNewPassword={setNewPassword}
                        confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword} />
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
                    {/* <button onClick={handleSaveAll} id="multiple-messages" className="btn btn-success">Save Changes</button> */}

                    <button id="multiple-reset" className="btn btn-primary">Reset All</button>
                    <div className="blockui-growl-message">
                      <i className="flaticon-double-check" />&nbsp; Settings Saved Successfully
                    </div>
                    <button onClick={handleSaveAll} id="multiple-messages" className="btn btn-success">Save Changes</button>
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

export default AccSettings
