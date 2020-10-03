// This router handles all pages involving users logging in and out or registering a new account.

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
// Import the database of URLs
const users = require('../data/usersDatabase.js');
// Import functions for POST requests
const { generateRandomString, findUserByEmail, defaultTemplateVars } = require('../helperFunctions.js');

// Login GET route
router.get('/login', (req, res) => {
  const templateVars = defaultTemplateVars();
  if (req.session.userID) {
    templateVars.message = 'You are already logged in. Return to <a href="/urls">homepage</a>?';
    res.status(400).render('error', templateVars);
  } else {
    templateVars.operation = 'Login';
    res.render('userHandling.ejs', templateVars);
  }
});

// Submit the login form
router.post('/login', (req, res) => {
  const userID = findUserByEmail(req.body.email, users);
  const templateVars = defaultTemplateVars();
  // Two checks: 1) does the user exist? 2) does the user enter the correct password?
  if (!userID) {
    templateVars.message = `Your email does not appear in our database. Perhaps you need to create an account?`;
    res.status(403).render('error', templateVars);
    return;
  }
  if (!bcrypt.compareSync(req.body.password, users[userID].password)) {
    templateVars.message = `Sorry, email and password do not match. Please try again.`;
    res.status(403).render('error', templateVars);
    return;
  }
  // If email and password check out, log the user in and create a session cookie
  req.session.userID = userID;
  res.redirect('/urls');
});

// And signing out
router.post('/logout', (req, res) => {
  req.session = null; // Clears the session cookie
  res.redirect('/urls');
});

// User registration, with actual passwords:
router.get('/register', (req, res) => {
  const templateVars = defaultTemplateVars();
  // Check if the user is already logged in (i.e. has a session ID)
  if (req.session.userID) {
    templateVars.message = 'You are already logged in. Return to <a href="/urls">homepage</a>?';
    res.status(400).render('error', templateVars);
  } else {
    templateVars.operation = 'Register';
    res.render('userHandling.ejs', templateVars);
  }
});

router.post('/register', (req, res) => {
  const seeIfUserExists = findUserByEmail(req.body.email, users);
  // Handles the case where a user attempts to register with an email that already has an account
  if (seeIfUserExists) {
    res.status(400).send(`<html>Welcome back, ${users[seeIfUserExists].name}, you actually already have an account. <a href="/users/login">Sign in</a></html>?`);
    return;
  }
  // If email or password (required fields) aren't filled in. This should probably be done with client-side validation but we haven't learned it yet.
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send('Name, email, and password are required');
    return;
  }
  let userID = '';
  // Generate a random user ID, and make sure to avoid duplicates (in case of the one-in-a-million chance it's already used)
  do {
    userID = generateRandomString();
  } while (Object.keys(users).includes(userID));
  // Save the new user into database
  users[userID] = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  };
  req.session.userID = userID;
  res.redirect('/urls');
});

module.exports = router;