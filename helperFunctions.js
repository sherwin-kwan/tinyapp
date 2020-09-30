const users = require('./data/usersDatabase.js');
const urlDatabase = require('./data/urlDatabase.js');

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
};

// Finds the id property of a user given an email
const findUserByEmail = (email) => {
  for (let userID in users) {
    if (users[userID].email === email.trim()) {
      return userID;
    }
  }
  return false;
};

const filterUrlDatabase = (userID) => {
  let output = new Object;
  // Yes, I'm hard-coding this function to use a particular database. I don't want to overdo things by making things more modular.
  if (userID === 'daroot') {
    // 'Daroot' is an admin account that can read, edit, and delete everyone's URLs
    return urlDatabase;
  }
  for (let shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === userID) {
      output[shortURL] = urlDatabase[shortURL];
    }
  }
  return output;
};

console.log(filterUrlDatabase('abcdef'));

// A variable that gives the user's name if they are logged in, or is null when they are not
const getUsersName = (id) => {
  return (users[id]) ? users[id].name : null;
};

// // TEST
// for (let i = 0; i < 10; i++) {
//   console.log(generateRandomString());
// }

module.exports = { generateRandomString, getUsersName, filterUrlDatabase, findUserByEmail };