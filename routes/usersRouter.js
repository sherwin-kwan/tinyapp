// This router handles all pages involving users logging in and out or registering a new account.

const express = require('express');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
// Import the database of URLs
const urlDatabase = require('../urlDatabase.js');
const users = require('../usersDatabase.js');
// Import functions for POST requests
const functions = require('../helperFunctions.js');
const { generateRandomString, getUsersName, findUserByEmail } = require('../helperFunctions.js');
const inspect = require('util').inspect;

// Let's make some yummy, delicious delicacies! https://www.squarefree.com/extensions/delicious-delicacies/delicious-1.5.png

router.get('/login', (req, res) => {
  if (req.cookies.user_id) {
    res.send('<html>You are already logged in. Return to <a href="/urls">homepage</a></html>?');
  } else {
    const templateVars = {
      operation: 'Login',
      user_id: null,
      user_name: null
    };
    res.render('userHandling.ejs', templateVars);
  }
})

router.post('/login', (req, res) => {
  const user_id = findUserByEmail(req.body.email);
  if (!user_id) {
    res.status(400).send(`This user doesn't exist. Nice try, hacker!`);
    return;
  };
  if (users[user_id].password !== req.body.password) {
    res.status(403).send('You got the wrong password. Nice try, hacker!');
    return;
  }
  res.cookie('user_id', user_id);
  console.log('Delicious cookie just came hot out of the oven!');
  res.redirect('/urls');
})
// And signing out
router.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
})

// User registration, with actual passwords:
router.get('/register', (req, res) => {
  if (req.cookies.user_id) {
    res.send('<html>You are already logged in. Return to <a href="/urls">homepage</a></html>?');
  } else {
    const templateVars = {
      operation: 'Register',
      user_id: null,
      user_name: null
    };
    res.render('userHandling.ejs', templateVars);
  }
})

router.post('/register', (req, res) => {
  const seeIfUserExists = findUserByEmail(req.body.email);
  // Handles the case where a user attempts to register with an email that already has an account
  if (seeIfUserExists) {
    res.status(400).send('User already exists');
    // res.cookie('user_id', seeIfUserExists);
    // res.redirect('/urls');
    return;
  };
  // If email or password (required fields) aren't filled in.
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Email and password are required');
    return;
  };
  let user_id = '';
  do {
    user_id = generateRandomString();
  } while (Object.keys(users).includes(user_id)); // Avoids duplicates
  users[user_id] = {
    email: req.body.email,
    password: req.body.password
  };
  console.log('New user record is: ' + inspect(users[user_id]));
  res.cookie('user_id', user_id);
  res.redirect('/urls');
})

module.exports = router;