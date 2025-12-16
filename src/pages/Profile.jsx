import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';

const Profile = () => {

    const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

    const { token, profile, fetchProfile, setProfile } = useContext(AuthContext);

    // const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const loadProfile = async () => {
            setLoading(true);
            try {
                await fetchProfile(); // Wait for profile data
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);



    if (loading || !profile) {
        return (<Loader />);
    }
    return (
        <div className="alt-menu sidebar-noneoverflow">
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
                        <div className="row layout-spacing">
                            {/* Content */}
                            <div className="col-xl-4 col-lg-6 col-md-5 col-sm-12 layout-top-spacing">
                                <div className="user-profile layout-spacing">
                                    <div className="widget-content widget-content-area">
                                        <div className="d-flex justify-content-between">
                                            <h3 className="">Profile</h3>
                                            <Link to="/sttgs" className="mt-2 edit-profile"> <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-edit-3"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></Link>
                                        </div>
                                        <div className="text-center user-info">
                                            <img
                                                src={profile.avtr ? `${VITE_BASE_URL}${profile.avtr}` : '/assets/img/user.png'}
                                                alt="avatar"
                                                style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '50%' }}
                                            />
                                            <p className="">{profile.name}</p>
                                        </div>
                                        <div className="user-info-list">
                                            <div className="">
                                                <ul className="contacts-block list-unstyled">
                                                    <li className="contacts-block__item">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-coffee"><path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" /><line x1={6} y1={1} x2={6} y2={4} /><line x1={10} y1={1} x2={10} y2={4} /><line x1={14} y1={1} x2={14} y2={4} /></svg>{profile.job ? profile.job : 'No data added'}
                                                    </li>
                                                    <li className="contacts-block__item">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-calendar"><rect x={3} y={4} width={18} height={18} rx={2} ry={2} /><line x1={16} y1={2} x2={16} y2={6} /><line x1={8} y1={2} x2={8} y2={6} /><line x1={3} y1={10} x2={21} y2={10} /></svg>{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'No data added'}
                                                    </li>
                                                    <li className="contacts-block__item">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx={12} cy={10} r={3} /></svg>{profile.loc ? profile.loc : 'No data added'}
                                                    </li>
                                                    <li className="contacts-block__item">
                                                        <a href="mailto:example@mail.com"><svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-mail"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>{profile.email ? profile.email : 'No data added'}</a>
                                                    </li>
                                                    <li className="contacts-block__item">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-phone"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>{profile.ph ? profile.ph : 'No data added'}
                                                    </li>
                                                    <li className="contacts-block__item">
                                                        <ul className="list-inline">
                                                            <li className="list-inline-item">
                                                                <div className="social-icon">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                                                                </div>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <div className="social-icon">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-twitter"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" /></svg>
                                                                </div>
                                                            </li>
                                                            <li className="list-inline-item">
                                                                <div className="social-icon">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x={2} y={9} width={4} height={12} /><circle cx={4} cy={4} r={2} /></svg>
                                                                </div>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="education layout-spacing ">
                                    <div className="widget-content widget-content-area">
                                        <h3 className="">Education</h3>
                                        <div className="timeline-alter">
                                            {Array.isArray(profile.education) && profile.education.some(e => e.college?.trim()) ? (
                                                profile.education.map((edu, index) => (
                                                    <div className="item-timeline" key={index}>
                                                        <div className="t-meta-date">
                                                            <p className="">
                                                                {/* {edu.startMonth} {edu.startYear} -  */}
                                                                {edu.endMonth} {edu.endYear}
                                                            </p>
                                                        </div>
                                                        <div className="t-dot"></div>
                                                        <div className="t-text">
                                                            <p>{edu.college}</p>
                                                            {edu.description && <p>{edu.description}</p>}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted">No education information provided.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="work-experience layout-spacing ">
                                    <div className="widget-content widget-content-area">
                                        <h3 className="">Work Experience</h3>
                                        <div className="timeline-alter">
                                            {Array.isArray(profile.workExp) && profile.workExp.some(w => w.company?.trim()) ? (
                                                profile.workExp.map((exp, index) => (
                                                    <div className="item-timeline" key={index}>
                                                        <div className="t-meta-date">
                                                            <p className="">
                                                                {exp.startMonth} {exp.startYear}
                                                                {/* - {exp.endMonth} {exp.endYear} */}
                                                            </p>
                                                        </div>
                                                        <div className="t-dot"></div>
                                                        <div className="t-text">
                                                            <p>{exp.company}</p>
                                                            {exp.description && <p>{exp.description}</p>}
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-muted">No work experience available.</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-xl-8 col-lg-6 col-md-7 col-sm-12 layout-top-spacing">
                                <div className="skills layout-spacing ">
                                    <div className="widget-content widget-content-area">
                                        <h3 className="">Skills</h3>
                                        {profile.skills && profile.skills.length > 0 ? (
                                            profile.skills.map((skill, index) => (
                                                <div key={index} className="progress br-30">
                                                    <div className="progress-bar bg-primary" role="progressbar" style={{ width: '25%' }} aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}><div className="progress-title"><span>{skill.name}</span> <span>{skill.level}%</span> </div></div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No skills added.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="bio layout-spacing ">
                                    <div className="widget-content widget-content-area">
                                        <h3 className="">Bio</h3>
                                        {profile.bio ? (
                                            <p>{profile.bio}</p>
                                        ) : (
                                            <p className="text-muted">No bio available.</p>
                                        )}

                                        {/* {profile.biodata && ( */}
                                        <button
                                            className="btn btn-primary mt-3 mb-3"
                                            onClick={async () => {
                                                if (profile.biodata) {
                                                    const biodataUrl = `${VITE_BASE_URL}${profile.biodata}`;
                                                    try {
                                                        const res = await fetch(biodataUrl, { method: 'HEAD' });
                                                        if (res.ok) {
                                                            window.open(biodataUrl, '_blank');
                                                        } else {
                                                            toast.warning("Biodata file not found on the server.");
                                                        }
                                                    } catch (err) {
                                                        toast.error("Error checking biodata file.");
                                                    }
                                                } else {
                                                    toast.info("No biodata available to download.");
                                                }
                                            }}
                                        >
                                            Download Biodata
                                        </button>

                                        {/* )} */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/*  END CONTENT AREA  */}
            </div>
            {/* END MAIN CONTAINER */}
        </div>
    )
}

export default Profile
