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
router.post('/login', (req, res) => {
  const user_id = findUserByEmail(req.body.email);
  if (!user_id) {
    throw new Error(`This user doesn't exist. Nice try, hacker!`);
  };
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
  templateVars = {
    user_id: req.cookies.user_id,
    user_name: users[req.cookies.user_id].name || undefined
  }
  res.render('register.ejs', templateVars);
})

router.post('/register', (req, res) => {
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