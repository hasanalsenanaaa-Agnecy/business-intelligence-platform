import React from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// بيانات تجريبية
const salesData = [
  { month: 'يناير', مبيعات: 120000, هدف: 100000 },
  { month: 'فبراير', مبيعات: 150000, هدف: 110000 },
  { month: 'مارس', مبيعات: 180000, هدف: 120000 },
  { month: 'أبريل', مبيعات: 160000, هدف: 130000 },
  { month: 'مايو', مبيعات: 200000, هدف: 140000 },
  { month: 'يونيو', مبيعات: 220000, هدف: 150000 },
];

const productData = [
  { name: 'ساعة أبل', قيمة: 45000 },
  { name: 'سماعات', قيمة: 32000 },
  { name: 'شواحن', قيمة: 18000 },
  { name: 'أغطية', قيمة: 15000 },
];

const customerData = [
  { name: 'عملاء جدد', value: 35 },
  { name: 'عملاء عائدون', value: 65 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 لوحة تحكم أداء عملك
      </Typography>

      {/* بطاقات النظرة العامة */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                إجمالي المبيعات
              </Typography>
              <Typography variant="h4" color="primary">
                1,230,000 ر.س
              </Typography>
              <Typography variant="body2" color="success.main">
                ▲ 15% عن الشهر الماضي
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                العملاء النشطين
              </Typography>
              <Typography variant="h4" color="primary">
                247
              </Typography>
              <Typography variant="body2" color="success.main">
                ▲ 8 عملاء جدد
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                متوسط قيمة الشراء
              </Typography>
              <Typography variant="h4" color="primary">
                2,450 ر.س
              </Typography>
              <Typography variant="body2" color="error.main">
                ▼ 5% عن الشهر الماضي
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                هامش الربح
              </Typography>
              <Typography variant="h4" color="primary">
                32%
              </Typography>
              <Typography variant="body2" color="success.main">
                ▲ 3% عن الشهر الماضي
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* الرسوم البيانية */}
      <Grid container spacing={3}>
        {/* رسم المبيعات */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              📈 تطور المبيعات الشهرية
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="مبيعات" stroke="#8884d8" />
                <Line type="monotone" dataKey="هدف" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* رسم العملاء */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              👥 توزيع العملاء
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* رسم المنتجات */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              🏆 أفضل المنتجات أداءً
            </Typography>
            <ResponsiveContainer width="100%" height="80%">
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="قيمة" fill="#00A859" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* التوصيات */}
      <Paper sx={{ p: 3, mt: 4, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>
          💡 توصيات هذا الأسبوع
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="error" gutterBottom>
                  ⚠️ انتبه
                </Typography>
                <Typography>
                  المنتج "شواحن" هامش ربحه 12% فقط، فكر في رفع سعره
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography color="success" gutterBottom>
                  ✅ فرصة
                </Typography>
                <Typography>
                  العملاء الذين يشترون "ساعة أبل" يشترون أيضاً "أغطية"، قدم عرضاً مجانياً
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Dashboard;