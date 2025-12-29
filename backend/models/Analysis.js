const mongoose = require('mongoose');

const analysisSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  fileType: {
    type: String,
    enum: ['xlsx', 'xls', 'csv'],
    required: true
  },
  
  // نتائج التحليل
  analysis: {
    summary: {
      totalSales: Number,
      totalTransactions: Number,
      totalQuantity: Number,
      uniqueCustomers: Number,
      averageSale: Number,
      averageQuantity: Number,
      estimatedProfit: Number,
      profitMargin: Number
    },
    topProducts: [{
      name: String,
      value: Number,
      percentage: Number
    }],
    topCustomers: [{
      name: String,
      value: Number,
      percentage: Number
    }],
    recommendations: [String]
  },
  
  // بيانات العينة
  sampleData: [mongoose.Schema.Types.Mixed],
  
  // معلومات الوقت
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  
  // حالة التحليل
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed'],
    default: 'completed'
  },
  
  // للإحصائيات
  processingTime: Number, // بالمللي ثانية
  recordCount: Number
}, {
  timestamps: true // يضيف createdAt و updatedAt تلقائياً
});

// إضافة فهارس للبحث السريع
analysisSchema.index({ userId: 1, uploadedAt: -1 });
analysisSchema.index({ 'analysis.summary.totalSales': -1 });

// نموذج التحليل
const Analysis = mongoose.model('Analysis', analysisSchema);

module.exports = Analysis;