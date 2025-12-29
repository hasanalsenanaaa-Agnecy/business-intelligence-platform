// frontend/src/services/aiService.js
import api from './api';

export const getAIRecommendations = async (analysisData) => {
  try {
    const response = await api.post('/ai/recommendations', {
      analysis: analysisData
    });
    return response.data;
  } catch (error) {
    console.error('AI Recommendations Error:', error);
    // رد افتراضي في حالة الخطأ
    return {
      success: false,
      recommendations: `تحليل الذكاء الاصطناعي غير متوفر حاليًا. يمكنك:
      
      1. التحقق من اتصال الإنترنت
      2. التأكد من تشغيل خادم Backend
      3. إعادة المحاولة لاحقًا
      
      نصائح عامة:
      - ركز على المنتجات الأكثر ربحية
      - حَسّن تجربة العملاء
      - وسّع قاعدة عملائك
      - استخدم البيانات لاتخاذ قرارات أفضل`
    };
  }
};

export const getSalesPredictions = async (historicalData) => {
  try {
    const response = await api.post('/ai/predict', {
      historicalData
    });
    return response.data;
  } catch (error) {
    console.error('Predictions Error:', error);
    // توقعات افتراضية
    const lastValue = historicalData[historicalData.length - 1] || 1000;
    return {
      success: false,
      predictions: Array(7).fill(0).map((_, i) => 
        Math.round(lastValue * (0.9 + (i * 0.05)))
      ),
      trend: "↑ تصاعدي",
      confidence: "65%",
      recommendation: "تابع نفس استراتيجية المبيعات وحسّن خدمة العملاء"
    };
  }
};