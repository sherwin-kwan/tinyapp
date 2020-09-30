const express = require('express');
const app = express();

const PORT = 8080;
app.set('view engine', 'ejs');
const router = require('./routes/router.js');
const usersRouter = require('./routes/usersRouter.js');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const bodyParser = require("body-parser");
// Creating the server
app.listen(PORT, () => {
  console.log('Listening on port 8080!');
});

// Body parser so Buffers can be read as Strings
app.use(bodyParser.urlencoded({extended: true}));

// Cookie parser to handle user cookies
app.use(cookieParser());

// Output request log to console
morgan('tiny');

// Routes
app.use('/', router);
app.use('/users/', usersRouter);

module.exports = { express, app };