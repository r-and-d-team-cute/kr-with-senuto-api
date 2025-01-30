const searchService = require('../services/searchService');

exports.getTop3Results = async (req, res) => {
  try {
    const { keywords } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę słów kluczowych w body zapytania.',
      });
    }

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    const allResults = await Promise.all(
      keywords.map(async (keyword) => {
        const result = await searchService.getTop3Results(keyword, token);
        return result.urls; // Bierzemy tylko tablicę URLi
      })
    );

    // Spłaszczamy tablicę wyników i usuwamy duplikaty
    const uniqueUrls = [...new Set(allResults.flat())];

    console.log(uniqueUrls);

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
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res.status(400).json({
        message: 'Proszę podać tablicę słów kluczowych w body zapytania.',
      });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const response = await searchService.getTop3Results(keyword, token);
          const results = {
            mainKeyword: response.keyword,
            urls: response.urls,
          };

          return results;
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
