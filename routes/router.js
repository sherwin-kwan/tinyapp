const express = require('express');
const app = express();
console.log('app is: ' + app);
const router = express.Router();
const cookieParser = require('cookie-parser');
// Import the database of URLs
const urlDatabase = require('../data/urlDatabase.js');
const users = require('../data/usersDatabase.js');
// Import functions for POST requests
const { generateRandomString, getUsersName, filterUrlDatabase } = require('../helperFunctions.js');
const inspect = require('util').inspect;

console.log(app);
app.use(cookieParser());

// Making code DRY - this global variable saves the default template variables passed to EJS
// If no req is passed, 
const defaultTemplateVars = (userID) => {
  const def = {
    operation: 'Placeholder',
    userID: userID,
    userName: getUsersName(userID)
  };
  const notLoggedIn = {
    operation: 'Not logged in',
    userID: null,
    userName: null,
    message: 'Placeholder'
  };
  return (userID) ? def : notLoggedIn;
}

/// HOMEPAGE ///

router.get('/', (req, res) => {
  res.redirect('/urls');
});

// CREATE new URLs - only for logged-in users
router.get('/urls/new', (req, res) => {
  let templateVars = defaultTemplateVars(req.cookies.userID);
  if (req.cookies.userID) {
    templateVars.operation = 'Create';
    res.render("urls_new", templateVars);
  } else { 
    // When user isn't logged in, they are given an error page and asked to log in or register.
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.render('error', templateVars);
    return;
  }
});

router.post('/urls/new', (req, res) => {
  if (!req.cookies.userID) {
    let templateVars = defaultTemplateVars();
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.render('error', templateVars);
    return;
  };
  const longURL = req.body.longURL;
  let randomShortURL;
  do {
    randomShortURL = generateRandomString();
  } while (Object.keys(urlDatabase).includes(randomShortURL)); // Avoids duplicates
  urlDatabase[randomShortURL].longURL = longURL;
  console.log(urlDatabase);
  res.redirect(`/url/${randomShortURL}`);
});

// READ URLs
router.get('/urls', (req, res) => {
  console.log(inspect(req.cookies));
  let templateVars = defaultTemplateVars(req.cookies.userID);
  templateVars.urlDatabase = filterUrlDatabase(req.cookies.userID);
  templateVars.operation = 'Browse';
  res.render("urls_index", templateVars);
});

// SEE DETAIL for a single URL
router.get('/url/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    operation: 'Read',
    userID: req.cookies.userID,
    userName: getUsersName(req.cookies.userID)
  };
  res.render('../views/urls_detail.ejs', templateVars);
});

// UPDATE URLs
router.get('/edit/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id].longURL,
    operation: 'Update',
    userID: req.cookies.userID,
    userName: getUsersName(req.cookies.userID)
  };
  res.render('urls_new', templateVars);
});

router.post('/edit/:id', (req, res) => {
  const longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;
  res.redirect(`/url/${req.params.id}`);
});

// DELETE URLs
router.post('/delete/:id', (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls');
});

// Redirect when a shortURL is entered
router.get('/u/:id', (req, res) => {
  res.redirect(urlDatabase[req.params.id].longURL);
  // Note: This only works if the http:// protocol is specified, otherwise it thinks it's a local file called google.ca!
});

// Providing an API which exposes the url list to be fetched via JSON
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// A generic page to catch errors
router.get('/error', (req, res) => {
  const templateVars = {
    operation: 'Error',
    userID: req.cookies.userID || null,
    userName:  getUsersName(req.cookies.userID),
    message: null
  };
  res.render('error.ejs', templateVars);
})

module.exports = router;