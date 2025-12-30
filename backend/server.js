const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// ✅ هذا المسار يعمل 100%
app.get('/api/health', (req, res) => {
  res.json({ 
    status: '✅ BACKEND LIVE',
    time: new Date().toISOString(),
    service: 'Business Intelligence Platform'
  });
});

// ✅ Upload بسيط
app.post('/api/upload', (req, res) => {
  res.json({
    success: true,
    analysis: {
      summary: {
        totalSales: 28500,
        averageSale: 4750,
        topProduct: 'منتج أ'
      }
    }
  });
});

// ✅ Start
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running: ${PORT}`);
});
