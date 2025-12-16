import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // 👈 import context

const Login = () => {

  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [uname, setUname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const { login } = useContext(AuthContext); // 👈 use login from context
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await axios.post(`${VITE_BASE_URL}/api/users/login`, {
      uname,
      password
    });

    const { token, user } = res.data;

    login(token, user);
    toast.success('Login successful!');
    navigate('/');
  } catch (err) {
    toast.error(err.response?.data?.message || 'Login failed');
  } finally {
    setLoading(false);
  }
};


  return (
    <div>
      <div className="form-container outer">
        <div className="form-form">
          <div className="form-form-wrap">
            <div className="form-container">
              <div className="form-content">
                <h1>Sign In</h1>
                <p>Log in to your account to continue.</p>
                <form className="text-left" onSubmit={handleLogin}>
                  <div className="form">
                    <div id="username-field" className="field-wrapper input">
                      <label htmlFor="username">EMAIL</label>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx={12} cy={7} r={4} /></svg>
                      <input id="username" name="username" type="text" className="form-control" placeholder="Email" value={uname} onChange={(e) => setUname(e.target.value)} />
                    </div>

                    <div id="password-field" className="field-wrapper input mb-2 position-relative">
                      <div className="d-flex justify-content-between">
                        <label htmlFor="password">PASSWORD</label>
                        <a href="auth_pass_recovery_boxed.html" className="forgot-pass-link" style={{ marginLeft: '140px' }}>Forgot Password?</a>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-lock" style={{ position: 'absolute', top: '63px', left: '15px' }}>
                        <rect x={3} y={11} width={18} height={11} rx={2} ry={2} />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                      <input id="password" name="password" type={showPassword ? 'text' : 'password'} className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                      <svg onClick={togglePassword} xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-eye" style={{ position: 'absolute', top: '63px', right: '15px', cursor: 'pointer' }}>
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx={12} cy={12} r={3} />
                      </svg>
                    </div>

                    <div className="field-wrapper">
                      <button type="submit" className="btn btn-primary" disabled={loading}> {loading ? 'Logging in…' : 'Log In'}</button>
                    </div>

                    <div className="division">
                      <span>OR</span>
                    </div>

                    {/* Social Buttons in Same Line */}
                    <div className="social d-flex justify-content-between gap-2">
                      <a href="javascript:void(0);" className="btn social-fb d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-facebook me-1"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                        <span className="brand-name">Facebook</span>
                      </a>
                      <a href="javascript:void(0);" className="btn social-github d-flex align-items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-github me-1"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                        <span className="brand-name">Github</span>
                      </a>
                    </div>

                    {/* <p className="signup-link">Not registered ? <a href="auth_register_boxed.html">Create an account</a></p> */}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
