const PORT = 4001;
const adminID = 'daroot';
// Hashed passwords. FYI, Plain text passwords for these three people may be found in the release notes
const hash1 = '$2b$08$3j4fDnJ0yg1xfXkW3USBjOAS6CKwy7TIjP0.ROFLt0JgO4DtrHWgG';
const hash2 = '$2b$08$P/AN381JlLr9sRgkRJiE/.9jAfsS09.mdZuA9ChLcMOWlBEaxXHou';
const hash3 = '$2b$08$V3ZjqY9I7HEY2HNN/gFgYO7Jkl90GJ0mBBXHP1CdjfVsnnxa1aWwu';

module.exports = { PORT, adminID, hash1, hash2, hash3 };