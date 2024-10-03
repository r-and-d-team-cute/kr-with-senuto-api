import React, { useState, useEffect } from 'react';
import { convertToCSV } from '../utils';
import TabSwitcher from './TabSwitcher';
import KeywordInput from './KeywordInput';
import KeywordResults from './KeywordResults';
import Top3Results from './Top3Results';
import UrlAnalysisResults from './UrlAnalysisResults';
import styles from '../styles/MainView.module.css';

const MainView = ({
  user,
  loginStatus,
  handleLogout,
  handleKeywordPropositionSubmit,
  keywordPropositionResults,
  handleRelatedKeywordsSubmit,
  relatedKeywordsResults,
  handleTop3ResultsSubmit,
  top3Results,
  handleUrlAnalysis,
  urlAnalysisResults,
  keywordError,
  handleMultipleKeywordPropositionSubmit,
  multipleKeywordPropositionResults,
  handleMultipleRelatedKeywordsSubmit,
  multipleRelatedKeywordsResults,
  handleMultipleTop3ResultsSubmit,
  multipleTop3Results,
  handleMultipleUrlAnalysis,
  multipleUrlAnalysisResults,
  loadingStates,
}) => {
  const [activeTab, setActiveTab] = useState('propositions');
  const [intentMode, setIntentMode] = useState('single');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScrollTop && window.pageYOffset > 400) {
        setShowScrollTop(true);
      } else if (showScrollTop && window.pageYOffset <= 400) {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, [showScrollTop]);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadCSV = (data, type, filename) => {
    const csvContent = convertToCSV(data, type);
    const BOM = '\uFEFF'; // Dodaj BOM na początku pliku
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Zwolnij zasoby
  };

  const getActiveSubmitHandler = (singleHandler, multipleHandler) => {
    return intentMode === 'single' ? singleHandler : multipleHandler;
  };

  const getActiveResults = (singleResults, multipleResults) => {
    return intentMode === 'single' ? singleResults : multipleResults;
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1>Czołem, {user}!</h1>
        <button
          onClick={handleLogout}
          className={styles.logoutButton}
        >
          Wyloguj
        </button>
      </div>

      {loginStatus && (
        <div className={`${styles.statusMessage} ${styles[loginStatus.type]}`}>
          {loginStatus.message}
        </div>
      )}

      <div className={styles.contentSection}>
        <TabSwitcher
          intentMode={intentMode}
          setIntentMode={setIntentMode}
        />
        <KeywordInput
          onSubmit={getActiveSubmitHandler(
            handleKeywordPropositionSubmit,
            handleMultipleKeywordPropositionSubmit
          )}
          onRelatedSubmit={getActiveSubmitHandler(
            handleRelatedKeywordsSubmit,
            handleMultipleRelatedKeywordsSubmit
          )}
          onTop3Submit={getActiveSubmitHandler(
            handleTop3ResultsSubmit,
            handleMultipleTop3ResultsSubmit
          )}
          intentMode={intentMode}
          loadingStates={loadingStates}
        />
        {keywordError && <p className={styles.error}>{keywordError}</p>}
      </div>

      {Object.values(loadingStates).some((state) => state) && (
        <div className={styles.loadingIndicator}>Trwa ładowanie danych...</div>
      )}

      <div className={styles.tabsContainer}>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'propositions' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('propositions')}
        >
          Propozycje słów kluczowych
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'related' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('related')}
        >
          Powiązane słowa kluczowe
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'top3' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('top3')}
        >
          TOP 3 Wyniki
        </button>
        <button
          className={`${styles.tabButton} ${
            activeTab === 'analysis' ? styles.activeTab : ''
          }`}
          onClick={() => setActiveTab('analysis')}
        >
          Analiza URL
        </button>
      </div>

      <div className={styles.resultsSection}>
        {activeTab === 'propositions' && (
          <>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultsTitle}>
                Propozycje słów kluczowych
              </h3>
              <div className={styles.actionButtons}>
                <button
                  onClick={() =>
                    downloadCSV(
                      getActiveResults(
                        keywordPropositionResults,
                        multipleKeywordPropositionResults
                      ),
                      'propositions',
                      'propozycje_slow_kluczowych.csv'
                    )
                  }
                >
                  Pobierz CSV
                </button>
              </div>
            </div>
            <KeywordResults
              results={getActiveResults(
                keywordPropositionResults,
                multipleKeywordPropositionResults
              )}
              type='propositions'
              intentMode={intentMode}
            />
          </>
        )}
        {activeTab === 'related' && (
          <>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultsTitle}>Powiązane słowa kluczowe</h3>
              <div className={styles.actionButtons}>
                <button
                  onClick={() =>
                    downloadCSV(
                      getActiveResults(
                        relatedKeywordsResults,
                        multipleRelatedKeywordsResults
                      ),
                      'related',
                      'powiazane_slowa_kluczowe.csv'
                    )
                  }
                >
                  Pobierz CSV
                </button>
              </div>
            </div>
            <KeywordResults
              results={getActiveResults(
                relatedKeywordsResults,
                multipleRelatedKeywordsResults
              )}
              type='related'
              intentMode={intentMode}
            />
          </>
        )}
        {activeTab === 'top3' && (
          <>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultsTitle}>TOP 3 Wyniki</h3>
              <div className={styles.actionButtons}>
                <button
                  onClick={() =>
                    downloadCSV(top3Results, 'top3', 'top3_wyniki.csv')
                  }
                >
                  Pobierz CSV
                </button>
              </div>
            </div>
            <Top3Results
              results={getActiveResults(top3Results, multipleTop3Results)}
              onAnalyze={getActiveSubmitHandler(
                handleUrlAnalysis,
                handleMultipleUrlAnalysis
              )}
              loadingStates={loadingStates}
              intentMode={intentMode}
            />
          </>
        )}
        {activeTab === 'analysis' && (
          <>
            <div className={styles.resultHeader}>
              <h3 className={styles.resultsTitle}>Analiza URL</h3>
              <div className={styles.actionButtons}>
                <button
                  onClick={() =>
                    downloadCSV(
                      getActiveResults(
                        urlAnalysisResults,
                        multipleUrlAnalysisResults
                      ),
                      'urlAnalysis',
                      'analiza_url.csv'
                    )
                  }
                >
                  Pobierz CSV
                </button>
              </div>
            </div>
            <UrlAnalysisResults
              results={getActiveResults(
                urlAnalysisResults,
                multipleUrlAnalysisResults
              )}
              intentMode={intentMode}
            />
          </>
        )}
      </div>

      {showScrollTop && (
        <button
          className={styles.scrollTopButton}
          onClick={scrollTop}
          aria-label='Przewiń na górę strony'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            width='24'
            height='24'
          >
            <path d='M12 4l-8 8h16l-8-8z' />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MainView;
