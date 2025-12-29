const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);

// ✅ Health check الإلزامي لـ Render
app.get('/api/health', (req, res) => {
  res.json({
    status: '✅ Backend API يعمل على Render!',
    service: 'Business Intelligence Platform',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    nodeVersion: process.version
  });
});

// ✅ الصفحة الرئيسية
app.get('/', (req, res) => {
  res.json({
    message: '🚀 منصة ذكاء الأعمال - Backend API',
    version: '2.0.0',
    endpoints: {
      health: 'GET /api/health',
      upload: 'POST /api/upload',
      docs: 'https://github.com/hasanalsenanaaa-Agnecy/business-intelligence-platform'
    }
  });
});

// ✅ 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'المسار غير موجود',
    requestedUrl: req.originalUrl,
    availableEndpoints: ['/', '/api/health', '/api/upload']
  });
});

// ✅ Start server - مهم لـ Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║     🚀 BACKEND API يعمل الآن!       ║
  ╠══════════════════════════════════════╣
  ║ 📍 Port: ${PORT}                      ║
  ║ 🔗 Health: /api/health               ║
  ║ 📤 Upload: /api/upload               ║
  ╚══════════════════════════════════════╝
  `);
});
