const express = require('express');
const app = express();
app.get('/api/health', (req, res) => {
  res.json({status: '✅ OK', time: new Date().toISOString()});
});
app.get('/', (req, res) => {
  res.json({message: 'Backend API is running'});
});
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server: ${PORT}`));
