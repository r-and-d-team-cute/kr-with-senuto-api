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

exports.analyzeMultipleUrls = async (req, res) => {
  try {
    const { urlGroups } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!urlGroups || !Array.isArray(urlGroups) || urlGroups.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę grup URL w body zapytania.',
      });
    }

    const results = await Promise.all(
      urlGroups.map(async (group) => {
        try {
          const urlResults = await urlAnalysisService.getKeywordsForUrls(
            group.urls,
            token
          );
          return {
            mainKeyword: group.mainKeyword,
            results: urlResults,
          };
        } catch (error) {
          console.error(
            `Błąd analizy URL dla grupy "${group.mainKeyword}":`,
            error
          );
          return {
            mainKeyword: group.mainKeyword,
            error: 'Nie udało się przeanalizować URL-i dla tej grupy',
          };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w analyzeMultipleUrls:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy wielu grup URL.',
      details: error.message,
    });
  }
};
