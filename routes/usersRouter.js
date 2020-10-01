// This router handles all pages involving users logging in and out or registering a new account.

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
// Import the database of URLs
const users = require('../data/usersDatabase.js');
// Import functions for POST requests
const { generateRandomString, findUserByEmail } = require('../helperFunctions.js');
const inspect = require('util').inspect;

// Let's make some yummy, delicious delicacies!

router.get('/login', (req, res) => {
  if (req.session.userID) {
    res.send('<html>You are already logged in. Return to <a href="/urls">homepage</a></html>?');
  } else {
    const templateVars = {
      operation: 'Login',
      userID: null,
      userName: null
    };
    res.render('userHandling.ejs', templateVars);
  }
});

router.post('/login', (req, res) => {
  const userID = findUserByEmail(req.body.email);
  if (!userID) {
    res.status(403).send(`This user doesn't exist. Nice try, hacker!`);
    return;
  }
  if (!bcrypt.compareSync(req.body.password, users[userID].password)) {
    res.status(403).send('You got the wrong password. Nice try, hacker!');
    return;
  }
  req.session.userID = userID;
  console.log('Delicious cookie just came hot out of the oven!');
  res.redirect('/urls');
});

// And signing out
router.post('/logout', (req, res) => {
  res.clearCookie('userID');
  res.redirect('/urls');
});

// User registration, with actual passwords:
router.get('/register', (req, res) => {
  if (req.session.userID) {
    res.send('<html>You are already logged in. Return to <a href="/urls">homepage</a></html>?');
  } else {
    const templateVars = {
      operation: 'Register',
      userID: null,
      userName: null
    };
    res.render('userHandling.ejs', templateVars);
  }
});

router.post('/register', (req, res) => {
  const seeIfUserExists = findUserByEmail(req.body.email);
  // Handles the case where a user attempts to register with an email that already has an account
  if (seeIfUserExists) {
    res.status(400).send(`<html>Welcome back, ${users[seeIfUserExists].name}, you actually already have an account. <a href="/users/login">Sign in</a></html>?`);
    return;
  }
  // If email or password (required fields) aren't filled in.
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400).send('Name, email, and password are required');
    return;
  }
  let userID = '';
  do {
    userID = generateRandomString();
  } while (Object.keys(users).includes(userID)); // Avoids duplicates
  users[userID] = {
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  };
  console.log('New user record is: ' + inspect(users));
  req.session.userID = userID;
  res.redirect('/urls');
});


module.exports = router;