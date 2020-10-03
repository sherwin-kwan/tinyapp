const express = require('express');
const app = express();
const { PORT } = require('./constants');
app.set('view engine', 'ejs');
const router = require('./routes/router.js');
const usersRouter = require('./routes/usersRouter.js');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const mySecretKey = require('./secret-key');
const path = require('path');

const bodyParser = require("body-parser");
// Creating the server
app.listen(PORT, () => {
  console.log('Listening on port 4001!');
});

// Body parser so Buffers can be read as Strings
app.use(bodyParser.urlencoded({extended: true}));

// Stylesheets
app.use(express.static(path.join(__dirname, 'public')));

// Output request log to console
morgan('tiny');

// Set up cookies. 
/*
There should be a file called secret-key.js in the root directory, with the following two lines of code:
const secretKey = <INSERT AN ALPHANUMERIC STRING HERE> 
module.exports = secretKey; */
app.use(cookieSession({
  name: 'session',
  keys: [mySecretKey],
  maxAge: 3600000 // expires after 1 hour
}));

// Routes. Login and registration-related routes are placed into /routes/userRouter.js, everything else in /routes/router.js
app.use('/users/', usersRouter);
app.use(router);


module.exports = { express, app };