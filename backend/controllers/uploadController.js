const xlsx = require('xlsx');
const Analysis = require('../models/Analysis');
const fs = require('fs');
const path = require('path');

// دالة تحليل البيانات
const analyzeData = (data) => {
  if (!data || data.length === 0) {
    return null;
  }

  let totalSales = 0;
  let totalQuantity = 0;
  let customers = new Set();
  const productSales = {};
  const customerPurchases = {};

  data.forEach((row) => {
    // البحث عن أعمدة المبيعات بأسماء مختلفة
    const amount = 
      parseFloat(row.المبلغ || row.amount || row.sales || row.Sales || 
                row.مبلغ || row.قيمة || row.total || row.Total || 0) || 0;
    
    const quantity = 
      parseInt(row.الكمية || row.quantity || row.Quantity || 
              row.عدد || row.qty || row.Qty || 1) || 1;
    
    const product = 
      row.المنتج || row.product || row.Product || 
      row.خدمة || row.service || row.item || 'غير معروف';
    
    const customer = 
      row.العميل || row.customer || row.Customer || 
      row.زبون || row.client || row.name || 'غير معروف';

    totalSales += amount;
    totalQuantity += quantity;
    customers.add(customer);

    // إحصائيات المنتجات
    productSales[product] = (productSales[product] || 0) + amount;

    // إحصائيات العملاء
    customerPurchases[customer] = (customerPurchases[customer] || 0) + amount;
  });

  // إيجاد أفضل المنتجات
  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalSales) * 100)
    }));

  // إيجاد أفضل العملاء
  const topCustomers = Object.entries(customerPurchases)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({
      name,
      value,
      percentage: Math.round((value / totalSales) * 100)
    }));

  // تحليل هامش الربح (افتراضي)
  const profitMargin = 0.25; // 25% كمثال
  const estimatedCost = totalSales * (1 - profitMargin);
  const estimatedProfit = totalSales - estimatedCost;

  // توصيات ذكية
  const recommendations = [];

  if (topProducts.length > 0) {
    const topProduct = topProducts[0];
    recommendations.push(`ركز على "${topProduct.name}" - يمثل ${topProduct.percentage}% من مبيعاتك`);
  }

  if (topCustomers.length > 0) {
    const topCustomer = topCustomers[0];
    recommendations.push(`العميل "${topCustomer.name}" هو الأكثر قيمة - اشترى ${topCustomer.value.toLocaleString()} ريال`);
  }

  if (totalSales / data.length < 1000) {
    recommendations.push('متوسط البيع منخفض - فكر في رفع سعر الوحدة أو بيع منتجات مجمعة');
  }

  if (customers.size < 10 && data.length > 50) {
    recommendations.push('لديك عملاء قليلون لكن مخلصين - اعمل على برنامج ولاء للاحتفاظ بهم');
  }

  return {
    summary: {
      totalSales: Math.round(totalSales),
      totalTransactions: data.length,
      totalQuantity,
      uniqueCustomers: customers.size,
      averageSale: Math.round(totalSales / data.length),
      averageQuantity: Math.round(totalQuantity / data.length),
      estimatedProfit: Math.round(estimatedProfit),
      profitMargin: Math.round(profitMargin * 100),
    },
    topProducts,
    topCustomers,
    recommendations,
    sampleData: data.slice(0, 10), // عينة من البيانات لعرضها
  };
};

// تحميل وتحليل الملف
exports.uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'لم يتم رفع أي ملف'
      });
    }

    const startTime = Date.now();
    const { originalname, size, mimetype, buffer } = req.file;
    
    // معلومات المستخدم من الـ request
    const { userId = 'demo-user', email = 'demo@example.com' } = req.body;

    let parsedData = [];
    const fileExtension = originalname.split('.').pop().toLowerCase();

    // قراءة الملف بناءً على نوعه
    if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      const workbook = xlsx.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      parsedData = xlsx.utils.sheet_to_json(sheet);
    } else if (fileExtension === 'csv') {
      const csvString = buffer.toString('utf8');
      const lines = csvString.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(',').map(v => v.trim());
          const row = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          parsedData.push(row);
        }
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'نوع الملف غير مدعوم. الرجاء استخدام Excel أو CSV'
      });
    }

    if (parsedData.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'الملف فارغ أو التنسيق غير صحيح'
      });
    }

    // تحليل البيانات
    const analysisResult = analyzeData(parsedData);

    if (!analysisResult) {
      return res.status(400).json({
        success: false,
        error: 'تعذر تحليل البيانات'
      });
    }

    // حفظ التحليل في قاعدة البيانات
    const analysisRecord = new Analysis({
      userId,
      email,
      fileName: originalname,
      fileSize: size,
      fileType: fileExtension,
      analysis: analysisResult,
      sampleData: analysisResult.sampleData,
      status: 'completed',
      processingTime: Date.now() - startTime,
      recordCount: parsedData.length
    });

    await analysisRecord.save();

    // إرسال النتائج
    res.json({
      success: true,
      message: 'تم تحليل الملف بنجاح',
      metadata: {
        fileName: originalname,
        fileSize: size,
        recordCount: parsedData.length,
        processingTime: Date.now() - startTime,
        savedToDatabase: true
      },
      analysis: analysisResult
    });

  } catch (error) {
    console.error('خطأ في تحليل الملف:', error);
    res.status(500).json({
      success: false,
      error: 'حدث خطأ أثناء تحليل الملف',
      details: error.message
    });
  }
};

// جلب تاريخ التحليلات للمستخدم
exports.getUserAnalyses = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const analyses = await Analysis.find({ userId })
      .sort({ uploadedAt: -1 })
      .select('fileName uploadedAt analysis.summary analysis.recommendations')
      .limit(20);

    res.json({
      success: true,
      count: analyses.length,
      analyses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'حدث خطأ في جلب التحليلات'
    });
  }
};