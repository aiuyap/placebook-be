const express = require('express');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  throw new HttpError('Route not found', 404);
});

//err handler
app.use((err, req, res, next) => {
  if (res.headerSent) {
    return next(err);
  }

  res
    .status(err.code || 500)
    .json({ message: err.message || 'Internal Server Error' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT http://localhost:${PORT}!`);
});
