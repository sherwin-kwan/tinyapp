// const users = require('./data/usersDatabase.js');
// const urlDatabase = require('./data/urlDatabase.js');

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
};

// This function finds documents in a JS object database matching a particular userID.
// Yes, it's hard-coded and not modular. But come on man, this is a student project finished in 3 days, don't expect too much.
// If I was writing this properly, it would be connected to an actual database and I'd be able to use real queries instead of this
// crappy hacked-together workaround.
const filterUrlDatabase = (userID, db, adminID) => {
  let output = new Object;
  if (userID === adminID) {
    // Admin accounts can read, edit, and delete everyone's URLs
    return db;
  }
  for (let shortURL in db) {
    if (db[shortURL].userID === userID) {
      output[shortURL] = db[shortURL];
    }
  }
  return output;
};

// Finds the id property of a user given an email in a database
const findUserByEmail = (email, db) => {
  for (let userID in db) {
    if (db[userID].email === email.trim()) {
      return userID;
    }
  }
  return false;
};

// console.log(filterUrlDatabase('abcdef'));

// A variable that gives the user's name if they are logged in, or is null when they are not
// Again, it's a workaround because I'm not using a real database where I get to use queries and JOIN statements
const getUsersName = (id, db) => {
  return (db[id]) ? db[id].name : null;
};

// // TEST
// for (let i = 0; i < 10; i++) {
//   console.log(generateRandomString());
// }

module.exports = { generateRandomString, getUsersName, filterUrlDatabase, findUserByEmail };