import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext'; // adjust path as needed
import { useNavigate } from 'react-router-dom';

const LockScreen = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { user, setToken, setUser } = useContext(AuthContext); // assuming AuthContext provides this
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleUnlock = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${BASE_URL}/api/users/login`, {
        uname: user?.uname,
        password
      });

      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);

      navigate('/dashboard'); // or where they left off
    } catch (err) {
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className='form'>
      <div className="form-container">
        <div className="form-form">
          <div className="form-form-wrap">
            <div className="form-container">
              <div className="form-content">
                <div className="d-flex user-meta">
                  <img src="assets/img/90x90.jpg" className="usr-profile" alt="avatar" />
                  <div>
                    <p>Shaun Park</p>
                  </div>
                </div>
                <form className="text-left" onSubmit={handleUnlock}>
                  <div className="form">
                    <div id="password-field" className="field-wrapper input mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#4361ee" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock" style={{ position: 'absolute', top: '25px', left: '10px' }}>
                        <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="d-sm-flex justify-content-between">
                      <div className="field-wrapper toggle-pass">
                        <p className="d-inline-block">Show Password</p>
                        <label className="switch s-primary">
                          <input
                            type="checkbox"
                            className="d-none"
                            onChange={(e) => setShowPassword(e.target.checked)}
                          />
                          <span className="slider round" />
                        </label>
                      </div>
                      <div className="field-wrapper">
                        <button type="submit" className="btn btn-primary">Unlock</button>
                      </div>
                    </div>
                  </div>
                </form>
                <p className="terms-conditions">
                  © 2020 All Rights Reserved. <a href="index.html">CORK</a> is a product of Designreset. <a href="javascript:void(0);">Cookie Preferences</a>, <a href="javascript:void(0);">Privacy</a>, and <a href="javascript:void(0);">Terms</a>.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="form-image">
          <div className="l-image" />
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
