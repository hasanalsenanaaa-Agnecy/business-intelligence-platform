// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  // المعلومات الأساسية
  name: {
    type: String,
    required: [true, 'الاسم مطلوب'],
    trim: true
  },
  
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صالح']
  },
  
  phone: {
    type: String,
    validate: {
      validator: function(v) {
        return /^(05\d{8}|5\d{8})$/.test(v);
      },
      message: 'رقم الجوال السعودي غير صالح'
    }
  },
  
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: 6,
    select: false
  },
  
  // الملف الشخصي
  profileImage: {
    type: String,
    default: 'default-avatar.png'
  },
  
  company: String,
  jobTitle: String,
  industry: {
    type: String,
    enum: ['تجارة', 'صناعة', 'خدمات', 'تقنية', 'تعليم', 'صحة', 'أخرى']
  },
  
  // الإعدادات
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar'
  },
  
  currency: {
    type: String,
    enum: ['SAR', 'USD', 'EUR'],
    default: 'SAR'
  },
  
  notifications: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: true }
  },
  
  // الاشتراك
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'basic', 'pro', 'enterprise'],
      default: 'free'
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'expired', 'trial'],
      default: 'trial'
    },
    trialEndsAt: {
      type: Date,
      default: () => new Date(Date.now() + 14*24*60*60*1000) // 14 يوم
    },
    currentPeriodEnd: Date,
    stripeCustomerId: String,
    stripeSubscriptionId: String
  },
  
  // القيود
  limits: {
    monthlyAnalyses: { type: Number, default: 10 },
    fileSizeMB: { type: Number, default: 10 },
    storageMB: { type: Number, default: 100 },
    teamMembers: { type: Number, default: 1 }
  },
  
  // الإحصائيات
  stats: {
    totalAnalyses: { type: Number, default: 0 },
    totalFiles: { type: Number, default: 0 },
    lastLogin: Date,
    loginCount: { type: Number, default: 0 }
  },
  
  // الأمان
  isVerified: { type: Boolean, default: false },
  verificationToken: String,
  verificationTokenExpires: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  
  // التواريخ
  lastActive: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// تشفير كلمة المرور قبل الحفظ
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// مقارنة كلمة المرور
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// إنشاء توكن JWT
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id, email: this.email, subscription: this.subscription.plan },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// تحديث آخر نشاط
userSchema.methods.updateLastActive = async function() {
  this.lastActive = new Date();
  this.stats.loginCount += 1;
  await this.save();
};

module.exports = mongoose.model('User', userSchema);