const aiRoutes = require('./routes/aiRoutes');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// استيراد Routes
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // عنوان Frontend
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);

// Route للصحة
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ الخادم يعمل بشكل ممتاز',
    timestamp: new Date().toLocaleString('ar-SA'),
    service: 'منصة ذكاء الأعمال - Backend'
  });
});

// Route رئيسي
app.get('/', (req, res) => {
  res.json({
    message: '🚀 مرحباً بكم في منصة ذكاء الأعمال API',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      upload: 'POST /api/upload',
      analyze: 'POST /api/analyze'
    },
    documentation: 'سيتم إضافة التوثيق قريباً'
  });
});

app.use('/api/ai', aiRoutes);

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/business-intelligence', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ تم الاتصال بقاعدة البيانات MongoDB'))
.catch(err => console.error('❌ خطأ في الاتصال بقاعدة البيانات:', err));

// تشغيل الخادم
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 الخادم يعمل على: http://localhost:${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/api/health`);
});