const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
}

// // TEST
// for (let i = 0; i < 10; i++) {
//   console.log(generateRandomString());
// }

module.exports = { generateRandomString };