const express = require('express');

const placesRoutes = require('./routes/places-routes');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api/places', placesRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}!`);
});
