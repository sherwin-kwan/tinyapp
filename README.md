# tinyapp

* URL shortener, a simplified clone of Bit.ly.
* This is not production-grade software (notably: it's not even connected to any database, the data is literally stored in a JS object that goes away when you stop the server)
* The stack is: Node + Express + EJS
* This is based on an assignment in the Lighthouse Labs web development course

## Purpose

* This app creates a shortened URL with a six-character string (e.g. */u/f5j78t*) which redirects to another URL
* Once a shortened URL has been created, it's open to the public - anyone can use it and the redirection will work
* However, only the creator of the shortened URL can edit or view the details of that URL

## Screenshots

* Home Page
![](https://github.com/sherwin-kwan/tinyapp/blob/master/docs/mainpage.png)
* Registration Page
![](https://github.com/sherwin-kwan/tinyapp/blob/master/docs/register.png) 
* Error Page
![](https://github.com/sherwin-kwan/tinyapp/blob/master/docs/error.png)

## Release History

Version | Release Date | Notes
---|---|---
1.0.0 | 2020-10-01 | [Notes](https://github.com/sherwin-kwan/tinyapp/blob/master/release-notes/1.0.0.md)
1.0.1 | 2020-10-03 | [Notes](https://github.com/sherwin-kwan/tinyapp/blob/master/release-notes/1.0.1.md)

## How to Run TinyApp

* Before attempting to run Tinyapp, please set up a secret key:
  * create a file called *secret-key.js* in the root project directory
  * assign a secret key of your own choice into a variable, and export it. For example:
  ```javascript
  const secretKey = 'af2j389FjsDfk24rkhgd';
  module.exports = secretKey;
  ```
  * If you are planning to upload the source code afterwards, remember to put the secret key file in *.gitignore* to avoid leaking secret keys onto the Internet
* By default, this application runs on port 4001. If you wish to use a different port, change the constant *PORT* in *constant.js*
* Remember to download Node dependencies with *npm install*
* In case the *package.json* file is not working properly, this is a list of the dependencies for this project:
  * bcrypt
  * body-parser
  * cookie-session
  * ejs
  * express
  * mocha (for testing only)
  * chai (for testing only)
* Other dependencies you may find helpful:
  * morgan
  * nodemon
* Some users have reported issues with installing *bcrypt*. If you are experiencing this, type ```node -v``` to determine the version of Node installed on your system, and [find the corresponding version of bcrypt](https://www.npmjs.com/package/bcrypt) to install (```npm install bcrypt@VERSIONNUM```).
* Once all dependencies have been installed, run the script: ```npm run start```. If that fails, then you may directly run the server with ```node express-server.js```

## Routes

Method|URL|Operation
---|---|---
GET | / | Redirects to /urls if logged in, or /users/login if not
GET | /urls/create | Retrieve form to create a new short URL 
POST | /urls/create | Submit form to create a new short URL 
GET | /urls | Browse through all short URLs
GET | /url/:id | Read details for a single short URL
GET | /url/edit/:id | Retrieve form to edit an existing short URL
POST | /url/edit/:id | Submit form to edit an existing short URL
POST | /url/delete/:id | Permanently delete a short URL
GET | /users/login | Retrieve login page
POST | /users/login | Log in
GET | /users/register | Retrieve new user registration page
POST | /users/register | Submit details to register a new user
POST | /users/logout | Log out


## Copyright Notice

This was created by Sherwin Kwan as part of a Lighthouse Labs assignment. This is available as-is, with no warranty, etc. you know the drill. [License here](https://github.com/sherwin-kwan/tinyapp/blob/master/LICENSE)
