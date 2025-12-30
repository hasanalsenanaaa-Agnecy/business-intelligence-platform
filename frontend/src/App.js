import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { authAPI } from './services/api';

import theme from './styles/theme';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تحميل المستخدم عند البدء
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('business-intel-user');
    
    if (token && savedUser) {
      // التحقق من صحة التوكن
      authAPI.getMe()
        .then(response => {
          if (response.data.success) {
            const userData = response.data.data;
            const fullUserData = {
              ...JSON.parse(savedUser),
              ...userData
            };
            setUser(fullUserData);
            localStorage.setItem('business-intel-user', JSON.stringify(fullUserData));
          } else {
            // التوكن غير صالح
            localStorage.removeItem('token');
            localStorage.removeItem('business-intel-user');
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('business-intel-user');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // تسجيل الدخول الحقيقي
  const handleLogin = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const userData = response.data.data;
        
        // حفظ التوكن والمستخدم
        localStorage.setItem('token', userData.token);
        localStorage.setItem('business-intel-user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, data: userData };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'حدث خطأ أثناء تسجيل الدخول';
      return { success: false, error: message };
    }
  };

  // تسجيل مستخدم جديد
  const handleRegister = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const newUser = response.data.data;
        
        // حفظ التوكن والمستخدم
        localStorage.setItem('token', newUser.token);
        localStorage.setItem('business-intel-user', JSON.stringify(newUser));
        
        setUser(newUser);
        return { success: true, data: newUser };
      }
    } catch (error) {
      const message = error.response?.data?.error || 'حدث خطأ أثناء التسجيل';
      return { success: false, error: message };
    }
  };

  // تسجيل الخروج
  const handleLogout = () => {
    authAPI.logout().catch(() => {}); // تجاهل الأخطاء
    localStorage.removeItem('token');
    localStorage.removeItem('business-intel-user');
    setUser(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* الصفحة الرئيسية */}
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          
          {/* لوحة التحكم */}
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <Dashboard user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* رفع الملفات */}
          <Route 
            path="/upload" 
            element={
              user ? (
                <Upload user={user} />
              ) : (
                <Navigate to="/login" />
              )
            } 
          />
          
          {/* تسجيل الدخول */}
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login onLogin={handleLogin} onRegister={handleRegister} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />
          
          {/* إعادة التوجيه */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;