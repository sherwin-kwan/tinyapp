const generateRandomString = () => {
  return Math.random().toString(36).slice(2);
}

// TEST
// for (let i = 0; i < 10; i++) {
//   generateRandomString();
// }

module.exports = { generateRandomString };