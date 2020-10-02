# tinyapp

* URL shortener, a simplified clone of Bit.ly. *(just saying that because it's the most well-known one, I have no affiliation with Bitly Inc. and am not a shill. I promise.)*
* This is not production-grade software (notably: it's not even connected to any database, the data is literally stored in a JS object that goes away when you stop the server)
* The stack is: Node + Express + EJS
* This is based on an assignment in the Lighthouse Labs web development course

## Purpose

* This app creates a shortened URL with a six-character string (e.g. */u/f5j78t*) which redirects to another URL
* Once a shortened URL has been created, it's open to the public - anyone can use it and the redirection will work
* However, only the creator of the shortened URL can edit or view the details of that URL

## Screenshots
* ![Home Page]('./docs/mainPage.png)
* ![Registration Page]('./docs/register.png)
* ![Error Page]('./docs/error.png)

## Release History

Version | Release Date | Notes
---|---|---
1.0.0 | 2020-10-01 | [Notes](https://github.com/sherwin-kwan/tinyapp/blob/master/release-notes/1.0.0.md)

## Deploying Notes

* Before attempting to compile and run Tinyapp, please set up a secret key:
  * create a file called *secret-key.js* in the root project directory
  * assign a secret key of your own choice into a variable, and *module.exports* it
  * If you are planning to upload source code, remember to put the secret key file in *.gitignore* to avoid leaking secret keys onto the Internet
* By default, this application runs on port **4001**. If you wish to use a different port, change the constant *PORT* in *constants.js*
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


## Routes

Method|URL|Operation
---|---|---
GET | / | Redirects to /urls
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

This is [open-source software](https://github.com/sherwin-kwan/tinyapp/blob/master/LICENSE), which means you can't be sued for copying this code and using it in your own apps. I just wouldn't recommend it though, I made this in a few days and it's not exactly made to best practices. NO WARRANTY, PROVIDED AS-IS, you know the drill ...
