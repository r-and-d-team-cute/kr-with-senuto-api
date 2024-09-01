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

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const { user } = await getCurrentUser();
        if (user) {
          setUser(user);
          setLoginStatus({
            type: 'success',
            message: 'User successfully authenticated.',
          });
        }
      } catch (error) {
        console.error('User not logged in', error);
        setLoginStatus({ type: 'info', message: 'Please log in to continue.' });
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = async (email, password) => {
    try {
      const { user } = await login(email, password);
      setUser(user);
      setLoginStatus({
        type: 'success',
        message: 'Login successful. Bearer token set.',
      });
    } catch (error) {
      console.error('Login failed', error);
      setLoginStatus({
        type: 'error',
        message:
          error.response?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);

      setLoginStatus({
        type: 'info',
        message: 'User logged out successfully.',
      });
    } catch (error) {
      console.error('Logout failed', error);
      setLoginStatus({
        type: 'error',
        message: 'Logout failed. Please try again.',
      });
    }
  };

  const handleKeywordPropositionSubmit = async (keywords) => {
    setKeywordError(null);
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
    }
  };

  const handleRelatedKeywordsSubmit = async (keywords) => {
    setKeywordError(null);
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
    }
  };

  const handleTop3ResultsSubmit = async (keywords) => {
    setKeywordError(null);
    try {
      const data = await getTop3Results(keywords);
      setTop3Results(data);
    } catch (err) {
      setKeywordError(
        err.message || 'Wystąpił błąd podczas pobierania TOP3 wyników'
      );
    }
  };

  const handleUrlAnalysis = async (urls) => {
    setKeywordError(null);
    try {
      const data = await analyzeUrls(urls);
      setUrlAnalysisResults(data);
    } catch (err) {
      setKeywordError(err.message || 'Wystąpił błąd podczas analizy URL');
    }
  };

  if (loading) {
    return <div>Checking authentication status...</div>;
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
    />
  );
}

export default App;
