import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const VITE_BASE_URL = import.meta.env.VITE_BASE_URL;

  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [profile, setProfile] = useState(null);

  // 🔐 Login and store token/user
  const login = (token, user) => {
    setToken(token);
    localStorage.setItem('token', token);
    setUser(user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // ✅ Fetch basic user data on token change
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await axios.get(`${VITE_BASE_URL}/api/users/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(res.data);
        } catch (err) {
          console.error('Failed to fetch user:', err);
        }
      }
    };
    fetchUser();
  }, [token]);

  // ⏳ Check token expiration
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
          window.location.href = '/login';
        }
      } catch (err) {
        logout();
        window.location.href = '/login';
      }
    }
  }, [token]);

  // ⚠️ Handle 401 errors globally
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        const status = error.response?.status;
        const requestUrl = error.config?.url;
        const isLoginRequest = requestUrl?.includes('/login');
        const isPublicRequest = requestUrl?.includes('/register');
        if (status === 401 && token && !isLoginRequest && !isPublicRequest) {
          logout();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  // ✅ Fetch full profile
  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  // ✅ Update and sync profile
  const updateProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${VITE_BASE_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile(res.data);
    } catch (err) {
      console.error('❌ Failed to update profile:', err);
    }
  };
  axios.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        profile,
        setProfile,
        fetchProfile,
        updateProfile, // ✅ make sure this comes after definition
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
