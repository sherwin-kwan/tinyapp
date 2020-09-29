const express = require('express');
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
const router = require('./routes/router.js');
const urlDatabase = require('./urlDatabase.js');

app.listen(PORT, () => {
  console.log('Listening on port 8080!');
});

// Routes
app.use('/', router);