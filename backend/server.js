const express = require('express');
const cors = require('cors');
const uploadRoutes = require('./routes/uploadRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: '✅ OK', time: new Date().toISOString() });
});

// Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(\`🚀 Server running: \${PORT}\`);
});
