import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress,
  Tabs,
  Tab
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin, onRegister }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await onLogin(loginData.email, loginData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      setError('كلمات المرور غير متطابقة');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const userData = {
      name: registerData.name,
      email: registerData.email,
      password: registerData.password,
      company: registerData.company
    };
    
    const result = await onRegister(userData);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          منصة ذكاء الأعمال
        </Typography>
        
        <Typography variant="body1" align="center" color="textSecondary" paragraph>
          حلل بياناتك واتخذ قرارات ذكية
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered>
            <Tab label="تسجيل الدخول" />
            <Tab label="إنشاء حساب" />
          </Tabs>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* تسجيل الدخول */}
        {activeTab === 0 && (
          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={loginData.email}
              onChange={(e) => setLoginData({...loginData, email: e.target.value})}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              margin="normal"
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'تسجيل الدخول'}
            </Button>
          </Box>
        )}

        {/* إنشاء حساب */}
        {activeTab === 1 && (
          <Box component="form" onSubmit={handleRegister}>
            <TextField
              fullWidth
              label="الاسم الكامل"
              value={registerData.name}
              onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="البريد الإلكتروني"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="كلمة المرور"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="تأكيد كلمة المرور"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="اسم الشركة (اختياري)"
              value={registerData.company}
              onChange={(e) => setRegisterData({...registerData, company: e.target.value})}
              margin="normal"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'إنشاء حساب'}
            </Button>
          </Box>
        )}

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            بالاستمرار، فإنك توافق على{' '}
            <Link href="#" underline="hover">شروط الخدمة</Link>{' '}
            و{' '}
            <Link href="#" underline="hover">سياسة الخصوصية</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;