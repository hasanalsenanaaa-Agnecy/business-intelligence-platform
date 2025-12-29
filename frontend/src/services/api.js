// frontend/src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 ثانية
});

// إضافة interceptor للتعامل مع الأخطاء
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new Error('تعذر الاتصال بالخادم. تأكد من تشغيل Backend.'));
    }
    
    if (error.response?.status === 413) {
      return Promise.reject(new Error('حجم الملف كبير جداً. الحد الأقصى 10MB'));
    }
    
    if (error.response?.status === 415) {
      return Promise.reject(new Error('نوع الملف غير مدعوم'));
    }
    
    return Promise.reject(error);
  }
);

// دالة رفع الملف للـ Backend
export const uploadFileToBackend = async (file, userId = 'demo-user', email = 'demo@example.com') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('email', email);

  try {
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

// دالة جلب تاريخ التحليلات
export const getUserAnalyses = async (userId) => {
  try {
    const response = await api.get(`/upload/history/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching analyses:', error);
    return { success: false, analyses: [] };
  }
};

// دالة التحقق من صحة الخادم
export const checkServerHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    console.error('Server is not responding:', error);
    return { status: '❌ الخادم غير متصل' };
  }
};

export default api;