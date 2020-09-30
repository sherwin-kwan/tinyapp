const express = require('express');
const app = express();
const router = express.Router();
const cookieParser = require('cookie-parser');
// Import the database of URLs
const urlDatabase = require('../urlDatabase.js');
const users = require('../usersDatabase.js');
// Import functions for POST requests
const functions = require('../helperFunctions.js');
const { generateRandomString, findUserByEmail } = require('../helperFunctions.js');
const { exists } = require('fs');
const inspect = require('util').inspect;

app.use(cookieParser());

/// HOMEPAGE ///

router.get('/', (req, res) => {
  res.redirect('/urls');
});

// CREATE new URLs
router.get('/urls/new', (req, res) => {
  const templateVars = { operation: 'Create', user_id: req.cookies.user_id };
  res.render("urls_new", templateVars);
})

router.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  let randomShortURL;
  do {
    randomShortURL = generateRandomString();
  } while (Object.keys(urlDatabase).includes(randomShortURL)); // Avoids duplicates
  urlDatabase[randomShortURL] = longURL;
  console.log(urlDatabase);
  res.redirect(`/url/${randomShortURL}`);
});

// READ URLs
router.get('/urls', (req, res) => {
  console.log(inspect(req.cookies));
  const templateVars = {
    urlDatabase,
    operation: 'Browse',
    user_id: req.cookies.user_id
  };
  console.log(templateVars.user_id);
  res.render("urls_index", templateVars);
})

// SEE DETAIL for a single URL
router.get('/url/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    operation: 'Read',
    user_id: req.cookies.user_id
  };
  res.render('../views/urls_detail.ejs', templateVars);
})

// UPDATE URLs
router.get('/edit/:id', (req, res) => {
  const templateVars = {
    shortURL: req.params.id,
    longURL: urlDatabase[req.params.id],
    operation: 'Update',
    user_id: req.cookies.user_id
  };
  res.render('urls_new', templateVars);
})

router.post('/edit/:id', (req, res) => {
  const longURL = req.body.longURL;
  urlDatabase[req.params.id] = longURL;
  res.redirect(`/url/${req.params.id}`)
})

// DELETE URLs
router.post('/delete/:id', (req, res) => {
  delete urlDatabase[req.params.id];
  const templateVars = { urlDatabase };
  res.redirect('/urls');
})

// Redirect when a shortURL is entered
router.get('/u/:id', (req, res) => {
  res.redirect(urlDatabase[req.params.id]);
  // Note: This only works if the http:// protocol is specified, otherwise it thinks it's a local file called google.ca!
})

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
    user_id: req.cookies.user_id
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

// Providing an API which exposes the url list to be fetched via JSON
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

// TEST PAGES (not actually used for Tinyapp)
router.get('/hello-world.html', (req, res) => {
  res.send('<html><head><title>Hello world</title></head><body>Hello world</body></html>');
})

router.get('/testing.html', (req, res) => {
  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
    { name: 'Tux', organization: "Linux", birth_year: 1996 },
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";
  res.render('testIndex', {
    mascots: mascots,
    tagline: tagline
  });
  res.render('testIndex.ejs');
})

// Example code showing what happens when you call variables out of scope
router.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

router.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
// END OF TEST PAGES

module.exports = router;