const searchService = require('../services/searchService');

exports.getTop3Results = async (req, res) => {
  try {
    const { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę słów kluczowych w body zapytania.',
      });
    }

    const allResults = await Promise.all(
      keywords.map(async (keyword) => {
        return await searchService.getTop3Results(keyword);
      })
    );

    // Spłaszczamy tablicę wyników i usuwamy duplikaty
    const uniqueUrls = [...new Set(allResults.flat())];

    res.json(uniqueUrls);
  } catch (error) {
    console.error('Błąd w getTop3Results:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas pobierania top 3 wyników.',
      details: error.message,
    });
  }
};

exports.getMultipleTop3Results = async (req, res) => {
  try {
    const { keywords } = req.body;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę słów kluczowych w body zapytania.',
      });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const urls = await searchService.getTop3Results(keyword);
          return {
            mainKeyword: keyword,
            urls: urls,
          };
        } catch (error) {
          console.error(
            `Błąd przetwarzania słowa kluczowego "${keyword}":`,
            error
          );
          return {
            mainKeyword: keyword,
            error: 'Nie udało się pobrać TOP 3 wyników',
          };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w getMultipleTop3Results:', error);
    res.status(500).json({
      message:
        'Wystąpił błąd podczas pobierania top 3 wyników dla wielu słów kluczowych.',
      details: error.message,
    });
  }
};
