import React from 'react';
import styles from '../styles/KeywordResults.module.css';

const KeywordResults = ({ results, type }) => {
  if (!results || !Array.isArray(results) || results.length === 0) {
    return (
      <div className={styles.noResults}>Brak wyników do wyświetlenia.</div>
    );
  }

  const showVariations = type === 'propositions';

  return (
    <div className={styles.results}>
      <table className={styles.resultTable}>
        <thead>
          <tr>
            <th>Słowo kluczowe</th>
            <th>Wyszukiwania</th>
            <th>CPC</th>
            {showVariations && <th>Wariacje</th>}
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index}>
              <td>{result.keyword || 'Brak słowa kluczowego'}</td>
              <td>
                {result.searches !== undefined
                  ? result.searches
                  : 'Brak danych'}
              </td>
              <td>{result.cpc !== undefined ? result.cpc : 'Brak danych'}</td>
              {showVariations && (
                <td>
                  {result.variations &&
                  Array.isArray(result.variations) &&
                  result.variations.length > 0 ? (
                    <ul className={styles.variationsList}>
                      {result.variations.map((variation, vIndex) => (
                        <li key={vIndex}>{variation}</li>
                      ))}
                    </ul>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default KeywordResults;
