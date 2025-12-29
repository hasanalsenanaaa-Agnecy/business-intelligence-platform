import React from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadIcon from '@mui/icons-material/Upload';

const Home = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AnalyticsIcon fontSize="large" color="primary" />,
      title: 'تحليل ذكي',
      description: 'حلل بيانات مبيعاتك واكتشف فرص النمو المخفية',
      color: '#00A859',
    },
    {
      icon: <TrendingUpIcon fontSize="large" color="primary" />,
      title: 'تنبؤات دقيقة',
      description: 'توقع مبيعاتك ومخزونك قبل 30 يوماً',
      color: '#2196F3',
    },
    {
      icon: <AttachMoneyIcon fontSize="large" color="primary" />,
      title: 'توصيات ربحية',
      description: 'خطوات عملية لزيادة أرباحك الشهرية',
      color: '#FF9800',
    },
  ];

  const quickActions = [
    {
      title: '📊 لوحة التحكم',
      description: 'شاهد إحصائياتك وتقاريرك',
      action: () => navigate('/dashboard'),
      icon: <DashboardIcon />,
      color: '#00A859',
    },
    {
      title: '📤 رفع ملف',
      description: 'حلل بيانات مبيعاتك الآن',
      action: () => navigate('/upload'),
      icon: <UploadIcon />,
      color: '#2196F3',
    },
  ];

  return (
    <Container maxWidth="lg">
      {/* شريط التنقل العلوي */}
      <Box sx={{ 
        py: 2, 
        mb: 4, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            🚀 منصة ذكاء الأعمال
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <Typography variant="body1" color="text.secondary">
                👋 مرحباً، <strong>{user.name}</strong>
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={onLogout}
                sx={{ borderRadius: 2 }}
              >
                خروج
              </Button>
            </>
          ) : (
            <Button 
              variant="contained" 
              size="small"
              onClick={() => navigate('/login')}
              sx={{ borderRadius: 2 }}
            >
              دخول / تسجيل
            </Button>
          )}
        </Box>
      </Box>

      {/* الهيرو */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 8,
        background: 'linear-gradient(135deg, #00A859 0%, #2196F3 100%)',
        borderRadius: 4,
        color: 'white',
        mb: 6
      }}>
        <Typography variant="h1" gutterBottom fontWeight="bold" sx={{ fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
          حوّل بياناتك إلى أرباح
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, opacity: 0.9 }}>
          منصة ذكاء الأعمال الأولى للشركات الصغيرة في السعودية
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            sx={{ 
              mx: 1, 
              mb: 2,
              bgcolor: 'white',
              color: '#00A859',
              '&:hover': { bgcolor: '#f5f5f5' }
            }}
            onClick={() => navigate('/upload')}
          >
            ابدأ مجاناً الآن
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ 
              mx: 1, 
              mb: 2,
              borderColor: 'white',
              color: 'white',
              '&:hover': { borderColor: '#f5f5f5', bgcolor: 'rgba(255,255,255,0.1)' }
            }}
            onClick={() => navigate('/dashboard')}
          >
            شاهد مثالاً حياً
          </Button>
        </Box>
      </Box>

      {/* المميزات */}
      <Typography variant="h3" align="center" gutterBottom sx={{ mb: 6 }}>
        لماذا تختار منصتنا؟
      </Typography>
      
      <Grid container spacing={4} sx={{ mb: 8 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              textAlign: 'center',
              borderRadius: 3,
              borderTop: `4px solid ${feature.color}`,
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: 6
              }
            }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ 
                  mb: 3,
                  display: 'inline-flex',
                  p: 2,
                  borderRadius: '50%',
                  bgcolor: `${feature.color}15`
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" gutterBottom fontWeight="bold">
                  {feature.title}
                </Typography>
                <Typography color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* الإجراءات السريعة */}
      {user && (
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
            ⚡ إجراءات سريعة
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card 
                  sx={{ 
                    textAlign: 'center',
                    borderRadius: 3,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: 4
                    }
                  }}
                  onClick={action.action}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ 
                      mb: 2,
                      display: 'inline-flex',
                      p: 2,
                      borderRadius: '50%',
                      bgcolor: `${action.color}20`
                    }}>
                      {React.cloneElement(action.icon, { sx: { fontSize: 40, color: action.color } })}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                      {action.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {action.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* دعوة للعمل */}
      <Box sx={{ 
        textAlign: 'center', 
        py: 6, 
        px: 4,
        bgcolor: 'grey.50',
        borderRadius: 4,
        border: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h3" gutterBottom color="primary">
          جرب المنصة مجاناً
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
          لا تحتاج بطاقة ائتمان - ابدأ برحلة النمو الآن
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>🎯 مجاني 14 يوم</Typography>
              <Typography>تجربة كاملة للمنصة</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>📈 تحليل غير محدود</Typography>
              <Typography>لا حدود لعدد الملفات</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, bgcolor: 'white', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>🤝 دعم فني</Typography>
              <Typography>مساعدتك أولويتنا</Typography>
            </Box>
          </Grid>
        </Grid>

        <Button
          variant="contained"
          size="large"
          sx={{ 
            px: 6,
            py: 1.5,
            fontSize: '1.1rem',
            borderRadius: 2
          }}
          onClick={() => navigate(user ? '/dashboard' : '/login')}
        >
          {user ? '🚀 ابدأ التحليل الآن' : '🎯 سجل حساباً جديداً'}
        </Button>
        
        {!user && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            لديك حساب بالفعل؟{' '}
            <Button 
              variant="text" 
              size="small"
              onClick={() => navigate('/login')}
              sx={{ textDecoration: 'underline' }}
            >
              سجل دخول
            </Button>
          </Typography>
        )}
      </Box>

      {/* الفوتر */}
      <Box sx={{ 
        mt: 8, 
        pt: 4, 
        borderTop: 1, 
        borderColor: 'divider',
        textAlign: 'center'
      }}>
        <Typography variant="body2" color="text.secondary">
          © 2024 منصة ذكاء الأعمال. جميع الحقوق محفوظة.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          صمم خصيصاً للشركات الصغيرة والمتوسطة في السعودية
        </Typography>
      </Box>
    </Container>
  );
};

export default Home;