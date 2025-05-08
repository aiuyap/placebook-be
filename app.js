const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}!`);
});
