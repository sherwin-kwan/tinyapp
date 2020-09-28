const express = require('express');
const app = express();
const PORT = 8080;
app.set('view engine', 'ejs');

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get('/', (req, res) => {
  res.send("Hello world");
});

app.listen(PORT, () => {
  console.log('Listening on port 8080!');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello.html', (req, res) => {
  res.send('<html><head><title>Hello world</title></head><body>Hello world</body></html>');
})

app.get('/about', (req, res) => {
  res.render('/about.ejs');
})

app.get('/testing.html', (req, res) => {
  const mascots = [
    { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
    { name: 'Tux', organization: "Linux", birth_year: 1996 },
    { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
  ];
  const tagline = "No programming concept is complete without a cute animal mascot.";
  res.render('index', {
    mascots: mascots,
    tagline: tagline
  });
  res.render('index.ejs');
})

app.get("/set", (req, res) => {
  const a = 1;
  res.send(`a = ${a}`);
});

app.get("/fetch", (req, res) => {
  res.send(`a = ${a}`);
});
