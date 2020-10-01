const bcrypt = require('bcrypt');
const hash1 = bcrypt.hashSync('hunter2', 8);
const hash2 = bcrypt.hashSync('correct-horse', 8);
const hash3 = bcrypt.hashSync('battery-staple', 8);

console.log(hash1, hash2, hash3);
console.log(bcrypt.compareSync('hunter2', hash1));

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
