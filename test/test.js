const { util } = require('chai');
const chai = require('chai');
const assert = chai.assert;
const { generateRandomString, getUsersName, filterUrlDatabase, findUserByEmail } = require('../helperFunctions');
const users = require('../data/usersDatabase');
const urlDatabase = require('../data/urlDatabase');
const { adminID } = require('../constants');

describe('finding user ID given an email', () => {
  it(`finds Jack's ID by email`, () => {
    assert.equal(findUserByEmail('some@random.com', users), 'abcdef');
  }),
  it(`finds Jack's ID by email even if spaces are added before and after`, () => {
    assert.equal(findUserByEmail('   some@random.com  ', users), 'abcdef');
  }),
  it(`returns false if the email is not found in database`, () => {
    assert.isFalse(findUserByEmail('abc@abc.com', users));
  })
});

describe('finding a name given a user ID', () => {
  it(`returns null if there is no user login session`, () => {
    assert.isNull(getUsersName(undefined, users));
  }),
  it(`returns null if the user ID is not valid`, () => {
    assert.isNull(getUsersName('454ff2', users));
  }),
  it(`returns with the name Jill when Jill's ID is entered`, () => {
    assert.equal(getUsersName('bcdefg', users), 'Jill');
  })
});

describe('generating random strings', () => {
  it(`returns with a six-character alphanumeric string`, () => {
    assert.match(generateRandomString(), /\w{6}/, 'regexp matches');
  }),
  it(`works a second time`, () => {
    assert.match(generateRandomString(), /\w{6}/, 'regexp matches');
  }),
  it(`works a third time`, () => {
    assert.match(generateRandomString(), /\w{6}/, 'regexp matches');
  })
})

describe('filtering URL database', () => {
  it(`Returns an object`, () => {
    assert.typeOf(filterUrlDatabase('abcdef', urlDatabase, adminID), 'object');
  }),
  it(`When Jack uses the function, the object returned contains a URL Jack made`, () => {
    assert.containsAllKeys(filterUrlDatabase('abcdef', urlDatabase, adminID), ['b2xVn2']);
  }),
  it(`Jack can't access Jill's URLs`, () => {
    assert.doesNotHaveAnyKeys(filterUrlDatabase('abcdef', urlDatabase, adminID), ['9sm5xK']);
  }),
  it(`Admin can access everyone's URLs`, () => {
    assert.containsAllKeys(filterUrlDatabase(adminID, urlDatabase, adminID), ['b2xVn2', '9sm5xK'])
  }),
  it(`No ID, no access to data`, () => {
    assert.isEmpty(filterUrlDatabase('', urlDatabase, adminID));
  }),
  it(`Bad ID, no access to data`, () => {
    assert.isEmpty(filterUrlDatabase('23fs.djfhbgi8y3bt', urlDatabase, adminID));
  })
})