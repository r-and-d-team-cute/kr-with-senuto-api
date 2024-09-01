const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const apiRoutes = require('./routes/api');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// app.use(
//   cors({
//     origin: 'https://strategiczny-kr-senuto.onrender.com/',
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   })
// );

const allowedOrigins = ['https://strategiczny-kr-senuto.onrender.com'];

app.use(
  cors({
    origin: function (origin, callback) {
      // Pozwól żądaniom bez origin (np. mobilne aplikacje, narzędzia curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true, // Pozwól na przekazywanie credentials (np. cookies)
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', apiRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
