const axios = require('axios');
// const FormData = require('form-data');

const SENUTO_API_URL_GET_KEYWORDS_FOR_URL =
  'https://api.senuto.com/api/visibility_analysis/reports/positions/getData';

// Funkcja opóźniająca
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.getKeywordsForUrls = async (urls, token) => {
  const results = [];

  // Upewnij się, że urls jest tablicą
  const urlsArray = Array.isArray(urls) ? urls : [urls];

  for (const url of urlsArray) {
    console.log('------------------------------------url in for loop', url);

    try {
      const keywordsData = await this.getKeywordsForSingleUrl(url, token);
      results.push({ url, keywords: keywordsData });
    } catch (error) {
      console.error(
        `Błąd podczas pobierania słów kluczowych dla ${url}:`,
        error
      );
      results.push({ url, error: 'Nie udało się pobrać słów kluczowych' });
    }
    // Dodaj opóźnienie 1 sekundy między zapytaniami
    await delay(1000);
  }

  return results;
};

exports.getKeywordsForSingleUrl = async (url, token) => {
  console.log(`Rozpoczynanie żądania dla URL: "${url}"`);

  const payload = {
    domain: url,
    fetch_mode: 'url',
    country_id: '200',
    filtering: [
      {
        filters: [
          {
            value: '10',
            match: 'lte',
            key: 'statistics.position.current',
            type: 'number',
          },
        ],
      },
    ],
  };

  const requestConfig = {
    method: 'post',
    url: SENUTO_API_URL_GET_KEYWORDS_FOR_URL,
    headers: {
      //   ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  try {
    const response = await axios(requestConfig);

    return response.data.data.map((item) => ({
      keyword: item.keyword,
      searches: item.statistics.searches.current,
      cpc: item.statistics.cpc.current,
      position: item.statistics.position.current,
    }));
  } catch (error) {
    console.error(`Błąd w getKeywordsForSingleUrl dla URL "${url}":`);

    if (error.response) {
      console.error(
        'Serwer odpowiedział błędem. Kod statusu:',
        error.response.status
      );
      console.error('Nagłówki odpowiedzi:', error.response.headers);
      console.error('Dane błędu:', error.response.data);
    } else if (error.request) {
      console.error(
        'Nie otrzymano odpowiedzi od serwera. Szczegóły żądania:',
        error.request
      );
    } else {
      console.error(
        'Wystąpił błąd podczas konfiguracji lub wysyłania żądania:',
        error.message
      );
    }
    console.error('Pełny obiekt błędu:', error);

    throw new Error(
      `Nie udało się pobrać słów kluczowych dla URL "${url}": ${error.message}`
    );
  }
};

exports.getTop15KeywordsForSingleUrl = async (url, token) => {
  console.log(`Rozpoczynanie żądania dla URL: "${url}"`);

  const payload = {
    domain: url,
    fetch_mode: 'url',
    country_id: '200',
    filtering: [
      {
        filters: [
          {
            value: '15',
            match: 'lte',
            key: 'statistics.position.current',
            type: 'number',
          },
        ],
      },
    ],
  };

  const requestConfig = {
    method: 'post',
    url: SENUTO_API_URL_GET_KEYWORDS_FOR_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  };

  try {
    const response = await axios(requestConfig);

    return response.data.data
      .map((item) => ({
        keyword: item.keyword,
        position: item.statistics.position.current,
        searches: item.statistics.searches.current,
        cpc: item.statistics.cpc.current,
      }))
      .sort((a, b) => b.searches - a.searches); // Sortowanie od największej do najmniejszej wartości searches
  } catch (error) {
    console.error(`Błąd w getKeywordsForSingleUrl dla URL "${url}":`);

    if (error.response) {
      console.error(
        'Serwer odpowiedział błędem. Kod statusu:',
        error.response.status
      );
      console.error('Nagłówki odpowiedzi:', error.response.headers);
      console.error('Dane błędu:', error.response.data);
    } else if (error.request) {
      console.error(
        'Nie otrzymano odpowiedzi od serwera. Szczegóły żądania:',
        error.request
      );
    } else {
      console.error(
        'Wystąpił błąd podczas konfiguracji lub wysyłania żądania:',
        error.message
      );
    }
    console.error('Pełny obiekt błędu:', error);

    throw new Error(
      `Nie udało się pobrać słów kluczowych dla URL "${url}": ${error.message}`
    );
  }
};
