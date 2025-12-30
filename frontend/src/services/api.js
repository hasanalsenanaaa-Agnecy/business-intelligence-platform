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

// في نهاية api.js أضف:

// Auth API functions
export const authAPI = {
  // تسجيل مستخدم جديد
  register: (userData) => {
    // مؤقتاً: نستخدم Backend demo حتى ينشر
    return Promise.resolve({
      data: {
        success: true,
        message: 'التسجيل يعمل (وضع التطوير)',
        data: {
          _id: 'demo-' + Date.now(),
          name: userData.name,
          email: userData.email,
          company: userData.company || '',
          plan: 'free',
          analyticsCount: 0,
          token: 'demo-token-' + Date.now()
        }
      }
    });
  },
  
  // تسجيل الدخول
  login: (credentials) => {
    // مؤقتاً: نستخدم Backend demo حتى ينشر
    return Promise.resolve({
      data: {
        success: true,
        message: 'تسجيل الدخول يعمل (وضع التطوير)',
        data: {
          _id: 'demo-123',
          name: credentials.email.split('@')[0],
          email: credentials.email,
          company: 'شركة تجريبية',
          plan: 'free',
          analyticsCount: 5,
          token: 'demo-token-123'
        }
      }
    });
  },
  
  // بيانات المستخدم الحالي
  getMe: () => {
    // مؤقتاً
    return Promise.resolve({
      data: {
        success: true,
        data: {
          _id: 'demo-123',
          name: 'مستخدم تجريبي',
          email: 'demo@example.com',
          plan: 'free',
          analyticsCount: 5
        }
      }
    });
  },
  
  // تسجيل الخروج
  logout: () => {
    return Promise.resolve({
      data: { success: true, message: 'تم تسجيل الخروج' }
    });
  }
};

// أو إذا كان Backend يعمل، استخدم هذا:
/*
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:10000/api';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
};
*/

export default api;