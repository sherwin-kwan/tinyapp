const express = require('express');
const router = express.Router();
const cookieSession = require('cookie-session');
// Import the database of URLs
const urlDatabase = require('../data/urlDatabase.js');
const users = require('../data/usersDatabase.js');
const { adminID } = require('../constants');
// Import functions for POST requests
const { generateRandomString, getUsersName, defaultTemplateVars, filterUrlDatabase } = require('../helperFunctions.js');
const inspect = require('util').inspect;

/// HOMEPAGE ///

router.get('/', (req, res) => {
  res.redirect('/urls');
});

// CREATE new URLs - only for logged-in users
router.get('/urls/create', (req, res) => {
  let templateVars = defaultTemplateVars(req.session.userID);
  if (req.session.userID) {
    templateVars.operation = 'Create';
    res.render("urls_createOrEdit", templateVars);
  } else {
    // When user isn't logged in, they are given an error page and asked to log in or register.
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.render('error', templateVars);
    return;
  }
});

router.post('/urls/create', (req, res) => {
  if (!req.session.userID) {
    let templateVars = defaultTemplateVars();
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.render('error', templateVars);
    return;
  }
  let randomShortURL;
  do {
    randomShortURL = generateRandomString();
  } while (Object.keys(urlDatabase).includes(randomShortURL)); // Avoids duplicates
  urlDatabase[randomShortURL] = {
    userID: req.session.userID,
    longURL: req.body.longURL
  };
  res.redirect(`/url/${randomShortURL}`);
});

// READ (BROWSE) all URLs
router.get('/urls', (req, res) => {
  console.log(req.session.userID, ' NOW ITS THIS');
  let templateVars = defaultTemplateVars(req.session.userID);
  const filtered = filterUrlDatabase(req.session.userID, urlDatabase, adminID);
  // Inserts a name property into the filtered data (this would normally be done in other ways with real SQL)
  for (let shortURL in filtered) {
    filtered[shortURL].userName = getUsersName(filtered[shortURL].userID, users);
  };
  templateVars.filtered = filtered;
  if (req.session.userID) {
    Object.assign(templateVars, {
      operation: 'Browse',
      message: `Behold, all the shortened URLs you've created are listed below!`
    });
  } else {
    Object.assign(templateVars, {
      operation: 'Welcome',
      message: `Please <a href="/users/login">log in</a> or <a href="/users/register">register</a> to begin, 
      you won't be able to see any URLs here until you do.`
    });
  }
  res.render("urls_index", templateVars);
});

// READ a single URL document in the database
router.get('/url/:id', (req, res) => {
  let templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  let document = urlDatabase[req.params.id];
  switch (req.session.userID) {
  case document.userID:
  case 'daroot':
    Object.assign(templateVars, {
      shortURL: req.params.id,
      longURL: document.longURL,
      operation: 'Read'
    });
    res.render('urls_detail', templateVars);
    break;
  default:
    templateVars.message = 'You can only view details for URLs that you created.';
    res.render('error', templateVars);
  }
});

// UPDATE URLs
router.get('/url/edit/:id', (req, res) => {
  let templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  let document = urlDatabase[req.params.id];
  switch (req.session.userID) {
  case document.userID:
  case 'daroot':
    Object.assign(templateVars, {
      shortURL: req.params.id,
      longURL: document.longURL,
      operation: 'Update',
    });
    res.render('urls_createOrEdit', templateVars);
    break;
  default:
    templateVars.message = 'You can only update details for URLs that you created.';
    res.render('error', templateVars);
  }
});

router.post('/url/edit/:id', (req, res) => {
  let templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  let document = urlDatabase[req.params.id]; // This should be a pointer, so modifying 'document' modifies the actual document in the database
  switch (req.session.userID) {
  case document.userID:
  case 'daroot':
    document.longURL = req.body.longURL;
    res.redirect(`/url/${req.params.id}`);
    break;
  default:
    templateVars.message = 'You can only update details for URLs that you created.';
    res.render('error', templateVars);
  }
});

// DELETE URLs
router.post('/url/delete/:id', (req, res) => {
  let templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  let document = urlDatabase[req.params.id]; // This should be a pointer, so modifying 'document' modifies the actual document in the database
  switch (req.session.userID) {
  case document.userID:
  case 'daroot':
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);
    break;
  default:
    templateVars.message = 'You can only delete URLs that you created.';
    res.render('error', templateVars);
  }
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

// Handling error paths

router.use((req, res) => {
  res.status(404).render('error');
  const templateVars = defaultTemplateVars(req.session.userID);
  templateVars.message = `The page you're looking for could not be found.`
  res.render('error.ejs', templateVars);
});

module.exports = router;