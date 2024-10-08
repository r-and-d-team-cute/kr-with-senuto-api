const authService = require('../services/authService');

exports.login = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
  const { email } = req.body;

  if (token) {
    try {
      // Tutaj możemy dodać weryfikację tokenu z API Senuto, jeśli jest taka możliwość
      // Na razie zakładamy, że jeśli token istnieje, to jest ważny
      return res.json({ user: email, message: 'Zalogowano pomyślnie' });
    } catch (error) {
      // Jeśli token jest nieważny, usuwamy go
      // res.clearCookie('token');
      // Kontynuujemy proces logowania
    }
  }

  // Jeśli nie ma tokenu lub jest nieważny, przeprowadzamy logowanie
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    // Ustawianie HttpOnly Cookie z tokenem z API Senuto
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dni
    });

    // Ustawianie ciasteczka z emailem użytkownika
    res.cookie('user', email, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dni
    });

    res.json({ user: result.user, message: 'Zalogowano pomyślnie' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
};

exports.getCurrentUser = (req, res) => {
  const token = req.cookies.token;
  const userEmail = req.cookies.user;

  if (!token || !userEmail) {
    return res.status(401).json({ error: 'Użytkownik niezalogowany' });
  }

  res.status(200).json({ user: userEmail });
};

exports.testConnection = async (req, res) => {
  try {
    const result = await authService.testConnection(req.user.token);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
