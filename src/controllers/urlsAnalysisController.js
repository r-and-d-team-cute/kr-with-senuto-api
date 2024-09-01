const urlAnalysisService = require('../services/urlAnalysisService');

exports.analyzeUrls = async (req, res) => {
  try {
    const { urls } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę adresów URL w body zapytania.',
      });
    }

    const results = await urlAnalysisService.getKeywordsForUrls(urls, token);

    res.json(results);
  } catch (error) {
    console.error('Błąd w analyzeUrls:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy adresów URL.',
      details: error.message,
    });
  }
};
