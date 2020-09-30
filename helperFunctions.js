const users = require('./usersDatabase.js');

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
}

// Finds the id property of a user given an email
const findUserByEmail = (email) => {
  for (let user_id in users) {
    if (users[user_id].email === email.trim()) {
      return user_id;
    }
  }
  return false;
}

// A variable that gives the user's name if they are logged in, or is null when they are not
const getUsersName = (id) => {
  return (users[id]) ? users[id].name : null;
}

// // TEST
// for (let i = 0; i < 10; i++) {
//   console.log(generateRandomString());
// }

module.exports = { generateRandomString, getUsersName, findUserByEmail };