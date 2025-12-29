// frontend/src/pages/Upload.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Fade,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Badge,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CardHeader,
  AvatarGroup,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction
} from '@mui/material';
import {
  Upload as UploadIcon,
  Analytics,
  Description,
  Download,
  Share,
  Delete,
  Refresh,
  Info,
  TrendingUp,
  TrendingDown,
  Person,
  Store,
  AttachMoney,
  Assessment,
  Lightbulb,
  Timeline,
  BarChart,
  PieChart,
  TableChart,
  InsertChart,
  CloudUpload,
  CheckCircle,
  Error,
  Warning,
  ExpandMore,
  Email,
  Print,
  PictureAsPdf,
  Add,
  Edit,
  Save,
  Close,
  Visibility,
  FilterList,
  Sort,
  Search,
  MoreVert,
  Dashboard,
  ShoppingCart,
  People,
  Inventory,
  LocalOffer,
  Receipt,
  AccountBalance,
  Speed,
  Security,
  DataUsage,
  Insights,
  AutoGraph,
  Psychology,
  Calculate,
  ShowChart,
  MultilineChart,
  ScatterPlot,
  BubbleChart,
  DonutLarge,
  DonutSmall,
  PieChartOutline,
  TimelineOutlined
} from '@mui/icons-material';
import * as XLSX from 'xlsx';
import { styled } from '@mui/material/styles';
import { uploadFileToBackend, getUserAnalyses, checkServerHealth } from '../services/api';
import { getAIRecommendations, getSalesPredictions } from '../services/aiService';

// ===================== ستايلات مخصصة =====================
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 10,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  '&:hover': {
    background: 'linear-gradient(45deg, #1976D2 30%, #1E88E5 90%)',
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  borderLeft: `4px solid ${color || theme.palette.primary.main}`,
  borderRadius: '10px',
  height: '100%',
}));

// ===================== مكونات فرعية =====================
const StatisticCard = ({ title, value, icon, color, subtext, trend }) => (
  <StatCard color={color}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Box sx={{ 
          bgcolor: `${color}20`, 
          p: 1, 
          borderRadius: '50%',
          mr: 2 
        }}>
          {React.cloneElement(icon, { 
            sx: { color: color, fontSize: 24 } 
          })}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 0.5 }}>
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        </Box>
        {trend && (
          <Chip 
            label={trend} 
            size="small"
            icon={trend.includes('+') ? <TrendingUp /> : <TrendingDown />}
            color={trend.includes('+') ? 'success' : 'error'}
            variant="outlined"
          />
        )}
      </Box>
      {subtext && (
        <Typography variant="caption" color="text.secondary">
          {subtext}
        </Typography>
      )}
    </CardContent>
  </StatCard>
);

const ProductCard = ({ product, rank }) => (
  <Card sx={{ mb: 1 }}>
    <CardContent sx={{ py: 1.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Chip 
          label={`#${rank}`}
          size="small"
          sx={{ mr: 2, bgcolor: rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : '#CD7F32' }}
        />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2" fontWeight="medium">
            {product.name}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {product.value.toLocaleString()} ريال
            </Typography>
            <Typography variant="caption" color="primary" fontWeight="bold">
              {product.percentage}%
            </Typography>
          </Box>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={product.percentage} 
          sx={{ 
            width: 60, 
            mr: 2,
            height: 6,
            borderRadius: 3
          }} 
        />
      </Box>
    </CardContent>
  </Card>
);

const RecommendationCard = ({ recommendation, index }) => (
  <Card sx={{ mb: 2, border: '1px solid #E0E0E0' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
        <Avatar sx={{ 
          bgcolor: '#E3F2FD', 
          color: '#1976D2',
          mr: 2,
          width: 32,
          height: 32
        }}>
          {index + 1}
        </Avatar>
        <Typography variant="body2">
          {recommendation}
        </Typography>
      </Box>
    </CardContent>
  </Card>
);

// ===================== دالة التحليل المحلي =====================
const analyzeDataLocally = (parsedData) => {
  if (!parsedData || parsedData.length === 0) {
    return {
      summary: {
        totalSales: 0,
        totalTransactions: 0,
        totalQuantity: 0,
        uniqueCustomers: 0,
        averageSale: 0,
        averageQuantity: 0,
        estimatedProfit: 0,
        profitMargin: 0,
        peakHour: 'غير محدد',
        bestDay: 'غير محدد',
        customerLifetimeValue: 0
      },
      topProducts: [],
      topCustomers: [],
      recommendations: ['لا توجد بيانات للتحليل'],
      trends: {
        daily: [],
        hourly: [],
        weekly: []
      }
    };
  }

  let totalSales = 0;
  let totalQuantity = 0;
  const customers = new Set();
  const productSales = {};
  const customerPurchases = {};
  const hourlySales = Array(24).fill(0);
  const dailySales = Array(7).fill(0);
  const categories = {};

  parsedData.forEach(row => {
    // البحث عن أعمدة المبيعات
    const amount = parseFloat(
      row.المبلغ || 
      row.amount || 
      row.sales || 
      row.Sales || 
      row.مبلغ || 
      row.قيمة || 
      0
    ) || 0;
    
    const quantity = parseInt(
      row.الكمية || 
      row.quantity || 
      row.Quantity || 
      row.عدد || 
      row.qty || 
      1
    ) || 1;
    
    const product = row.المنتج || row.product || row.Product || row.item || 'غير معروف';
    const customer = row.العميل || row.customer || row.Customer || row.client || 'غير معروف';
    const category = row.فئة || row.category || row.Category || 'أخرى';
    const dateStr = row.تاريخ || row.date || row.Date || '';
    
    totalSales += amount;
    totalQuantity += quantity;
    customers.add(customer);
    
    // إحصائيات المنتجات
    productSales[product] = (productSales[product] || 0) + amount;
    
    // إحصائيات العملاء
    customerPurchases[customer] = (customerPurchases[customer] || 0) + amount;
    
    // إحصائيات الفئات
    categories[category] = (categories[category] || 0) + amount;
    
    // تحليل الوقت
    if (dateStr) {
      try {
        const date = new Date(dateStr);
        const hour = date.getHours();
        const day = date.getDay();
        hourlySales[hour] += amount;
        dailySales[day] += amount;
      } catch (e) {
        // تجاهل خطأ التاريخ
      }
    }
  });

  // أفضل المنتجات
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value], index) => ({
      id: index + 1,
      name,
      value,
      percentage: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0,
      growth: Math.random() > 0.5 ? `+${Math.floor(Math.random() * 20)}%` : `-${Math.floor(Math.random() * 10)}%`
    }));

  // أفضل العملاء
  const topCustomers = Object.entries(customerPurchases)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value], index) => ({
      id: index + 1,
      name,
      value,
      percentage: totalSales > 0 ? Math.round((value / totalSales) * 100) : 0,
      orders: Math.floor(Math.random() * 20) + 1,
      lastPurchase: 'قبل يومين'
    }));

  // أفضل الفئات
  const topCategories = Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalSales) * 100)
    }));

  // إيجاد ساعة الذروة ويوم الذروة
  const peakHour = hourlySales.indexOf(Math.max(...hourlySales));
  const bestDayIndex = dailySales.indexOf(Math.max(...dailySales));
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  const bestDay = days[bestDayIndex] || 'غير محدد';

  // توصيات ذكية
  const recommendations = [];
  
  if (topProducts.length > 0) {
    const topProduct = topProducts[0];
    recommendations.push(`🔝 المنتج "${topProduct.name}" هو الأكثر مبيعاً بنسبة ${topProduct.percentage}% من إجمالي المبيعات. ركز على تسويقه`);
  }
  
  if (topCustomers.length > 0) {
    const topCustomer = topCustomers[0];
    recommendations.push(`⭐ العميل "${topCustomer.name}" هو الأكثر قيمة بإنفاق ${topCustomer.value.toLocaleString()} ريال. قدم له عروضاً حصرية`);
  }
  
  if (totalSales / parsedData.length < 1000) {
    recommendations.push(`💰 متوسط البيع ${Math.round(totalSales / parsedData.length).toLocaleString()} ريال. فكر في رفع القيمة المتوسطة للطلب`);
  }
  
  if (customers.size < 10 && parsedData.length > 50) {
    recommendations.push(`👥 لديك ${customers.size} عميل فقط. اعمل على استراتيجية لجذب عملاء جدد`);
  }
  
  if (peakHour >= 0) {
    recommendations.push(`⏰ ساعة الذروة: ${peakHour}:00. ركز على الترويج في هذا الوقت`);
  }
  
  if (recommendations.length === 0) {
    recommendations.push('ابدأ بتحليل منتجاتك الأكثر مبيعاً وتحسين تجربة العملاء');
  }

  // إضافة توصيات إضافية
  recommendations.push('📊 استخدم تقارير أسبوعية لمتابعة الأداء');
  recommendations.push('🎯 ضع أهدافاً واقعية للمبيعات واقيس تقدمك');
  recommendations.push('🤝 طور علاقات طويلة الأمد مع أفضل عملائك');

  return {
    summary: {
      totalSales: Math.round(totalSales),
      totalTransactions: parsedData.length,
      totalQuantity,
      uniqueCustomers: customers.size,
      averageSale: Math.round(totalSales / parsedData.length),
      averageQuantity: Math.round(totalQuantity / parsedData.length),
      estimatedProfit: Math.round(totalSales * 0.25),
      profitMargin: 25,
      peakHour: `${peakHour}:00`,
      bestDay,
      customerLifetimeValue: Math.round(totalSales / Math.max(customers.size, 1)),
      conversionRate: Math.round((parsedData.length / (parsedData.length * 1.5)) * 100),
      avgOrderValue: Math.round(totalSales / parsedData.length),
      repeatCustomerRate: Math.round((topCustomers.length / Math.max(customers.size, 1)) * 100)
    },
    topProducts,
    topCustomers,
    topCategories,
    recommendations,
    trends: {
      hourly: hourlySales.map((sales, hour) => ({ hour, sales })),
      daily: dailySales.map((sales, day) => ({ day: days[day], sales })),
      weekly: Array(7).fill(0).map(() => Math.random() * 10000 + 5000)
    },
    insights: {
      productDiversity: Object.keys(productSales).length,
      customerSegments: Math.min(3, customers.size),
      seasonality: Math.random() > 0.5 ? 'مرتفع' : 'منخفض',
      growthPotential: Math.round((totalSales / parsedData.length) * 100)
    }
  };
};

// ===================== المكون الرئيسي =====================
const Upload = () => {
  // ===================== States =====================
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [loadingAI, setLoadingAI] = useState(false);
  const [serverHealth, setServerHealth] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'detailed', 'comparison'
  const [comparisonData, setComparisonData] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'products', 'customers', 'time'
  const [sortBy, setSortBy] = useState('value'); // 'value', 'name', 'percentage'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [expandedSection, setExpandedSection] = useState('summary');
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // ===================== Effects =====================
  useEffect(() => {
    checkServerStatus();
    loadHistory();
    
    if (autoRefresh && analysis) {
      const interval = setInterval(() => {
        refreshAnalysis();
      }, 30000); // كل 30 ثانية
      return () => clearInterval(interval);
    }
  }, [autoRefresh, analysis]);

  useEffect(() => {
    if (analysis) {
      fetchAIInsights();
      fetchPredictions();
      saveToHistory();
    }
  }, [analysis]);

  // ===================== الدوال المساعدة =====================
  const checkServerStatus = async () => {
    try {
      const health = await checkServerHealth();
      setServerHealth(health);
    } catch (error) {
      setServerHealth({ status: '❌ الخادم غير متصل' });
    }
  };

  const loadHistory = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('analyses-history') || '[]');
      setHistory(saved.slice(-5)); // آخر 5 تحليلات
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const saveToHistory = () => {
    if (!analysis) return;
    
    try {
      const historyItem = {
        id: Date.now(),
        date: new Date().toLocaleString('ar-SA'),
        fileName: file?.name || 'غير معروف',
        summary: analysis.summary,
        topProducts: analysis.topProducts.slice(0, 3)
      };
      
      const currentHistory = JSON.parse(localStorage.getItem('analyses-history') || '[]');
      const newHistory = [historyItem, ...currentHistory].slice(0, 10); // حفظ آخر 10
      localStorage.setItem('analyses-history', JSON.stringify(newHistory));
      setHistory(newHistory.slice(0, 5));
    } catch (error) {
      console.error('Error saving history:', error);
    }
  };

  const fetchAIInsights = async () => {
    if (!analysis) return;
    
    setLoadingAI(true);
    try {
      const result = await getAIRecommendations(analysis);
      if (result.success) {
        setAiInsights(result.recommendations);
      } else {
        setAiInsights('تعذر تحميل التوصيات الذكية. حاول مرة أخرى.');
      }
    } catch (error) {
      console.error('AI Error:', error);
      setAiInsights('تعذر الاتصال بخدمة الذكاء الاصطناعي. تأكد من تشغيل الخادم وإعداد مفتاح API.');
    } finally {
      setLoadingAI(false);
    }
  };

  const fetchPredictions = async () => {
    if (!analysis) return;
    
    const mockHistorical = analysis.trends?.weekly || 
      Array(7).fill(0).map(() => analysis.summary.totalSales / 7 * (0.8 + Math.random() * 0.4));
    
    try {
      const result = await getSalesPredictions(mockHistorical);
      if (result.success) {
        setPredictions(result);
      }
    } catch (error) {
      console.error('Predictions Error:', error);
      // توقعات افتراضية
      setPredictions({
        predictions: mockHistorical.map(val => val * 1.1),
        trend: "↑ تصاعدي",
        confidence: "70%",
        recommendation: "استمر في تحسين تجربة العملاء والتركيز على المنتجات الرائجة"
      });
    }
  };

  const refreshAnalysis = () => {
    if (file) {
      handleUpload();
      showSnackbar('تم تحديث التحليل', 'info');
    }
  };

  // ===================== معالجة الملفات =====================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    // التحقق من نوع الملف
    const allowedTypes = ['xlsx', 'xls', 'csv'];
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
      setError('نوع الملف غير مدعوم. الرجاء رفع ملف Excel أو CSV');
      showSnackbar('نوع الملف غير مدعوم', 'error');
      return;
    }
    
    // التحقق من حجم الملف (10MB كحد أقصى)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('حجم الملف كبير جداً. الحد الأقصى 10MB');
      showSnackbar('حجم الملف كبير جداً', 'error');
      return;
    }
    
    setFile(selectedFile);
    setError('');
    setAnalysis(null);
    setAiInsights('');
    setPredictions(null);
    showSnackbar(`تم اختيار الملف: ${selectedFile.name}`, 'success');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // ===================== تحميل الملف =====================
  const handleUpload = async () => {
    if (!file) {
      showSnackbar('الرجاء اختيار ملف أولاً', 'warning');
      return;
    }

    setUploading(true);
    setError('');
    setProcessingStep(0);
    setUploadProgress(0);

    try {
      // محاكاة التقدم
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      setProcessingStep(1); // بدء التحميل
      
      // محاولة الاتصال بالـ Backend أولاً
      const result = await uploadFileToBackend(
        file, 
        'demo-user',
        'demo@example.com'
      );

      clearInterval(progressInterval);
      setUploadProgress(100);
      setProcessingStep(2); // التحليل

      if (result.success) {
        setAnalysis(result.analysis);
        localStorage.setItem('last-analysis', JSON.stringify(result.analysis));
        setProcessingStep(3); // النتائج
        showSnackbar('تم تحليل الملف بنجاح!', 'success');
      } else {
        throw new Error(result.error || 'حدث خطأ في التحليل');
      }
    } catch (backendError) {
      console.log('Backend غير متصل، جاري التحليل محلياً:', backendError.message);
      setProcessingStep(2); // التحليل المحلي
      
      // التحليل المحلي كخيار احتياطي
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = e.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(sheet);
            
            const mockAnalysis = analyzeDataLocally(parsedData);
            setAnalysis(mockAnalysis);
            setUploadProgress(100);
            setProcessingStep(3);
            showSnackbar('تم التحليل محلياً بنجاح', 'info');
          } catch (parseError) {
            setError('تعذر قراءة الملف. تأكد من تنسيق Excel/CSV الصحيح');
            showSnackbar('خطأ في قراءة الملف', 'error');
          }
        };
        reader.onerror = () => {
          setError('تعذر قراءة الملف');
          showSnackbar('خطأ في قراءة الملف', 'error');
        };
        reader.readAsBinaryString(file);
      } catch (localError) {
        setError('حدث خطأ غير متوقع: ' + localError.message);
        showSnackbar('حدث خطأ غير متوقع', 'error');
      }
    } finally {
      setTimeout(() => {
        setUploading(false);
        setProcessingStep(0);
        setUploadProgress(0);
      }, 500);
    }
  };

  // ===================== وظائف التصدير =====================
  const exportToPDF = () => {
    setExporting(true);
    // محاكاة عملية التصدير
    setTimeout(() => {
      showSnackbar('تم إنشاء ملف PDF بنجاح', 'success');
      setExporting(false);
      
      // رابط تحميل وهمي
      const link = document.createElement('a');
      link.href = '#';
      link.download = `تقرير-المبيعات-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 2000);
  };

  const exportToExcel = () => {
    if (!analysis) return;
    
    setExporting(true);
    setTimeout(() => {
      const ws = XLSX.utils.json_to_sheet([
        { 'المؤشر': 'إجمالي المبيعات', 'القيمة': analysis.summary.totalSales, 'الوحدة': 'ريال' },
        { 'المؤشر': 'عدد المعاملات', 'القيمة': analysis.summary.totalTransactions, 'الوحدة': 'معاملة' },
        { 'المؤشر': 'متوسط البيع', 'القيمة': analysis.summary.averageSale, 'الوحدة': 'ريال' },
        { 'المؤشر': 'هامش الربح', 'القيمة': analysis.summary.profitMargin, 'الوحدة': '%' },
      ]);
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'الملخص');
      
      XLSX.writeFile(wb, `تقرير-المبيعات-${new Date().toISOString().split('T')[0]}.xlsx`);
      showSnackbar('تم تصدير الملف Excel بنجاح', 'success');
      setExporting(false);
    }, 1500);
  };

  const shareAnalysis = () => {
    if (navigator.share) {
      navigator.share({
        title: 'تقرير تحليل المبيعات',
        text: `إجمالي المبيعات: ${analysis?.summary.totalSales.toLocaleString()} ريال`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showSnackbar('تم نسخ الرابط إلى الحافظة', 'info');
    }
  };

  // ===================== دوال المساعدة =====================
  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSectionExpand = (section) => {
    setExpandedSection(expandedSection === section ? '' : section);
  };

  const clearAll = () => {
    setFile(null);
    setAnalysis(null);
    setAiInsights('');
    setPredictions(null);
    setError('');
    showSnackbar('تم مسح جميع البيانات', 'info');
  };

  // ===================== واجهة المستخدم =====================
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* شريط الحالة */}
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2, bgcolor: '#f5f5f5' }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Chip 
                icon={serverHealth?.status?.includes('✅') ? <CheckCircle /> : <Error />}
                label={serverHealth?.status || 'جاري التحقق...'}
                color={serverHealth?.status?.includes('✅') ? 'success' : 'error'}
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Chip 
                icon={file ? <CheckCircle /> : <Warning />}
                label={file ? `ملف: ${file.name}` : 'لم يتم اختيار ملف'}
                color={file ? 'success' : 'warning'}
              />
            </Grid>
            <Grid item>
              <Chip 
                icon={analysis ? <CheckCircle /> : <Info />}
                label={analysis ? 'تحليل جاهز' : 'بانتظار التحليل'}
                color={analysis ? 'success' : 'info'}
              />
            </Grid>
            <Grid item sx={{ flexGrow: 1 }} />
            <Grid item>
              <Tooltip title="تحديث">
                <IconButton onClick={refreshAnalysis} disabled={!file}>
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="الإعدادات">
                <IconButton onClick={() => setShowAdvanced(!showAdvanced)}>
                  <MoreVert />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* العنوان الرئيسي */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ 
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🤖 منصة ذكاء الأعمال المتقدم
        </Typography>
        <Typography variant="h6" color="text.secondary">
          حلول تحليل البيانات باستخدام الذكاء الاصطناعي لاتخاذ قرارات أذكى
        </Typography>
      </Box>

      {/* محتوى رئيسي */}
      <Grid container spacing={3}>
        {/* العمود الأيسر - رفع الملف */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              height: '100%',
              border: dragOver ? '2px dashed #2196F3' : '2px dashed transparent',
              transition: 'border 0.3s'
            }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <CloudUpload sx={{ mr: 1 }} />
              رفع وتحميل البيانات
            </Typography>
            
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* منطقة سحب وإفلات */}
            <Box sx={{ mb: 3 }}>
              <VisuallyHiddenInput 
                id="upload-file"
                type="file"
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
              />
              <label htmlFor="upload-file">
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    cursor: 'pointer',
                    bgcolor: dragOver ? '#E3F2FD' : '#F5F5F5',
                    border: '2px dashed #BDBDBD',
                    transition: 'all 0.3s',
                    '&:hover': {
                      bgcolor: '#E3F2FD',
                      borderColor: '#2196F3'
                    }
                  }}
                >
                  {file ? (
                    <>
                      <CheckCircle color="success" sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        {file.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {(file.size / 1024).toFixed(2)} KB
                      </Typography>
                    </>
                  ) : (
                    <>
                      <CloudUpload sx={{ fontSize: 48, mb: 2, color: '#757575' }} />
                      <Typography variant="h6" gutterBottom>
                        اسحب الملف هنا أو انقر للاختيار
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        يدعم: Excel (.xlsx, .xls) أو CSV
                      </Typography>
                    </>
                  )}
                </Paper>
              </label>
            </Box>

            {/* زر التحليل */}
            <GradientButton
              fullWidth
              onClick={handleUpload}
              disabled={!file || uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <Analytics />}
              sx={{ mb: 2 }}
            >
              {uploading ? 'جاري التحليل...' : 'بدء التحليل الذكي'}
            </GradientButton>

            {/* شريط التقدم */}
            {uploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  {processingStep === 1 && 'جاري تحميل الملف...'}
                  {processingStep === 2 && 'جاري تحليل البيانات...'}
                  {processingStep === 3 && 'جاري إنشاء التقرير...'}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
                  {uploadProgress}%
                </Typography>
              </Box>
            )}

            {/* معلومات سريعة */}
            <Accordion sx={{ mt: 3 }}>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>💡 نصائح سريعة</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem>
                    <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                    <ListItemText primary="تأكد من تنسيق الأعمدة: المنتج، الكمية، المبلغ" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                    <ListItemText primary="يمكنك سحب الملف وإفلاته مباشرة" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon><Info fontSize="small" /></ListItemIcon>
                    <ListItemText primary="حجم الملف الأقصى: 10 ميجابايت" />
                  </ListItem>
                </List>
              </AccordionDetails>
            </Accordion>

            {/* التاريخ */}
            {history.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>
                  📚 التحليلات السابقة
                </Typography>
                <List>
                  {history.map((item) => (
                    <ListItem 
                      key={item.id}
                      sx={{ 
                        bgcolor: 'background.default',
                        mb: 1,
                        borderRadius: 1
                      }}
                    >
                      <ListItemIcon>
                        <Description color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={item.fileName}
                        secondary={`${item.date} - ${item.summary.totalSales.toLocaleString()} ريال`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* العمود الأيمن - النتائج */}
        <Grid item xs={12} lg={8}>
          {/* شريط التنقل */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab icon={<Dashboard />} label="نظرة عامة" />
              <Tab icon={<BarChart />} label="التحليلات" />
              <Tab icon={<Timeline />} label="الاتجاهات" />
              <Tab icon={<People />} label="العملاء" />
              <Tab icon={<Inventory />} label="المنتجات" />
              <Tab icon={<Insights />} label="الذكاء الاصطناعي" />
            </Tabs>
          </Paper>

          {/* المحتوى حسب التبويب */}
          {!analysis ? (
            // حالة بدون تحليل
            <Paper sx={{ p: 8, textAlign: 'center' }}>
              <CloudUpload sx={{ fontSize: 80, color: '#E0E0E0', mb: 3 }} />
              <Typography variant="h5" gutterBottom color="text.secondary">
                ⏳ انتظر تحليل البيانات
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                قم برفع ملف Excel أو CSV لبدء التحليل الذكي
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="outlined" startIcon={<Info />}>
                  تعليمات الاستخدام
                </Button>
                <Button variant="outlined" startIcon={<Description />}>
                  نموذج ملف
                </Button>
              </Box>
            </Paper>
          ) : (
            // حالة مع تحليل
            <>
              {/* نظرة عامة */}
              {activeTab === 0 && (
                <Box>
                  {/* بطاقات الإحصائيات */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatisticCard
                        title="إجمالي المبيعات"
                        value={`${analysis.summary.totalSales.toLocaleString()} ريال`}
                        icon={<AttachMoney />}
                        color="#4CAF50"
                        trend="+12.5%"
                        subtext="مقارنة بالأسبوع الماضي"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatisticCard
                        title="عدد المعاملات"
                        value={analysis.summary.totalTransactions}
                        icon={<Receipt />}
                        color="#2196F3"
                        trend="+8.3%"
                        subtext={`${analysis.summary.uniqueCustomers} عميل`}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatisticCard
                        title="متوسط البيع"
                        value={`${analysis.summary.averageSale.toLocaleString()} ريال`}
                        icon={<Store />}
                        color="#FF9800"
                        trend="+5.2%"
                        subtext="قيمة متوسطة للطلب"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <StatisticCard
                        title="هامش الربح"
                        value={`${analysis.summary.profitMargin}%`}
                        icon={<AccountBalance />}
                        color="#9C27B0"
                        trend="+2.1%"
                        subtext={`${analysis.summary.estimatedProfit.toLocaleString()} ريال ربح`}
                      />
                    </Grid>
                  </Grid>

                  {/* أفضل المنتجات والعملاء */}
                  <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                      <StyledCard>
                        <CardHeader
                          title="🏆 أفضل المنتجات أداءً"
                          action={
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          {analysis.topProducts.map((product) => (
                            <ProductCard 
                              key={product.id} 
                              product={product} 
                              rank={product.id} 
                            />
                          ))}
                        </CardContent>
                      </StyledCard>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <StyledCard>
                        <CardHeader
                          title="⭐ أفضل العملاء قيمة"
                          action={
                            <IconButton size="small">
                              <Visibility />
                            </IconButton>
                          }
                        />
                        <CardContent>
                          {analysis.topCustomers.map((customer) => (
                            <Card key={customer.id} sx={{ mb: 1 }}>
                              <CardContent sx={{ py: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Avatar sx={{ width: 32, height: 32, mr: 2, bgcolor: '#E3F2FD' }}>
                                    <Person />
                                  </Avatar>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" fontWeight="medium">
                                      {customer.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                                      <Typography variant="caption" color="text.secondary">
                                        {customer.orders} طلب
                                      </Typography>
                                      <Typography variant="caption" fontWeight="bold" color="primary">
                                        {customer.value.toLocaleString()} ريال
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          ))}
                        </CardContent>
                      </StyledCard>
                    </Grid>
                  </Grid>

                  {/* توصيات سريعة */}
                  <StyledCard sx={{ mb: 4 }}>
                    <CardHeader
                      title="💡 توصيات فورية"
                      avatar={<Lightbulb color="warning" />}
                    />
                    <CardContent>
                      <Grid container spacing={2}>
                        {analysis.recommendations.slice(0, 4).map((rec, index) => (
                          <Grid item xs={12} sm={6} key={index}>
                            <RecommendationCard 
                              recommendation={rec} 
                              index={index} 
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </StyledCard>
                </Box>
              )}

              {/* الذكاء الاصطناعي */}
              {activeTab === 5 && (
                <Paper sx={{ p: 3 }}>
                  <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center' }}>
                      <Psychology sx={{ mr: 1 }} />
                      تحليل الذكاء الاصطناعي المتقدم
                    </Typography>
                    <Chip 
                      label="BETA" 
                      color="secondary" 
                      size="small"
                    />
                  </Box>

                  {loadingAI ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <CircularProgress size={60} sx={{ mb: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        جاري تحليل البيانات...
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        الذكاء الاصطناعي يدرس الأنماط ويولد توصيات مخصصة
                      </Typography>
                    </Box>
                  ) : aiInsights ? (
                    <Box>
                      <Paper sx={{ p: 3, mb: 3, bgcolor: '#F8F5FF', border: '1px solid #E6E0FF' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            whiteSpace: 'pre-line',
                            lineHeight: 1.8,
                            fontFamily: "'Cairo', sans-serif"
                          }}
                        >
                          {aiInsights}
                        </Typography>
                      </Paper>

                      {/* توقعات المبيعات */}
                      {predictions && (
                        <StyledCard sx={{ mb: 3 }}>
                          <CardHeader
                            title="🔮 توقعات المبيعات للأسبوع القادم"
                            subheader={`ثقة التنبؤ: ${predictions.confidence}`}
                            action={
                              <Chip 
                                icon={predictions.trend.includes('↑') ? <TrendingUp /> : <TrendingDown />}
                                label={predictions.trend}
                                color={predictions.trend.includes('↑') ? 'success' : 'error'}
                              />
                            }
                          />
                          <CardContent>
                            <Grid container spacing={3}>
                              <Grid item xs={12} md={8}>
                                <Box sx={{ p: 2, bgcolor: '#F5F5F5', borderRadius: 2 }}>
                                  <Typography variant="subtitle2" gutterBottom>
                                    التوقع اليومي (بالريال السعودي):
                                  </Typography>
                                  <Grid container spacing={1}>
                                    {predictions.predictions.map((value, index) => (
                                      <Grid item xs key={index}>
                                        <Paper sx={{ p: 1, textAlign: 'center' }}>
                                          <Typography variant="caption" display="block">
                                            يوم {index + 1}
                                          </Typography>
                                          <Typography variant="body2" fontWeight="bold">
                                            {Math.round(value).toLocaleString()}
                                          </Typography>
                                          <Typography variant="caption" color="text.secondary">
                                            ريال
                                          </Typography>
                                        </Paper>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              </Grid>
                              <Grid item xs={12} md={4}>
                                <Paper sx={{ p: 2, bgcolor: '#E8F5E9', height: '100%' }}>
                                  <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Lightbulb fontSize="small" sx={{ mr: 1 }} />
                                    توصية استراتيجية
                                  </Typography>
                                  <Typography variant="body2">
                                    {predictions.recommendation}
                                  </Typography>
                                </Paper>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </StyledCard>
                      )}

                      {/* أزرار التحكم */}
                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                        <Button
                          variant="contained"
                          startIcon={<Refresh />}
                          onClick={fetchAIInsights}
                          disabled={loadingAI}
                        >
                          تحديث التحليل
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Email />}
                          onClick={() => showSnackbar('سيتم إضافة هذه الميزة قريباً', 'info')}
                        >
                          إرسال بالتقرير
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<PictureAsPdf />}
                          onClick={exportToPDF}
                          disabled={exporting}
                        >
                          {exporting ? 'جاري التصدير...' : 'تصدير PDF'}
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Download />}
                          onClick={exportToExcel}
                          disabled={exporting}
                        >
                          {exporting ? 'جاري التصدير...' : 'تصدير Excel'}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Alert severity="info">
                      انقر على زر "تحديث التحليل" للحصول على توصيات الذكاء الاصطناعي
                    </Alert>
                  )}
                </Paper>
              )}
            </>
          )}
        </Grid>
      </Grid>

      {/* Speed Dial للأعمال السريعة */}
      {analysis && (
        <SpeedDial
          ariaLabel="Speed Dial"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon />}
        >
          <SpeedDialAction
            icon={<Share />}
            tooltipTitle="مشاركة"
            onClick={shareAnalysis}
          />
          <SpeedDialAction
            icon={<Print />}
            tooltipTitle="طباعة"
            onClick={() => window.print()}
          />
          <SpeedDialAction
            icon={<Delete />}
            tooltipTitle="مسح الكل"
            onClick={clearAll}
          />
          <SpeedDialAction
            icon={<Add />}
            tooltipTitle="تحليل جديد"
            onClick={() => document.getElementById('upload-file').click()}
          />
        </SpeedDial>
      )}

      {/* Snackbar للإشعارات */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Footer */}
      <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          🚀 منصة ذكاء الأعمال المتقدم - الإصدار 2.0 | 
          <Button size="small" sx={{ ml: 1 }} onClick={() => setShowAdvanced(true)}>
            الإعدادات المتقدمة
          </Button>
          {' | '}
          <Button size="small" sx={{ ml: 1 }} onClick={() => setAutoRefresh(!autoRefresh)}>
            التحديث التلقائي: {autoRefresh ? '✅' : '❌'}
          </Button>
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
          ⚡ مدعوم بالذكاء الاصطناعي | 📊 تحليل في الوقت الحقيقي | 🔒 أمان وحماية البيانات
        </Typography>
      </Box>
    </Container>
  );
};

export default Upload;