// backend/controllers/authController.js
const User = require('../models/User');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, company } = req.body;
    
    // التحقق من وجود المستخدم
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'هذا البريد الإلكتروني مسجل مسبقاً'
      });
    }
    
    // إنشاء توكن التحقق
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 ساعة
    
    // إنشاء المستخدم
    const user = await User.create({
      name,
      email,
      password,
      phone,
      company,
      verificationToken,
      verificationTokenExpires
    });
    
    // إرسال بريد التحقق
    const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify/${verificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'تفعيل حسابك في منصة ذكاء الأعمال',
      template: 'verification',
      data: {
        name: user.name,
        verificationUrl,
        expiryHours: 24
      }
    });
    
    // إنشاء توكن
    const token = user.generateAuthToken();
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح. الرجاء تفعيل بريدك الإلكتروني.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء التسجيل',
      details: error.message
    });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // التحقق من البريد وكلمة المرور
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }
    
    // التحقق من تفعيل الحساب
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        error: 'الحساب غير مفعل. الرجاء تفعيل بريدك الإلكتروني.'
      });
    }
    
    // تحديث آخر نشاط
    await user.updateLastActive();
    
    // إنشاء توكن
    const token = user.generateAuthToken();
    
    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        subscription: user.subscription,
        language: user.language,
        currency: user.currency,
        stats: user.stats
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تسجيل الدخول'
    });
  }
};

// التحقق من البريد
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        error: 'توكن التحقق غير صالح أو منتهي الصلاحية'
      });
    }
    
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    
    res.json({
      success: true,
      message: 'تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول.'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تفعيل الحساب'
    });
  }
};

// إعادة تعيين كلمة المرور
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'لا يوجد حساب بهذا البريد الإلكتروني'
      });
    }
    
    // إنشاء توكن إعادة التعيين
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // ساعة واحدة
    
    await user.save({ validateBeforeSave: false });
    
    // إرسال البريد
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'إعادة تعيين كلمة المرور',
      template: 'reset-password',
      data: {
        name: user.name,
        resetUrl,
        expiryMinutes: 60
      }
    });
    
    res.json({
      success: true,
      message: 'تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء إرسال البريد'
    });
  }
};