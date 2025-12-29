const express = require('express');
const multer = require('multer');
const uploadController = require('../controllers/uploadController');

const router = express.Router();

// إعداد multer للتعامل مع رفع الملفات
const storage = multer.memoryStorage(); // تخزين في الذاكرة بدلاً من القرص

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB كحد أقصى
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /xlsx|xls|csv/;
    const extname = allowedTypes.test(
      file.originalname.toLowerCase().split('.').pop()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('نوع الملف غير مدعوم. الرجاء رفع ملف Excel أو CSV'));
    }
  }
});

// Routes
router.post('/', upload.single('file'), uploadController.uploadAndAnalyze);
router.get('/history/:userId', uploadController.getUserAnalyses);

module.exports = router;