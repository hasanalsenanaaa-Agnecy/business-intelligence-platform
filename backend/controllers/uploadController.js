exports.uploadAndAnalyze = async (req, res) => {
  res.json({ success: true, message: 'Analysis complete' });
};
exports.getUserAnalyses = async (req, res) => {
  res.json({ success: true, analyses: [] });
};
