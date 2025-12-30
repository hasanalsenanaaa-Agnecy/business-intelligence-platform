import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // تعيين التوكن في الهيدر
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  };

  // تسجيل الدخول
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/login', { email, password });
      
      if (response.data.success) {
        const { data } = response.data;
        setUser(data);
        setAuthToken(data.token);
        setError(null);
        return { success: true, data };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'حدث خطأ أثناء تسجيل الدخول';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // التسجيل
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/auth/register', userData);
      
      if (response.data.success) {
        const { data } = response.data;
        setUser(data);
        setAuthToken(data.token);
        setError(null);
        return { success: true, data };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'حدث خطأ أثناء التسجيل';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const logout = () => {
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
  };

  // التحقق من حالة المصادقة عند التحميل
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        setAuthToken(token);
        try {
          const response = await axios.get('/api/auth/me');
          if (response.data.success) {
            setUser(response.data.data);
          }
        } catch (error) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      error,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};