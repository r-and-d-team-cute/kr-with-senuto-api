import React, { useState, useEffect } from 'react';
import styles from '../styles/Top3Results.module.css';

const Top3Results = ({ results, onAnalyze, loadingStates, intentMode }) => {
  const [selectedUrls, setSelectedUrls] = useState({});

  useEffect(() => {
    const initialSelection = {};
    if (intentMode === 'single') {
      results.forEach((url) => {
        initialSelection[url] = true;
      });
    } else {
      results.forEach((group) => {
        group.urls.forEach((url) => {
          initialSelection[url] = true;
        });
      });
    }
    setSelectedUrls(initialSelection);
  }, [results, intentMode]);

  const handleCheckboxChange = (url) => {
    setSelectedUrls((prev) => ({
      ...prev,
      [url]: !prev[url],
    }));
  };

  const handleAnalyze = () => {
    const urlsToAnalyze = Object.entries(selectedUrls)
      .filter(([_, isSelected]) => isSelected)
      .map(([url]) => url);

    if (intentMode === 'single') {
      onAnalyze(urlsToAnalyze);
    } else {
      const groupedUrls = results.map((group) => ({
        mainKeyword: group.mainKeyword,
        urls: group.urls.filter((url) => selectedUrls[url]),
      }));
      onAnalyze(groupedUrls);
    }
  };

  const renderSingleResults = () => (
    <div>
      {results?.map((url, index) => (
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
    </div>
  );

  const renderMultipleResults = () => (
    <div>
      {results?.map((group, groupIndex) => (
        <div
          key={groupIndex}
          className={styles.resultGroup}
        >
          <h3 className={styles.groupTitle}>{group.mainKeyword}</h3>
          {group.urls.map((url, urlIndex) => (
            <div
              key={urlIndex}
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
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {intentMode === 'single'
        ? renderSingleResults()
        : renderMultipleResults()}
      <button
        onClick={handleAnalyze}
        className={styles.analyzeButton}
        disabled={
          loadingStates.urlAnalysis || loadingStates.multipleUrlAnalysis
        }
      >
        {loadingStates.urlAnalysis || loadingStates.multipleUrlAnalysis
          ? 'Analizuję...'
          : 'Analizuj zaznaczone URL-e'}
      </button>
    </div>
  );
};

export default Top3Results;
