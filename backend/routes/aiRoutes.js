const express = require('express');
const router = express.Router();
router.post('/recommendations', (req, res) => {
  res.json({ success: true, message: 'AI ready' });
});
router.post('/predict', (req, res) => {
  res.json({ success: true, trend: '↑' });
});
module.exports = router;
