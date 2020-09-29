const express = require('express');
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');
const router = require('./routes/router.js');
const urlDatabase = require('./urlDatabase.js');

// Creating the server
app.listen(PORT, () => {
  console.log('Listening on port 8080!');
});

// Body parser so Buffers can be read as Strings
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));


// Routes
app.use('/', router);