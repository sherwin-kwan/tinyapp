// NOTE: This is random stuff I wrote to tinker with how Express works. This code is not related to Tinyapp at all.
// This legacy code will be removed in a future version of Tinyapp.

// router.get('/hello-world.html', (req, res) => {
//   res.send('<html><head><title>Hello world</title></head><body>Hello world</body></html>');
// });

// router.get('/testing.html', (req, res) => {
//   const mascots = [
//     { name: 'Sammy', organization: "DigitalOcean", birth_year: 2012 },
//     { name: 'Tux', organization: "Linux", birth_year: 1996 },
//     { name: 'Moby Dock', organization: "Docker", birth_year: 2013 }
//   ];
//   const tagline = "No programming concept is complete without a cute animal mascot.";
//   res.render('testIndex', {
//     mascots: mascots,
//     tagline: tagline
//   });
//   res.render('testIndex.ejs');
// });

// Example code showing what happens when you call variables out of scope
// router.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });

// router.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });
// END OF TEST PAGES