// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// حماية Routes
exports.protect = async (req, res, next) => {
  try {
    let token;
    
    // استخراج التوكن من Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'غير مصرح لك بالوصول. الرجاء تسجيل الدخول.'
      });
    }
    
    // التحقق من التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // البحث عن المستخدم
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'المستخدم غير موجود.'
      });
    }
    
    // التحقق من تفعيل الحساب
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'الحساب غير مفعل. الرجاء تفعيل بريدك الإلكتروني.'
      });
    }
    
    // إضافة المستخدم إلى Request
    req.user = user;
    next();
    
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'التوكن غير صالح أو منتهي الصلاحية'
    });
  }
};

// التحقق من صلاحيات الاشتراك
exports.subscriptionRequired = (requiredPlan) => {
  return (req, res, next) => {
    const userPlan = req.user.subscription.plan;
    const planHierarchy = {
      'free': 1,
      'basic': 2,
      'pro': 3,
      'enterprise': 4
    };
    
    if (planHierarchy[userPlan] < planHierarchy[requiredPlan]) {
      return res.status(403).json({
        success: false,
        error: `هذه الميزة تتطلب اشتراك ${requiredPlan}. الرجاء الترقية.`
      });
    }
    
    next();
  };
};

// Rate Limiting
const rateLimit = require('express-rate-limit');

exports.limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب لكل IP
  message: {
    success: false,
    error: 'لقد تجاوزت عدد الطلبات المسموح بها. الرجاء المحاولة بعد 15 دقيقة.'
  }
});