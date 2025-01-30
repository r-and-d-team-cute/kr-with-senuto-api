const axios = require('axios');
const FormData = require('form-data');

const SENUTO_CREATE_SERP_URL =
  'https://api.senuto.com/api/tasks/management/serp_analysis/create';
const SENUTO_GET_SERP_RESULTS_URL =
  'https://api.senuto.com/api/serp_analysis/reports/urls/getList';

/**
 * Pobiera ID taska dla analizy SERP dla danego słowa kluczowego
 */
async function createSerpAnalysis(keyword, token) {
  const formData = new FormData();
  formData.append('country_id', '1');
  formData.append('keyword', keyword);

  const requestConfig = {
    method: 'post',
    url: SENUTO_CREATE_SERP_URL,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  const response = await axios(requestConfig);

  if (!response.data.success) {
    throw new Error('Nie udało się utworzyć analizy SERP');
  }

  return {
    taskId: response.data.data.id,
    keyword: response.data.data.data.keyword,
  };
}

/**
 * Pobiera wyniki SERP dla danego taska i słowa kluczowego
 */
async function getSerpResults(taskId, keyword, token) {
  const formData = new FormData();
  formData.append('country_id', '200');
  formData.append('keyword', keyword);
  formData.append('task_id', taskId);
  formData.append('limit', '10');

  const requestConfig = {
    method: 'post',
    url: SENUTO_GET_SERP_RESULTS_URL,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  const response = await axios(requestConfig);

  if (!response.data.success) {
    throw new Error('Nie udało się pobrać wyników SERP');
  }

  // Wyciągamy tylko URL-e z pierwszych 3 wyników
  const top3Urls = response.data.data.rows.slice(0, 3).map((row) => row.url);

  return {
    keyword,
    urls: top3Urls,
  };
}

/**
 * Opóźnienie wykonania
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Główna funkcja pobierająca TOP 3 wyniki dla słowa kluczowego
 */
async function getTop3Results(keyword, token) {
  try {
    // Tworzymy nową analizę SERP
    const { taskId, keyword: confirmedKeyword } = await createSerpAnalysis(
      keyword,
      token
    );

    // Czekamy 3 sekundy przed pobraniem wyników
    await delay(3000);

    // Pobieramy wyniki SERP
    const results = await getSerpResults(taskId, confirmedKeyword, token);

    return results;
  } catch (error) {
    console.error('Błąd w getTop3Results:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Brak autoryzacji lub nieprawidłowy token');
        case 429:
          throw new Error('Przekroczono limit zapytań do API');
        default:
          throw new Error(`Błąd serwera: ${error.response.status}`);
      }
    }

    throw new Error(
      `Błąd podczas pobierania TOP 3 wyników dla "${keyword}": ${error.message}`
    );
  }
}

/**
 * Funkcja do pobierania wyników dla wielu słów kluczowych
 */
async function getMultipleTop3Results(keywords, token) {
  const results = [];

  for (const keyword of keywords) {
    try {
      const result = await getTop3Results(keyword, token);
      results.push(result);

      // Opóźnienie 3 sekundy przed kolejnym słowem
      await delay(3000);
    } catch (error) {
      console.error(`Błąd dla słowa "${keyword}":`, error);
      results.push({
        keyword,
        error: error.message,
        urls: [],
      });
    }
  }

  console.log(results);

  return results;
}

module.exports = {
  getTop3Results,
  getMultipleTop3Results,
};
