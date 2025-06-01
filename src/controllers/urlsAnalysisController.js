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

exports.analyzeUrlTop15 = async (req, res) => {
  try {
    const { url } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!url) {
      return res.status(400).json({
        message: 'Proszę podać adres URL w body zapytania.',
      });
    }

    const results = await urlAnalysisService.getTop15KeywordsForSingleUrl(
      url,
      token
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w analyzeUrls:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy adresów URL.',
      details: error.message,
    });
  }
};

exports.getUrlTop15 = async (req, res) => {
  try {
    const { url } = req.query;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'Nie podano adresu URL do analizy',
      });
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Brak tokenu autoryzacyjnego',
      });
    }

    const results = await urlAnalysisService.getTop15KeywordsForSingleUrl(
      url,
      token
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w kontrolerze getUrlTop15:', error);

    // Jeśli to błąd walidacji domeny, zwracamy 400
    if (error.message.includes('format')) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    const statusCode = error.response?.status || 500;

    res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

exports.analyzeUrlsByParams = async (req, res) => {
  try {
    const { urls } = req.query;

    console.log(urls);
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!urls || urls.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać listę adresów URL w query zapytania.',
      });
    }

    const results = await urlAnalysisService.getKeywordsForUrls(urls, token);

    res.json(results);
  } catch (error) {
    console.error('Błąd w analyzeUrlsByParams:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy adresów URL.',
      details: error.message,
    });
  }
};
