import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password });
  console.log(response);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/getCurrentUser');
  return response.data;
};

export const getKeywordsPropositions = async (keywords) => {
  try {
    const response = await api.post('/getKeywordsPropositions', { keywords });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error analyzing keywords:', error);
    throw error;
  }
};

export const getRelatedKeywords = async (keywords) => {
  try {
    const response = await api.post('/getRelatedKeywords', { keywords });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error getting related keywords:', error);
    throw error;
  }
};

export const getTop3Results = async (keywords) => {
  try {
    const response = await api.post('/getTop3Results', { keywords });
    return response.data;
  } catch (error) {
    console.error('Error getting top 3 results:', error);
    throw error;
  }
};

export const analyzeUrls = async (urls) => {
  try {
    const response = await api.post('/analyzeUrls', { urls });
    return response.data;
  } catch (error) {
    console.error('Error analyzing URLs:', error);
    throw error;
  }
};

export default api;
