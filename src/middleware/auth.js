const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  console.log('Token w middleware auth', token);

  if (!token) {
    return res
      .status(401)
      .json({ error: 'Brak autoryzacji, token nie został dostarczony' });
  }

  req.token = token;
  next();
};

module.exports = auth;
