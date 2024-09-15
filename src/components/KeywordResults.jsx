import React from 'react';
import styles from '../styles/KeywordResults.module.css';

const KeywordResults = ({ results, type, intentMode }) => {
  if (!results || (Array.isArray(results) && results.length === 0)) {
    return (
      <div className={styles.noResults}>Brak wyników do wyświetlenia.</div>
    );
  }

  const renderSingleResults = () => (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>Słowo kluczowe</th>
          <th>Wyszukiwania</th>
          <th>CPC</th>
          {type === 'propositions' && <th>Wariacje</th>}
        </tr>
      </thead>
      <tbody>
        {results?.map((result, index) => (
          <tr key={index}>
            <td>{result.keyword || 'Brak słowa kluczowego'}</td>
            <td>
              {result.searches !== undefined ? result.searches : 'Brak danych'}
            </td>
            <td>{result.cpc !== undefined ? result.cpc : 'Brak danych'}</td>
            {type === 'propositions' && (
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
  );

  const renderMultipleResults = () => (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>Analizowane słowo kluczowe</th>
          <th>Słowo kluczowe</th>
          <th>Wyszukiwania</th>
          <th>CPC</th>
          {type === 'propositions' && <th>Wariacje</th>}
        </tr>
      </thead>
      <tbody>
        {results?.map((group, groupIndex) =>
          group.results.map((result, resultIndex) => (
            <tr key={`${groupIndex}-${resultIndex}`}>
              {resultIndex === 0 && (
                <td rowSpan={group.results.length}>{group.mainKeyword}</td>
              )}
              <td>{result.keyword || 'Brak słowa kluczowego'}</td>
              <td>
                {result.searches !== undefined
                  ? result.searches
                  : 'Brak danych'}
              </td>
              <td>{result.cpc !== undefined ? result.cpc : 'Brak danych'}</td>
              {type === 'propositions' && (
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
          ))
        )}
      </tbody>
    </table>
  );

  return (
    <div className={styles.results}>
      {intentMode === 'single'
        ? renderSingleResults()
        : renderMultipleResults()}
    </div>
  );
};

export default KeywordResults;
