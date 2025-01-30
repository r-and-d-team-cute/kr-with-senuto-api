const axios = require('axios');

const SENUTO_API_URL =
  'https://api.senuto.com/api/visibility_analysis/reports/dashboard/getDomainStatistics';
const SENUTO_POSITIONS_HISTORY_URL =
  'https://api.senuto.com/api/visibility_analysis/reports/domain_positions/getPositionsHistoryChartData';
const SENUTO_SECTIONS_URL =
  'https://api.senuto.com/api/visibility_analysis/reports/sections/getSections';
const SENUTO_URLS_URL =
  'https://api.senuto.com/api/visibility_analysis/reports/sections/getUrls';

// Funkcja pomocnicza do ekstrakcji domeny z URL
const extractDomain = (url) => {
  if (!url || typeof url !== 'string') {
    throw new Error('Nie podano adresu URL lub domeny');
  }

  try {
    // Usuń protokół (http://, https://, ftp:// itp.)
    let domain = url.replace(/^(https?:\/\/)?(www\.)?/i, '');

    // Usuń ścieżkę, parametry URL i hash
    domain = domain.split('/')[0].split('?')[0].split('#')[0];

    // Walidacja wyekstrahowanej domeny
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]+\.[a-zA-Z]{2,}$/;
    if (!domainRegex.test(domain)) {
      throw new Error('Nieprawidłowy format adresu URL lub domeny');
    }

    return domain;
  } catch (error) {
    throw new Error('Nieprawidłowy format adresu URL lub domeny');
  }
};

exports.getDomainStatistics = async (domain, token) => {
  try {
    const cleanDomain = extractDomain(domain);

    const response = await axios.get(SENUTO_API_URL, {
      params: {
        domain: cleanDomain,
        fetch_mode: 'subdomain',
        country_id: '200',
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error('Niepowodzenie w otrzymaniu danych z API Senuto');
    }

    const stats = response.data.data.statistics;
    return {
      top_positions: {
        top3: {
          current: stats.top3.recent_value,
          previous: stats.top3.older_value,
          change: stats.top3.diff,
          changePercent: (stats.top3.percent * 100).toFixed(2),
        },
        top10: {
          current: stats.top10.recent_value,
          previous: stats.top10.older_value,
          change: stats.top10.diff,
          changePercent: (stats.top10.percent * 100).toFixed(2),
        },
        top50: {
          current: stats.top50.recent_value,
          previous: stats.top50.older_value,
          change: stats.top50.diff,
          changePercent: (stats.top50.percent * 100).toFixed(2),
        },
      },
      visibility: {
        current: stats.visibility.recent_value,
        previous: stats.visibility.older_value,
        change: stats.visibility.diff,
        changePercent: (stats.visibility.percent * 100).toFixed(2),
      },
    };
  } catch (error) {
    console.error('Błąd w getDomainStatistics:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Brak autoryzacji lub nieprawidłowy token');
        case 404:
          throw new Error('Nie znaleziono danych dla podanej domeny');
        case 429:
          throw new Error('Przekroczono limit zapytań do API');
        default:
          throw new Error(`Błąd serwera: ${error.response.status}`);
      }
    }

    throw error; // Przekazujemy błąd walidacji z extractDomain
  }
};

const generateDateRange = () => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 6);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
};

/**
 * Filtruje daty, aby otrzymać dane w odstępach tygodniowych
 * @param {Object} data Obiekt zawierający dane dla wszystkich dat
 * @returns {Array} Tablica dat w odstępach tygodniowych
 */

const filterWeeklyData = (data) => {
  const dates = Object.keys(data).sort();
  const weeklyDates = dates.filter((_, index) => index % 7 === 0);

  if (!weeklyDates.includes(dates[dates.length - 1])) {
    weeklyDates.push(dates[dates.length - 1]);
  }

  return weeklyDates;
};

/**
 * Pobiera historyczne dane dotyczące pozycji domeny
 *
 * Zwrotka zawiera:
 * - positions: liczba słów kluczowych na pozycjach TOP3, TOP10 i TOP50 w danym dniu
 * - urls: liczba unikalnych URLi z pozycjami w TOP10 i TOP50
 * - efficiency: efektywność URLi (średnia liczba słów kluczowych w TOP10 i TOP50 na jeden URL)
 *
 * Dane są filtrowane do odstępów tygodniowych z okresu ostatnich 6 miesięcy
 *
 * @param {string} domain Domena do analizy
 * @param {string} token Token autoryzacyjny
 * @returns {Object} Przetworzone dane historyczne
 */

exports.getPositionsHistory = async (domain, token) => {
  try {
    const cleanDomain = extractDomain(domain);
    const dateRange = generateDateRange();

    const response = await axios.get(SENUTO_POSITIONS_HISTORY_URL, {
      params: {
        domain: cleanDomain,
        fetch_mode: 'subdomain',
        country_id: '200',
        date_min: dateRange.startDate,
        date_max: dateRange.endDate,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(
        'Niepowodzenie w otrzymaniu danych historycznych z API Senuto'
      );
    }

    console.log(response.data.data);

    const domainData = response.data.data[0]?.data;
    if (!domainData) {
      throw new Error('Brak danych historycznych dla podanej domeny');
    }

    const weeklyDates = filterWeeklyData(domainData.keywords_top3);

    // Transformacja danych do użytecznego formatu
    // Dla każdego tygodnia zwracamy:
    // 1. Liczbę słów kluczowych na pozycjach TOP3, TOP10 i TOP50
    // 2. Liczbę unikalnych URLi z pozycjami w TOP10 i TOP50
    // 3. Efektywność URLi (średnia liczba słów kluczowych na URL) dla TOP10 i TOP50
    const transformedData = weeklyDates.map((date) => ({
      date,
      positions: {
        top3: domainData.keywords_top3[date],
        top10: domainData.keywords_top10[date],
        top50: domainData.keywords_top50[date],
      },
      urls: {
        top10: domainData.unique_urls_top10[date],
        top50: domainData.unique_urls_top50[date],
      },
      efficiency: {
        top10: parseFloat(domainData.efficiency_top10[date].toFixed(2)),
        top50: parseFloat(domainData.efficiency_top50[date].toFixed(2)),
      },
    }));

    return {
      domain: cleanDomain,
      dateRange: {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      },
      data: transformedData,
    };
  } catch (error) {
    console.error('Błąd w getPositionsHistory:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Brak autoryzacji lub nieprawidłowy token');
        case 404:
          throw new Error('Nie znaleziono danych dla podanej domeny');
        case 429:
          throw new Error('Przekroczono limit zapytań do API');
        default:
          throw new Error(`Błąd serwera: ${error.response.status}`);
      }
    }

    throw error;
  }
};

/**
 * Pobiera dane dotyczące widoczności sekcji domeny
 *
 * Zwrotka z API Senuto zawiera:
 * - dane o sekcji (ścieżka URL)
 * - liczba słów w TOP3, 10 i 50 na sekcję/URL
 * - szacowany ruch z sekcji
 * - zmiany procentowe w ruchu dla sekcji (spadek/wzrost)
 * - zwrotka sortowana od największej widoczności
 *
 * Dane są transformowane do formatu:
 * {
 *   domain: string,
 *   sectionsCount: number,
 *   data: [{
 *     section: string,
 *     visibility: {
 *       current: number,
 *       previous: number,
 *       change: number,
 *       changePercent: string
 *     },
 *     keywords: {
 *       total: number,
 *       top3: { current, previous, change, changePercent },
 *       top10: { current, previous, change, changePercent },
 *       top50: { current, previous, change, changePercent }
 *     }
 *   }]
 * }
 *
 * @param {string} domain Domena do analizy
 * @param {string} token Token autoryzacyjny
 * @returns {Object} Dane o sekcjach i ich widoczności
 */
exports.getDomainSections = async (domain, token) => {
  try {
    const cleanDomain = extractDomain(domain);

    const requestBody = {
      domain: cleanDomain,
      country_id: '200',
      fetch_mode: 'subdomain',
      keywords_count_min: 1,
      limit: 10,
    };

    const response = await axios.post(SENUTO_SECTIONS_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(
        'Niepowodzenie w otrzymaniu danych o sekcjach z API Senuto'
      );
    }

    // Transformacja danych do bardziej przejrzystego formatu
    // Zachowujemy informacje o:
    // 1. Sekcjach URL i liczbie słów kluczowych
    // 2. Widoczności sekcji i jej zmianach
    // 3. Pozycjach w TOP3, TOP10, TOP50
    // 4. Zmianach w czasie dla każdej metryki
    const transformedData = response.data.data.map((section) => ({
      section: section.url_section,
      visibility: {
        current: parseFloat(section.statistics.visibility.current.toFixed(2)),
        previous: parseFloat(section.statistics.visibility.previous.toFixed(2)),
        change: parseFloat(section.statistics.visibility.diff.toFixed(2)),
        changePercent: (section.statistics.visibility.percent * 100).toFixed(2),
      },
      keywords: {
        total: section.keywords_count,
        top3: {
          current: section.statistics.top3.current,
          previous: section.statistics.top3.previous,
          change: section.statistics.top3.diff,
          changePercent: (section.statistics.top3.percent * 100).toFixed(2),
        },
        top10: {
          current: section.statistics.top10.current,
          previous: section.statistics.top10.previous,
          change: section.statistics.top10.diff,
          changePercent: (section.statistics.top10.percent * 100).toFixed(2),
        },
        top50: {
          current: section.statistics.top50.current,
          previous: section.statistics.top50.previous,
          change: section.statistics.top50.diff,
          changePercent: (section.statistics.top50.percent * 100).toFixed(2),
        },
      },
    }));

    return {
      domain: cleanDomain,
      sectionsCount: response.data.pagination.count,
      data: transformedData,
    };
  } catch (error) {
    console.error('Błąd w getDomainSections:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Brak autoryzacji lub nieprawidłowy token');
        case 404:
          throw new Error('Nie znaleziono danych dla podanej domeny');
        case 429:
          throw new Error('Przekroczono limit zapytań do API');
        default:
          throw new Error(`Błąd serwera: ${error.response.status}`);
      }
    }

    throw error;
  }
};

/**
 * Pobiera dane dotyczące URLi z największą widocznością
 *
 * Zwrotka z API Senuto zawiera:
 * - dane o danym URL
 * - liczba słów w TOP3, 10 i 50 na URL
 * - szacowany ruch z URL
 * - zmiany procentowe w ruchu dla URLa (spadek/wzrost)
 * - zwrotka sortowana od największej widoczności
 *
 * Dane są transformowane do formatu:
 * {
 *   domain: string,
 *   urlsCount: number,
 *   data: [{
 *     url: string,
 *     visibility: {
 *       current: number,
 *       previous: number,
 *       change: number,
 *       changePercent: string
 *     },
 *     keywords: {
 *       total: number,
 *       top3: { current, previous, change, changePercent },
 *       top10: { current, previous, change, changePercent },
 *       top50: { current, previous, change, changePercent }
 *     }
 *   }]
 * }
 *
 * @param {string} domain Domena do analizy
 * @param {string} token Token autoryzacyjny
 * @returns {Object} Dane o URLach i ich widoczności
 */

exports.getDomainUrls = async (domain, token) => {
  try {
    const cleanDomain = extractDomain(domain);

    const requestBody = {
      domain: cleanDomain,
      country_id: '200',
      fetch_mode: 'subdomain',
      limit: 15,
    };

    const response = await axios.post(SENUTO_URLS_URL, requestBody, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data.success) {
      throw new Error(
        'Niepowodzenie w otrzymaniu danych o URLach z API Senuto'
      );
    }

    // Transformacja danych do bardziej przejrzystego formatu
    // Zachowujemy informacje o:
    // 1. Konkretnych URLach i liczbie słów kluczowych
    // 2. Widoczności URLa i jej zmianach
    // 3. Pozycjach w TOP3, TOP10, TOP50
    // 4. Zmianach w czasie dla każdej metryki
    const transformedData = response.data.data.map((urlData) => ({
      url: urlData.url,
      visibility: {
        current: parseFloat(urlData.statistics.visibility.current.toFixed(2)),
        previous: parseFloat(urlData.statistics.visibility.previous.toFixed(2)),
        change: parseFloat(urlData.statistics.visibility.diff.toFixed(2)),
        changePercent: (urlData.statistics.visibility.percent * 100).toFixed(2),
      },
      keywords: {
        total: urlData.keywords_count,
        top3: {
          current: urlData.statistics.top3.current,
          previous: urlData.statistics.top3.previous,
          change: urlData.statistics.top3.diff,
          changePercent: (urlData.statistics.top3.percent * 100).toFixed(2),
        },
        top10: {
          current: urlData.statistics.top10.current,
          previous: urlData.statistics.top10.previous,
          change: urlData.statistics.top10.diff,
          changePercent: (urlData.statistics.top10.percent * 100).toFixed(2),
        },
        top50: {
          current: urlData.statistics.top50.current,
          previous: urlData.statistics.top50.previous,
          change: urlData.statistics.top50.diff,
          changePercent: (urlData.statistics.top50.percent * 100).toFixed(2),
        },
      },
    }));

    return {
      domain: cleanDomain,
      urlsCount: response.data.pagination.count,
      data: transformedData,
    };
  } catch (error) {
    console.error('Błąd w getDomainUrls:', error);

    if (error.response) {
      switch (error.response.status) {
        case 401:
          throw new Error('Brak autoryzacji lub nieprawidłowy token');
        case 404:
          throw new Error('Nie znaleziono danych dla podanej domeny');
        case 429:
          throw new Error('Przekroczono limit zapytań do API');
        default:
          throw new Error(`Błąd serwera: ${error.response.status}`);
      }
    }

    throw error;
  }
};

/**
 * Pobiera wszystkie dane dotyczące widoczności domeny
 *
 * Łączy dane z:
 * - statystyk ogólnych domeny
 * - historii pozycji w czasie
 * - danych o sekcjach
 * - danych o konkretnych URLach
 *
 * @param {string} domain Domena do analizy
 * @param {string} token Token autoryzacyjny
 * @returns {Object} Kompletne dane o widoczności domeny
 */
exports.getDomainVisibilityData = async (domain, token) => {
  try {
    const cleanDomain = extractDomain(domain);

    // Pobieranie wszystkich danych równolegle dla optymalizacji
    const [generalStats, positionsHistory, sectionsData, urlsData] =
      await Promise.all([
        this.getDomainStatistics(domain, token),
        this.getPositionsHistory(domain, token),
        this.getDomainSections(domain, token),
        this.getDomainUrls(domain, token),
      ]);

    return {
      domain: cleanDomain,
      timestamp: new Date().toISOString(),
      general: {
        top_positions: generalStats.top_positions,
        visibility: generalStats.visibility,
      },
      history: {
        dateRange: positionsHistory.dateRange,
        weeklyData: positionsHistory.data,
      },
      structure: {
        sectionsCount: sectionsData.sectionsCount,
        sections: sectionsData.data,
        urlsCount: urlsData.urlsCount,
        urls: urlsData.data,
      },
    };
  } catch (error) {
    console.error('Błąd w getDomainVisibilityData:', error);
    throw error;
  }
};
