import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import MainView from './components/MainView';
import {
  getCurrentUser,
  login,
  logout,
  getKeywordsPropositions,
  getRelatedKeywords,
  getTop3Results,
  analyzeUrls,
} from './api/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginStatus, setLoginStatus] = useState(null);
  const [keywordError, setKeywordError] = useState(null);
  const [keywordPropositionResults, setKeywordPropositionResults] = useState(
    []
  );
  const [relatedKeywordsResults, setRelatedKeywordsResults] = useState([]);
  const [top3Results, setTop3Results] = useState([]);
  const [urlAnalysisResults, setUrlAnalysisResults] = useState([]);
  const [loadingStates, setLoadingStates] = useState({
    keywordPropositions: false,
    relatedKeywords: false,
    top3Results: false,
    urlAnalysis: false,
  });

  const setLoadingState = (key, value) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { user, success } = await getCurrentUser();
        if (success && user) {
          setUser(user);
          setLoginStatus({
            type: 'success',
            message: 'Użytkownik pomyślnie uwierzytelniony.',
          });
        } else {
          setUser(null);
          setLoginStatus({
            type: 'info',
            message: 'Błąd logowania, proszę zalogować się, aby kontynuować.',
          });
        }
      } catch (error) {
        console.error('Błąd podczas sprawdzania statusu logowania:', error);
        setUser(null);
        setLoginStatus({
          type: 'error',
          message: 'Wystąpił błąd podczas sprawdzania statusu logowania.',
        });
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const { user } = await login(email, password);
      setUser(user.email);
      setLoginStatus({
        type: 'success',
        message: 'Użytkownik zalogowany. Token jest git.',
      });
    } catch (error) {
      console.error('Login failed', error);
      setLoginStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Błąd logowania, spróbuj ponownie.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);

      setLoginStatus({
        type: 'info',
        message: 'Użytkownik wylogowany pomyślnie.',
      });
    } catch (error) {
      console.error('Logout failed', error);
      setLoginStatus({
        type: 'error',
        message: 'Błąd podczas wylogowywania. Spróbuj ponownie.',
      });
    }
  };

  const handleKeywordPropositionSubmit = async (keywords) => {
    setKeywordError(null);
    setLoadingState('keywordPropositions', true);
    try {
      const data = await getKeywordsPropositions(keywords);
      if (Array.isArray(data)) {
        setKeywordPropositionResults(data);
      } else {
        setKeywordPropositionResults([]);
        setKeywordError('Otrzymano nieprawidłowe dane z API');
      }
    } catch (err) {
      setKeywordPropositionResults([]);
      setKeywordError(
        err.message || 'Wystąpił błąd podczas analizy słów kluczowych'
      );
    } finally {
      setLoadingState('keywordPropositions', false);
    }
  };

  const handleRelatedKeywordsSubmit = async (keywords) => {
    setKeywordError(null);
    setLoadingState('relatedKeywords', true);
    try {
      const data = await getRelatedKeywords(keywords);
      if (Array.isArray(data)) {
        setRelatedKeywordsResults(data);
      } else {
        setRelatedKeywordsResults([]);
        setKeywordError('Otrzymano nieprawidłowe dane z API');
      }
    } catch (err) {
      setRelatedKeywordsResults([]);
      setKeywordError(
        err.message || 'Wystąpił błąd podczas analizy słów kluczowych'
      );
    } finally {
      setLoadingState('relatedKeywords', false);
    }
  };

  const handleTop3ResultsSubmit = async (keywords) => {
    setKeywordError(null);
    setLoadingState('top3Results', true);
    try {
      const data = await getTop3Results(keywords);
      setTop3Results(data);
    } catch (err) {
      setKeywordError(
        err.message || 'Wystąpił błąd podczas pobierania TOP3 wyników'
      );
    } finally {
      setLoadingState('top3Results', false);
    }
  };

  const handleUrlAnalysis = async (urls) => {
    setKeywordError(null);
    setLoadingState('urlAnalysis', true);
    try {
      const data = await analyzeUrls(urls);
      setUrlAnalysisResults(data);
    } catch (err) {
      setKeywordError(err.message || 'Wystąpił błąd podczas analizy URL');
    } finally {
      setLoadingState('urlAnalysis', false);
    }
  };

  if (loading) {
    return <div>Sprawdzanie, czy jesteś dobrym ziomkiem...</div>;
  }

  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
        statusMessage={loginStatus}
      />
    );
  }

  return (
    <MainView
      user={user}
      loginStatus={loginStatus}
      handleLogout={handleLogout}
      handleKeywordPropositionSubmit={handleKeywordPropositionSubmit}
      keywordPropositionResults={keywordPropositionResults}
      keywordError={keywordError}
      relatedKeywordsResults={relatedKeywordsResults}
      handleRelatedKeywordsSubmit={handleRelatedKeywordsSubmit}
      handleTop3ResultsSubmit={handleTop3ResultsSubmit}
      top3Results={top3Results}
      handleUrlAnalysis={handleUrlAnalysis}
      urlAnalysisResults={urlAnalysisResults}
      loadingStates={loadingStates}
    />
  );
}

export default App;
