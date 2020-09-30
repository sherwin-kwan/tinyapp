const users = require('./usersDatabase.js');

const generateRandomString = () => {
  return Math.random().toString(36).slice(2, 8);
}

const findUserByEmail = (email) => {
  for (let user_id in users) {
    if (users[user_id].email === email.trim()) {
      return user_id;
    }
  }
  return false;
}

// // TEST
// for (let i = 0; i < 10; i++) {
//   console.log(generateRandomString());
// }

module.exports = { generateRandomString, findUserByEmail };