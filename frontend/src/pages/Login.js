import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Box,
  Link,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Fade,
  Zoom,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // تحقق بسيط من صحة البيانات
      if (!email.trim()) {
        throw new Error('البريد الإلكتروني مطلوب');
      }
      
      if (!email.includes('@') || !email.includes('.')) {
        throw new Error('البريد الإلكتروني غير صحيح');
      }
      
      if (!password.trim()) {
        throw new Error('كلمة المرور مطلوبة');
      }
      
      if (password.length < 3) {
        throw new Error('كلمة المرور يجب أن تكون 3 أحرف على الأقل');
      }

      // تسجيل الدخول/التسجيل
      const userData = onLogin(email);
      
      // تأخير بسيط لمحاكاة الشبكة
      setTimeout(() => {
        setLoading(false);
        navigate('/dashboard');
      }, 800);

    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleQuickLogin = (testEmail, testName) => {
    setEmail(testEmail);
    setPassword('123456');
    const userData = onLogin(testEmail);
    navigate('/dashboard');
  };

  const demoAccounts = [
    {
      email: 'demo@business-intel.com',
      name: 'حساب تجريبي',
      role: '👤 زائر',
      color: '#00A859',
    },
    {
      email: 'owner@store.com',
      name: 'صاحب متجر',
      role: '🏪 بائع',
      color: '#2196F3',
    },
    {
      email: 'manager@company.com',
      name: 'مدير مبيعات',
      role: '📈 مدير',
      color: '#FF9800',
    },
  ];

  return (
    <Fade in={true} timeout={1000}>
      <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 } }}>
        {/* العنوان */}
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 4, md: 6 },
          mt: { xs: 2, md: 4 }
        }}>
          <Zoom in={true} timeout={800}>
            <Box sx={{ display: 'inline-flex', mb: 3 }}>
              <RocketLaunchIcon sx={{ 
                fontSize: { xs: 50, md: 60 }, 
                color: 'primary.main',
                animation: 'float 3s ease-in-out infinite',
                '@keyframes float': {
                  '0%, 100%': { transform: 'translateY(0)' },
                  '50%': { transform: 'translateY(-10px)' },
                }
              }} />
            </Box>
          </Zoom>
          
          <Typography variant="h2" gutterBottom fontWeight="bold" color="primary" sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            {isSignUp ? '🎯 ابدأ رحلتك الآن' : '🔐 مرحباً بعودتك'}
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ fontSize: { xs: '1rem', md: '1.5rem' } }}>
            {isSignUp 
              ? 'سجل حساباً جديداً واستمتع بتحليل بياناتك مجاناً' 
              : 'سجل دخول لمتابعة تحليلاتك واستكشاف فرص النمو'}
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* نموذج التسجيل */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1000}>
              <Card elevation={3} sx={{ 
                borderRadius: 3,
                height: '100%',
                border: 1,
                borderColor: 'divider'
              }}>
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Box sx={{ textAlign: 'center', mb: 3 }}>
                    {isSignUp ? (
                      <PersonAddIcon sx={{ 
                        fontSize: { xs: 50, md: 60 }, 
                        color: 'primary.main' 
                      }} />
                    ) : (
                      <LockOpenIcon sx={{ 
                        fontSize: { xs: 50, md: 60 }, 
                        color: 'primary.main' 
                      }} />
                    )}
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        borderRadius: 2
                      }}
                      onClose={() => setError('')}
                    >
                      {error}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit}>
                    <Box sx={{ mb: 2 }}>
                      <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 2 }}
                        InputProps={{
                          startAdornment: (
                            <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                      
                      <TextField
                        fullWidth
                        label="كلمة المرور"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        helperText="أي كلمة مرور تناسبك للتجربة"
                        InputProps={{
                          startAdornment: (
                            <KeyIcon sx={{ mr: 1, color: 'text.secondary' }} />
                          ),
                        }}
                      />
                    </Box>

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      type="submit"
                      disabled={loading || !email || !password}
                      sx={{ 
                        mt: 2, 
                        mb: 2, 
                        py: 1.5,
                        borderRadius: 2,
                        fontSize: '1.1rem'
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : isSignUp ? (
                        'إنشاء حساب جديد'
                      ) : (
                        'تسجيل الدخول'
                      )}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                      <Link
                        component="button"
                        type="button"
                        onClick={() => {
                          setIsSignUp(!isSignUp);
                          setError('');
                        }}
                        sx={{ 
                          cursor: 'pointer',
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        disabled={loading}
                      >
                        {isSignUp 
                          ? 'لديك حساب بالفعل؟ سجل دخول' 
                          : 'لا تملك حساباً؟ سجل الآن'}
                      </Link>
                    </Box>
                  </form>

                  {/* معلومات إضافية */}
                  <Box sx={{ 
                    mt: 4, 
                    pt: 3, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      🔒 بياناتك تبقى خاصة على جهازك
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      💡 يمكنك مسح البيانات متى شئت من إعدادات المتصفح
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>

          {/* خيارات سريعة */}
          <Grid item xs={12} md={6}>
            <Zoom in={true} timeout={1200}>
              <Card elevation={3} sx={{ 
                borderRadius: 3,
                height: '100%',
                border: 1,
                borderColor: 'divider',
                bgcolor: 'grey.50'
              }}>
                <CardContent sx={{ 
                  p: { xs: 3, md: 4 },
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column' 
                }}>
                  <Typography variant="h4" gutterBottom color="primary" sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}>
                    ⚡ دخول سريع للتجربة
                  </Typography>
                  
                  <Typography paragraph color="text.secondary" sx={{ mb: 4 }}>
                    جرب المنصة مباشرة بدون تسجيل مفصل. اختر أحد الحسابات التجريبية:
                  </Typography>

                  <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {demoAccounts.map((account, index) => (
                      <Card 
                        key={index}
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          '&:hover': {
                            transform: 'translateX(8px)',
                            boxShadow: 4
                          },
                          borderLeft: `4px solid ${account.color}`
                        }}
                        onClick={() => handleQuickLogin(account.email, account.name)}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={8}>
                              <Typography variant="h6" fontWeight="bold">
                                {account.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {account.email}
                              </Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                              <Typography variant="body1" color={account.color} fontWeight="bold">
                                {account.role}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>

                  {/* خيارات إضافية */}
                  <Box sx={{ mt: 'auto', pt: 4 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="large"
                          onClick={() => navigate('/')}
                          sx={{ 
                            py: 1.5,
                            borderRadius: 2
                          }}
                        >
                          👀 تصفح كزائر
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                          fullWidth
                          variant="outlined"
                          size="large"
                          onClick={() => {
                            setEmail('');
                            setPassword('');
                            setIsSignUp(true);
                          }}
                          sx={{ 
                            py: 1.5,
                            borderRadius: 2
                          }}
                        >
                          📝 حساب جديد كامل
                        </Button>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* تذكير */}
                  <Box sx={{ 
                    mt: 4, 
                    pt: 3, 
                    borderTop: 1, 
                    borderColor: 'divider',
                    textAlign: 'center'
                  }}>
                    <Typography variant="body2" color="text.secondary">
                      💡 جميع الحسابات التجريبية تستخدم كلمة المرور: 123456
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Zoom>
          </Grid>
        </Grid>

        {/* فوتر الصفحة */}
        <Box sx={{ 
          mt: 6, 
          textAlign: 'center',
          pt: 4,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="body1" color="text.secondary" paragraph>
            ✅ لا نحتفظ بكلمات المرور - كل شيء مخزن محلياً على جهازك
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📱 متوافق مع جميع الأجهزة | 🇸🇦 صمم خصيصاً للسوق السعودي
          </Typography>
          
          <Button
            variant="text"
            size="small"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            ← العودة للصفحة الرئيسية
          </Button>
        </Box>
      </Container>
    </Fade>
  );
};

export default Login;