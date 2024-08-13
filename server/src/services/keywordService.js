const axios = require('axios');
const FormData = require('form-data');

const SENUTO_API_URL_GET_KEYWORDS_PROPOSITIONS =
  'https://api.senuto.com/api/keywords_analysis/reports/keyword_details/getKeywordsPropositions';
const SENUTO_API_URL_GET_RELATED_KEYWORDS =
  'https://api.senuto.com/api/keywords_analysis/reports/keyword_details/getRelatedKeywords';

exports.getKeywordsPropositions = async (keyword, token) => {
  console.log(`Rozpoczynanie żądania dla słowa kluczowego: "${keyword}"`);

  const formData = new FormData();
  formData.append('country_id', '1');
  formData.append('keyword', keyword);
  formData.append('limit', '50');

  const requestConfig = {
    method: 'post',
    url: SENUTO_API_URL_GET_KEYWORDS_PROPOSITIONS,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  try {
    console.log('Wysyłanie żądania do API Senuto...');

    const response = await axios(requestConfig);

    return response.data;
  } catch (error) {
    console.error(
      `Błąd w getKeywordsPropositions dla słowa kluczowego "${keyword}":`
    );

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
      `Nie udało się pobrać propozycji słów kluczowych dla "${keyword}": ${error.message}`
    );
  }
};

exports.getRelatedKeywords = async (keyword, token) => {
  console.log(
    `Rozpoczynanie żądania dla powiązanych słów kluczowych: "${keyword}"`
  );

  const formData = new FormData();
  formData.append('country_id', '1');
  formData.append('keyword', keyword);
  formData.append('limit', '50');

  const requestConfig = {
    method: 'post',
    url: SENUTO_API_URL_GET_RELATED_KEYWORDS,
    headers: {
      ...formData.getHeaders(),
      Authorization: `Bearer ${token}`,
    },
    data: formData,
  };

  try {
    console.log('Wysyłanie żądania do API Senuto...');

    const response = await axios(requestConfig);

    console.log('Otrzymano odpowiedź od API Senuto');
    console.log('Kod statusu odpowiedzi:', response.status);
    console.log('Nagłówki odpowiedzi:', response.headers);
    console.log(
      'Pierwsze 100 znaków danych odpowiedzi:',
      JSON.stringify(response.data).substring(0, 100) + '...'
    );

    return response.data;
  } catch (error) {
    console.error(
      `Błąd w getRelatedKeywords dla słowa kluczowego "${keyword}":`
    );

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
      `Nie udało się pobrać powiązanych słów kluczowych dla "${keyword}": ${error.message}`
    );
  }
};
