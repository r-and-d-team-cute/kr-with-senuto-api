const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');

const cache = new NodeCache({ stdTTL: 3600 }); // Cache na 1 godzinę
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getTop3Results = async (keyword) => {
  const cacheKey = `top3_${keyword}`;
  const cachedResults = cache.get(cacheKey);

  if (cachedResults) {
    return cachedResults;
  }

  try {
    await delay(1000); // Opóźnienie 1 sekundy przed każdym zapytaniem

    const response = await axios.get(
      `https://www.google.com/search?q=${encodeURIComponent(
        keyword
      )}&hl=pl&gl=pl`,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      }
    );

    const $ = cheerio.load(response.data);

    const results = [];
    $('.g .yuRUbf a')
      .slice(0, 3)
      .each((i, elem) => {
        results.push($(elem).attr('href'));
      });

    cache.set(cacheKey, results);
    return results;
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error(
        'Przekroczono limit zapytań podczas pobierania wyników wyszukiwania'
      );
      throw new Error(
        'Przekroczono limit zapytań. Proszę spróbować ponownie później.'
      );
    }
    console.error('Błąd w getTop3Results:', error);
    throw error;
  }
};
