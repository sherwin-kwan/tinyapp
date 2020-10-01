
const { hash1, hash2, hash3 } = require('../constants');

const users = {
  abcdef: {
    name: 'Jack',
    email: 'some@random.com',
    password: hash1
  },
  bcdefg: {
    name: 'Jill',
    email: 'example@example.edu',
    password: hash2
  },
  daroot: {
    name: 'Boss',
    email: 'daroot@theboss.com',
    password: hash3
  }
};

module.exports = users;
