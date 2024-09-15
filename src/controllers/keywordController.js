const keywordService = require('../services/keywordService');

exports.getKeywordsPropositions = async (req, res) => {
  console.log('Rozpoczęcie analizy słów kluczowych');
  try {
    const { keywords } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ message: 'Proszę podać tablicę słów kluczowych.' });
    }

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const data = await keywordService.getKeywordsPropositions(
            keyword,
            token
          );
          return data.data.map((item) => ({
            keyword: item.keyword,
            searches: item.searches,
            cpc: item.cpc,
            variations: item.variations || [],
          }));
        } catch (error) {
          console.error(
            `Błąd przetwarzania słowa kluczowego "${keyword}":`,
            error.response?.data || error.message
          );
          if (error.response?.status === 404) {
            return [
              {
                keyword,
                error: 'Nie znaleziono danych dla tego słowa kluczowego',
              },
            ];
          } else if (error.response?.status === 401) {
            return [{ keyword, error: 'Brak autoryzacji do pobrania danych' }];
          }
          return [
            {
              keyword,
              error: 'Nie udało się pobrać danych dla tego słowa kluczowego',
            },
          ];
        }
      })
    );

    const flatResults = results.flat();

    res.json(flatResults);
  } catch (error) {
    console.error('Błąd w analyzeKeywords:', error);
    console.error('Szczegóły błędu:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy słów kluczowych.',
      details: error.response?.data || error.message,
    });
  }
};

exports.getMultipleKeywordsPropositions = async (req, res) => {
  console.log('Rozpoczęcie analizy wielu słów kluczowych');
  try {
    const { keywords } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ message: 'Proszę podać tablicę słów kluczowych.' });
    }

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const data = await keywordService.getKeywordsPropositions(
            keyword,
            token
          );
          return {
            mainKeyword: keyword,
            results: data.data.map((item) => ({
              keyword: item.keyword,
              searches: item.searches,
              cpc: item.cpc,
              variations: item.variations || [],
            })),
          };
        } catch (error) {
          console.error(
            `Błąd przetwarzania słowa kluczowego "${keyword}":`,
            error.response?.data || error.message
          );
          return {
            mainKeyword: keyword,
            error:
              error.response?.status === 404
                ? 'Nie znaleziono danych dla tego słowa kluczowego'
                : error.response?.status === 401
                ? 'Brak autoryzacji do pobrania danych'
                : 'Nie udało się pobrać danych dla tego słowa kluczowego',
          };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w getMultipleKeywordsPropositions:', error);
    res.status(500).json({
      message: 'Wystąpił błąd podczas analizy wielu słów kluczowych.',
      details: error.response?.data || error.message,
    });
  }
};

exports.getRelatedKeywords = async (req, res) => {
  console.log('Rozpoczęcie pobierania powiązanych słów kluczowych');
  try {
    const { keywords } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ message: 'Proszę podać tablicę słów kluczowych.' });
    }

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const data = await keywordService.getRelatedKeywords(keyword, token);

          const resultsData = data.data.map((item) => ({
            keyword: item.keyword,
            searches: item.searches,
            cpc: item.cpc,
          }));

          return resultsData;
        } catch (error) {
          console.error(
            `Błąd przetwarzania słowa kluczowego "${keyword}":`,
            error.response?.data || error.message
          );
          if (error.response?.status === 404) {
            return {
              mainKeyword: keyword,
              error: 'Nie znaleziono danych dla tego słowa kluczowego',
            };
          } else if (error.response?.status === 401) {
            return {
              mainKeyword: keyword,
              error: 'Brak autoryzacji do pobrania danych',
            };
          }
          return {
            mainKeyword: keyword,
            error: 'Nie udało się pobrać danych dla tego słowa kluczowego',
          };
        }
      })
    );

    const flatResults = results.flat();

    res.json(flatResults);
  } catch (error) {
    console.error('Błąd w getRelatedKeywords:', error);
    console.error('Szczegóły błędu:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Wystąpił błąd podczas pobierania powiązanych słów kluczowych.',
      details: error.response?.data || error.message,
    });
  }
};

exports.getMultipleRelatedKeywords = async (req, res) => {
  console.log(
    'Rozpoczęcie pobierania powiązanych słów kluczowych dla wielu fraz'
  );
  try {
    const { keywords } = req.body;
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
      return res
        .status(400)
        .json({ message: 'Proszę podać tablicę słów kluczowych.' });
    }

    if (!token || token.split('.').length !== 3) {
      return res
        .status(401)
        .json({ message: 'Brak autoryzacji lub nieprawidłowy format tokena' });
    }

    const results = await Promise.all(
      keywords.map(async (keyword) => {
        try {
          const data = await keywordService.getRelatedKeywords(keyword, token);
          return {
            mainKeyword: keyword,
            results: data.data.map((item) => ({
              keyword: item.keyword,
              searches: item.searches,
              cpc: item.cpc,
            })),
          };
        } catch (error) {
          console.error(
            `Błąd przetwarzania słowa kluczowego "${keyword}":`,
            error.response?.data || error.message
          );
          return {
            mainKeyword: keyword,
            error:
              error.response?.status === 404
                ? 'Nie znaleziono danych dla tego słowa kluczowego'
                : error.response?.status === 401
                ? 'Brak autoryzacji do pobrania danych'
                : 'Nie udało się pobrać danych dla tego słowa kluczowego',
          };
        }
      })
    );

    res.json(results);
  } catch (error) {
    console.error('Błąd w getMultipleRelatedKeywords:', error);
    res.status(500).json({
      message:
        'Wystąpił błąd podczas pobierania powiązanych słów kluczowych dla wielu fraz.',
      details: error.response?.data || error.message,
    });
  }
};
