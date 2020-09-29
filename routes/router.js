var express = require('express');
var router = express.Router();
// Import the database of URLs
const urlDatabase = require('../urlDatabase.js');

/// HOMEPAGE ///

router.get('/', (req, res) => {
  res.send("Hello world");
});

router.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
})

// Providing an API which allows the url list to be fetched via JSON
router.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

router.get('/url/:shortURL', (req, res) => {
  const templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('../views/urls_detail.ejs', templateVars);
})

// TEST PAGES
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