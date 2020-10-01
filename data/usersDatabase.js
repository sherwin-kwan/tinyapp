const hash1 = '$2b$08$3j4fDnJ0yg1xfXkW3USBjOAS6CKwy7TIjP0.ROFLt0JgO4DtrHWgG';
const hash2 = '$2b$08$P/AN381JlLr9sRgkRJiE/.9jAfsS09.mdZuA9ChLcMOWlBEaxXHou';
const hash3 = '$2b$08$V3ZjqY9I7HEY2HNN/gFgYO7Jkl90GJ0mBBXHP1CdjfVsnnxa1aWwu';

// FYI: Plain text passwords for these three people may be found in the release notes

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
