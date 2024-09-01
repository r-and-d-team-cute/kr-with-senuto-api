import React, { useState, useEffect } from 'react';
import styles from '../styles/Top3Results.module.css';

const Top3Results = ({ results, onAnalyze }) => {
  const [selectedUrls, setSelectedUrls] = useState({});

  useEffect(() => {
    // Ustaw wszystkie URL-e jako domyślnie zaznaczone
    const initialSelection = results.reduce((acc, url) => {
      acc[url] = true;
      return acc;
    }, {});
    setSelectedUrls(initialSelection);
  }, [results]);

  const handleCheckboxChange = (url) => {
    setSelectedUrls((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  const handleAnalyze = () => {
    const urlsToAnalyze = Object.keys(selectedUrls).filter(
      (url) => selectedUrls[url]
    );
    onAnalyze(urlsToAnalyze);
  };

  return (
    <div className={styles.results}>
      {results.map((url, index) => (
        <div
          key={index}
          className={styles.resultItem}
        >
          <label className={styles.urlLabel}>
            <input
              type='checkbox'
              checked={selectedUrls[url] || false}
              onChange={() => handleCheckboxChange(url)}
              className={styles.checkbox}
            />
            <a
              href={url}
              target='_blank'
              rel='noopener noreferrer'
              className={styles.urlLink}
            >
              {url}
            </a>
          </label>
        </div>
      ))}
      {results.length > 0 && (
        <button
          onClick={handleAnalyze}
          className={styles.analyzeButton}
        >
          Analizuj zaznaczone URL-e
        </button>
      )}
    </div>
  );
};

export default Top3Results;
