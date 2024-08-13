// src/utils.js

// Funkcja pomocnicza do escapowania wartości CSV
const escapeCSV = (value) => {
  if (
    typeof value === 'string' &&
    (value.includes(',') || value.includes('"') || value.includes('\n'))
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
};

// Konwersja propozycji słów kluczowych na CSV
export const convertPropositionsToCSV = (data) => {
  const header = ['Słowo kluczowe', 'Wyszukiwania', 'CPC', 'Wariacje'];
  const rows = data.map((item) =>
    [
      item.keyword,
      item.searches,
      item.cpc,
      (item.variations || []).join('; '),
    ].map(escapeCSV)
  );

  return [header, ...rows].map((row) => row.join(',')).join('\n');
};

// Konwersja powiązanych słów kluczowych na CSV
export const convertRelatedToCSV = (data) => {
  const header = ['Słowo kluczowe', 'Wyszukiwania', 'CPC'];
  const rows = data.map((item) =>
    [item.keyword, item.searches, item.cpc].map(escapeCSV)
  );

  return [header, ...rows].map((row) => row.join(',')).join('\n');
};

// Konwersja wyników analizy URL na CSV
export const convertUrlAnalysisToCSV = (data) => {
  const header = ['URL', 'Słowo kluczowe', 'Wyszukiwania', 'CPC'];
  const rows = data.flatMap((item) =>
    item.keywords.map((keyword) =>
      [item.url, keyword.keyword, keyword.searches, keyword.cpc].map(escapeCSV)
    )
  );

  return [header, ...rows].map((row) => row.join(',')).join('\n');
};

// Konwersja TOP 3 wyników na CSV
export const convertTop3ResultsToCSV = (data) => {
  const header = ['Pozycja', 'URL'];
  const rows = data.map((url, index) => [index + 1, url].map(escapeCSV));

  return [header, ...rows].map((row) => row.join(',')).join('\n');
};

// Ogólna funkcja konwertująca do CSV, która wybiera odpowiednią funkcję konwersji
export const convertToCSV = (data, type) => {
  switch (type) {
    case 'propositions':
      return convertPropositionsToCSV(data);
    case 'related':
      return convertRelatedToCSV(data);
    case 'urlAnalysis':
      return convertUrlAnalysisToCSV(data);
    case 'top3':
      return convertTop3ResultsToCSV(data);
    default:
      throw new Error('Nieznany typ danych do konwersji CSV');
  }
};
