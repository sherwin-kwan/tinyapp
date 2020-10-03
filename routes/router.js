const express = require('express');
const router = express.Router();
// Import the database of URLs
const urlDatabase = require('../data/urlDatabase.js');
const users = require('../data/usersDatabase.js');
const { adminID } = require('../constants');
// Import functions for POST requests
const { generateRandomString, getUsersName, defaultTemplateVars, filterUrlDatabase } = require('../helperFunctions.js');
const inspect = require('util').inspect;

/// HOMEPAGE ///

router.get('/', (req, res) => {
  // By default, logged-in users are sent to the URLs list page, and anonymous users are sent to the login page
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.redirect('/users/login');
  }
});

// CREATE new URLs - only for logged-in users
router.get('/urls/create', (req, res) => {
  const templateVars = defaultTemplateVars(req.session.userID);
  if (req.session.userID) {
    templateVars.operation = 'Create';
    res.render("urls_createOrEdit", templateVars);
  } else {
    // When user isn't logged in, they are given an error page and asked to log in or register.
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.status(403).render('error', templateVars);
    return;
  }
});

router.post('/urls/create', (req, res) => {
  if (!req.session.userID) {
    const templateVars = defaultTemplateVars();
    templateVars.message = 'Please log in before creating a new shortened URL.';
    res.status(403).render('error', templateVars);
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
  // Check if user is already logged in
  const templateVars = defaultTemplateVars(req.session.userID);
  if (req.session.ID) {
    // This queries the database to only return those documents which the user has access to
    const filtered = filterUrlDatabase(req.session.userID, urlDatabase, adminID);
    // Inserts a name property into the filtered data (this would normally be done in other ways with real SQL)
    for (const shortURL in filtered) {
      filtered[shortURL].userName = getUsersName(filtered[shortURL].userID, users);
    }
    templateVars.filtered = filtered;
    Object.assign(templateVars, {
      operation: 'Browse',
      message: `Behold, all the shortened URLs you've created are listed below!`
    });
    res.render("urls_index", templateVars);
  } else { // User does not have permission to view
    templateVars.message = 'Please sign in to begin creating short URLs.';
    res.status(403).render('error', templateVars);
  }
});

// READ a single URL document in the database
router.get('/url/:id', (req, res) => {
  const templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  const document = urlDatabase[req.params.id];
  if (!document) {
    templateVars.message = 'This is not a valid shortURL ID found in our database';
    res.status(404).render('error', templateVars);
  }
  if (req.session.userID === document.userID || req.session.userID === adminID) {
    Object.assign(templateVars, {
      shortURL: req.params.id,
      longURL: document.longURL,
      operation: 'Read'
    });
    res.render('urls_detail', templateVars);
  } else { // User does not have permission to view
    templateVars.message = 'You do not have permission to view or edit this URL because you did not create it.';
    res.status(403).render('error', templateVars);
  }
});

// UPDATE URLs
router.get('/url/edit/:id', (req, res) => {
  const templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  const document = urlDatabase[req.params.id];
  if (!document) {
    templateVars.message = 'This is not a valid shortURL ID found in our database';
    res.status(404).render('error', templateVars);
  }
  if (req.session.userID === document.userID || req.session.userID === adminID) {
    Object.assign(templateVars, {
      shortURL: req.params.id,
      longURL: document.longURL,
      operation: 'Update',
    });
    res.render('urls_createOrEdit', templateVars);
  } else { // User does not have permission to edit
    templateVars.message = 'You do not have permission to view or edit this URL because you did not create it.';
    res.status(403).render('error', templateVars);
  }
});

router.post('/url/edit/:id', (req, res) => {
  const templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  const document = urlDatabase[req.params.id]; // This should be a pointer, so modifying 'document' modifies the actual document in the database
  if (!document) {
    templateVars.message = 'You tried to post to an invalid shortURL ID';
    res.status(404).render('error', templateVars);
  }
  if (req.session.userID === document.userID || req.session.userID === adminID) {
    document.longURL = req.body.longURL;
      res.redirect(`/url/${req.params.id}`);
  } else {
    templateVars.message = 'You do not have permission to view or edit this URL because you did not create it.';
    res.status(403).render('error', templateVars);
  }
});

// DELETE URLs
router.post('/url/delete/:id', (req, res) => {
  const templateVars = defaultTemplateVars(req.session.userID);
  // Check to make sure the current user has access to the requested document in the database
  // (i.e. was the creator of this URL, or is admin)
  const document = urlDatabase[req.params.id]; // This should be a pointer, so modifying 'document' modifies the actual document in the database
  if (!document) {
    templateVars.message = 'Sorry, cannot delete. In fact, this shortURL never existed.';
    res.render('error', templateVars);
  }
  if (req.session.userID === document.userID || req.session.userID === adminID) {
    delete urlDatabase[req.params.id];
    res.redirect(`/urls`);
  } else {
    templateVars.message = 'You can only delete URLs that you created.';
    res.status(404).render('error', templateVars);
  }
});

// Redirect when a shortURL is entered
router.get('/u/:id', (req, res) => {
  try {
    res.redirect(urlDatabase[req.params.id].longURL);
  } catch (err) {
    const templateVars = defaultTemplateVars();
    templateVars.message = 'This is an invalid shortURL link. Please ask the person who sent it to you to check whether they spelled the URL correctly.';
    res.status(404).render('error', templateVars);
  }
  // Note: This only works if the http:// protocol is specified, otherwise it thinks it's a local file called google.ca!
});

// Providing an API which exposes the url list to be fetched via JSON
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// Catch-all error page (if a gibberish URL is requested that doesn't fall into any of the preceding paths)

router.use((req, res) => {
  res.status(404).render('error');
  const templateVars = defaultTemplateVars(req.session.userID);
  templateVars.message = `The page you're looking for could not be found.`;
  res.render('error.ejs', templateVars);
});

module.exports = router;