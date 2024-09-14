import React from 'react';
import styles from '../styles/UrlAnalysisResults.module.css';

const UrlAnalysisResults = ({ results }) => {
  return (
    <div className={styles.results}>
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
          {results?.flatMap((result, index) =>
            result?.keywords?.map((keyword, kIndex) => (
              <tr key={`${index}-${kIndex}`}>
                {kIndex === 0 && (
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
                )}
                <td>{keyword.keyword}</td>
                <td>{keyword.searches}</td>
                <td>{keyword.cpc}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UrlAnalysisResults;
