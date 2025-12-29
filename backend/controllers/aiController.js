// backend/controllers/aiController.js
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.generateAIRecommendations = async (analysisData) => {
  const prompt = `
    كـ خبير أعمال سعودي، قم بتحليل بيانات المبيعات التالية:
    
    إجمالي المبيعات: ${analysisData.summary.totalSales} ريال
    عدد المعاملات: ${analysisData.summary.totalTransactions}
    عدد العملاء: ${analysisData.summary.uniqueCustomers}
    متوسط البيع: ${analysisData.summary.averageSale} ريال
    
    أفضل 3 منتجات:
    ${analysisData.topProducts.map(p => `- ${p.name}: ${p.value} ريال (${p.percentage}%)`).join('\n')}
    
    أفضل 3 عملاء:
    ${analysisData.topCustomers.map(c => `- ${c.name}: ${c.value} ريال`).join('\n')}
    
    قدم:
    1. 3 توصيات استراتيجية لزيادة المبيعات
    2. 2 تحذير عن مخاطر محتملة
    3. خطة عمل شهرية مقترحة
    4. نصائح مخصصة للسوق السعودي
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.choices[0].message.content;
  } catch (error) {
    return "توصيات افتراضية: ركز على المنتجات الأكثر مبيعاً، وحسّن تجربة العملاء، ووسّع قاعدة عملائك.";
  }
};