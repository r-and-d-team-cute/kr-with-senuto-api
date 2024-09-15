import React from 'react';
import styles from '../styles/UrlAnalysisResults.module.css';

const UrlAnalysisResults = ({ results, intentMode }) => {
  if (!results || results.length === 0) {
    return (
      <div className={styles.noResults}>
        Brak wyników analizy URL do wyświetlenia.
      </div>
    );
  }

  const renderSingleResults = () => (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>URL</th>
          <th>Słowo kluczowe</th>
          <th>Wyszukiwania</th>
          <th>CPC</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result, index) => {
          if (!result || !result.keywords || !Array.isArray(result.keywords)) {
            return (
              <tr key={index}>
                <td
                  colSpan='4'
                  className={styles.errorCell}
                >
                  Nieprawidłowe dane dla tego URL {result.url}
                </td>
              </tr>
            );
          }
          return result.keywords.map((keyword, keywordIndex) => (
            <tr key={`${index}-${keywordIndex}`}>
              {keywordIndex === 0 ? (
                <td
                  rowSpan={result.keywords.length}
                  className={styles.urlCell}
                >
                  <a
                    href={result.url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {result.url}
                  </a>
                </td>
              ) : null}
              <td>{keyword.keyword || 'Brak danych'}</td>
              <td>{keyword.searches || 'Brak danych'}</td>
              <td>{keyword.cpc}</td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );

  const renderMultipleResults = () => (
    <table className={styles.resultTable}>
      <thead>
        <tr>
          <th>Analizowane słowo kluczowe</th>
          <th>URL</th>
          <th>Słowo kluczowe</th>
          <th>Wyszukiwania</th>
          <th>CPC</th>
        </tr>
      </thead>
      <tbody>
        {results.map((group, groupIndex) => {
          if (!group || !group.results || !Array.isArray(group.results)) {
            return (
              <tr key={groupIndex}>
                <td
                  colSpan='5'
                  className={styles.errorCell}
                >
                  Nieprawidłowe dane dla grupy:{' '}
                  {group.mainKeyword || 'Nieznana grupa'}
                </td>
              </tr>
            );
          }
          return group.results.flatMap((result, resultIndex) => {
            if (
              !result ||
              !result.keywords ||
              !Array.isArray(result.keywords)
            ) {
              return [
                <tr key={`${groupIndex}-${resultIndex}`}>
                  <td
                    colSpan='5'
                    className={styles.errorCell}
                  >
                    Nieprawidłowe dane dla {result.url} w grupie:{' '}
                    {group.mainKeyword}, spróbuj ponownie!
                  </td>
                </tr>,
              ];
            }
            return result.keywords.map((keyword, keywordIndex) => (
              <tr key={`${groupIndex}-${resultIndex}-${keywordIndex}`}>
                {resultIndex === 0 && keywordIndex === 0 ? (
                  <td
                    rowSpan={group.results.reduce(
                      (acc, r) => acc + (r.keywords?.length || 0),
                      0
                    )}
                    className={styles.mainKeywordCell}
                  >
                    {group.mainKeyword || 'Brak danych'}
                  </td>
                ) : null}
                {keywordIndex === 0 ? (
                  <td
                    rowSpan={result.keywords.length}
                    className={styles.urlCell}
                  >
                    <a
                      href={result.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {result.url}
                    </a>
                  </td>
                ) : null}
                <td>{keyword.keyword || 'Brak danych'}</td>
                <td>{keyword.searches || 'Brak danych'}</td>
                <td>{keyword.cpc}</td>
              </tr>
            ));
          });
        })}
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

export default UrlAnalysisResults;
