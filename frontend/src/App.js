import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, CircularProgress, Box } from '@mui/material';

import theme from './styles/theme';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Login from './pages/Login';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // تحميل المستخدم من localStorage عند البدء
  useEffect(() => {
    const savedUser = localStorage.getItem('business-intel-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // تسجيل الدخول
  const handleLogin = (email) => {
    const userData = {
      email,
      name: email.split('@')[0],
      isDemo: true,
      id: Date.now().toString(),
      joined: new Date().toISOString(),
      plan: 'free' // مجاني في البداية
    };
    
    localStorage.setItem('business-intel-user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  // تسجيل الخروج
  const handleLogout = () => {
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
          {/* الصفحة الرئيسية متاحة للجميع */}
          <Route path="/" element={<Home user={user} onLogout={handleLogout} />} />
          
          {/* لوحة التحكم تحتاج تسجيل دخول */}
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
          
          {/* صفحة رفع الملفات تحتاج تسجيل دخول */}
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
          
          {/* صفحة تسجيل الدخول */}
          <Route 
            path="/login" 
            element={
              !user ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to="/dashboard" />
              )
            } 
          />
          
          {/* صفحة غير موجودة */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;