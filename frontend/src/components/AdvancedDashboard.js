// frontend/src/components/AdvancedDashboard.js
import React, { useState, useEffect } from 'react';
import {
  LineChart, BarChart, PieChart,
  Line, Bar, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AdvancedDashboard = ({ analysis }) => {
  const [realTimeData, setRealTimeData] = useState([]);
  const [predictions, setPredictions] = useState(null);
  const [aiInsights, setAiInsights] = useState('');
  
  // تحديث بيانات في الوقت الحقيقي
  useEffect(() => {
    const ws = new WebSocket(`wss://your-backend.com/realtime`);
    ws.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setRealTimeData(prev => [...prev.slice(-19), newData]); // حفظ آخر 20 نقطة
    };
    
    // جلب التنبؤات
    fetchPredictions();
    // جلب توصيات الذكاء الاصطناعي
    fetchAIInsights();
  }, []);
  
  const fetchPredictions = async () => {
    const response = await fetch('/api/forecast', {
      method: 'POST',
      body: JSON.stringify(analysis.historicalData)
    });
    setPredictions(await response.json());
  };
  
  const fetchAIInsights = async () => {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      body: JSON.stringify(analysis)
    });
    setAiInsights(await response.json());
  };
  
  return (
    <div className="advanced-dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* مخطط المبيعات الزمني */}
        <div className="col-span-2 bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">📈 تتبع المبيعات في الوقت الحقيقي</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={realTimeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              <Line type="monotone" dataKey="target" stroke="#82ca9d" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* تنبؤات الأسبوع القادم */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">🔮 تنبؤات الأسبوع القادم</h3>
          {predictions && (
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {predictions.trend}
              </div>
              <div className="mt-4">
                {predictions.nextWeek.map((day, idx) => (
                  <div key={idx} className="flex justify-between mb-2">
                    <span>يوم {idx + 1}:</span>
                    <span className="font-bold">{day.toLocaleString()} ريال</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* تحليل المشاعر */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">😊 تحليل مشاعر العملاء</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { name: 'إيجابي', value: 65, color: '#10B981' },
                  { name: 'محايد', value: 20, color: '#FBBF24' },
                  { name: 'سلبي', value: 15, color: '#EF4444' }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* توصيات الذكاء الاصطناعي */}
        <div className="col-span-2 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-bold mb-4">🤖 توصيات الذكاء الاصطناعي</h3>
          <div className="bg-white p-4 rounded-lg">
            <div className="whitespace-pre-line text-gray-700">
              {aiInsights || "جاري تحميل التوصيات الذكية..."}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              💾 حفظ التقرير
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              📧 إرسال بالبريد
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              📊 توليد خطة عمل
            </button>
          </div>
        </div>
      </div>
      
      {/* تحليل المنافسة */}
      <div className="mt-8 bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-bold mb-4">⚔️ تحليل المنافسة</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CompetitorCard name="المنافس أ" marketShare="35%" growth="+12%" />
          <CompetitorCard name="المنافس ب" marketShare="28%" growth="+8%" />
          <CompetitorCard name="أنت" marketShare="22%" growth="+15%" primary />
        </div>
      </div>
    </div>
  );
};