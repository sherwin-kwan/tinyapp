/* Remaining issues

1) CSS not working
3) Hiding password text
4) Following user stories

*/

const express = require('express');
const app = express();
const { PORT } = require('constants');
app.set('view engine', 'ejs');
const router = require('./routes/router.js');
const usersRouter = require('./routes/usersRouter.js');
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const morgan = require('morgan');

const bodyParser = require("body-parser");
// Creating the server
app.listen(PORT, () => {
  console.log('Listening on port 4001!');
});

// Body parser so Buffers can be read as Strings
app.use(bodyParser.urlencoded({extended: true}));

// Stylesheets
app.use(express.static('public'));

// Output request log to console
morgan('tiny');

// Routes
app.use('/', router);
app.use('/users/', usersRouter);

// Cookies are delicious delicacies  https://www.squarefree.com/extensions/delicious-delicacies/delicious-1.5.png

app.use(cookieSession({
  name: 'session',
  keys: ['abcde'],
  maxAge: 120000 // expires after 2 minutes
}));

module.exports = { express, app };