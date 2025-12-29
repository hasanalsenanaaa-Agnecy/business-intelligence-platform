// backend/controllers/sentimentController.js
const natural = require('natural');
const arabicStopwords = require('arabic-stopwords');

exports.analyzeCustomerFeedback = (reviews) => {
  const analyzer = new natural.SentimentAnalyzer('Arabic', natural.PorterStemmerAr, 'afinn');
  
  const sentiments = reviews.map(review => {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(review.text)
      .filter(word => !arabicStopwords.includes(word));
    
    const score = analyzer.getSentiment(tokens);
    
    return {
      text: review.text,
      score: score,
      sentiment: score > 0 ? 'إيجابي' : score < 0 ? 'سلبي' : 'محايد',
      suggestions: this.generateSuggestions(score, review.text)
    };
  });
  
  return {
    overallSentiment: this.calculateOverall(sentiments),
    positiveCount: sentiments.filter(s => s.sentiment === 'إيجابي').length,
    negativeCount: sentiments.filter(s => s.sentiment === 'سلبي').length,
    topComplaints: sentiments.filter(s => s.sentiment === 'سلبي').slice(0, 5),
    topPraises: sentiments.filter(s => s.sentiment === 'إيجابي').slice(0, 5)
  };
};