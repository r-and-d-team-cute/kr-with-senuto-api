const axios = require('axios');

const SENUTO_API_URL_TOKEN = 'https://api.senuto.com/api/users/token';

exports.login = async (email, password) => {
  try {
    const response = await axios.post(
      SENUTO_API_URL_TOKEN,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.success) {
      return {
        token: response.data.data.token,
        user: {
          id: response.data.data.id,
          email: response.data.data.email,
          lang: response.data.data.lang,
          currency: response.data.data.currency,
        },
      };
    } else {
      throw new Error(
        'Login failed: ' + (response.data.message || 'Unknown error')
      );
    }
  } catch (error) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        'An error occurred during login'
    );
  }
};

exports.testConnection = async () => {
  // To jest tylko przykład. W przyszłości zastąpienie z rzeczywistym połączeniem z API Senuto.
  return { message: 'Połączenie z API Senuto działa poprawnie' };
};
