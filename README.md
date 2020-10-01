# tinyapp

* URL shortener, a simplified clone of (say) Bit.ly
* This app is currently NOT connected to a database, all data is stored on the server and disappears when the server is closed. This is not production-grade software, so don't actually use it expecting those shortened URLs to be usable long-term!
* The stack is: Node + Express + EJS

## Deploying Notes

* Before attempting to compile and run Tinyapp, please set up a secret key:
  * create a file called *secret-key.js* in the root project directory
  * assign a secret key of your own choice into a variable, and *module.exports* it
  * If you are planning to upload source code, remember to put the secret key file in *.gitignore* to avoid leaking secret keys onto the Internet
* By default, this application runs on port 4001. If you wish to use a different port, change the constant *PORT* in *espress-server.js*

## Known Issues

* Layout for many pages is subpar. This app was meant to practice Express and CRUD operations, CSS was not a priority.
* I have also had trouble getting browsers to recognise the custom stylesheet placed in */public/style/style.css*
* Password fields are not recognised as password fields in browsers

## Routes

Method|URL|Operation
---|---|---
GET | /urls/create | Retrieve form to create a new short URL 
POST | /urls/create | Submit form to create a new short URL 
GET | /urls | Browse through all short URLs
GET | /url/:id | Read details for a single short URL
GET | /url/edit/:id | Retrieve form to edit an existing short URL
POST | /url/edit/:id | Submit form to edit an existing short URL
POST | /delete/:id | Permanently delete a short URL
GET | /users/login | Retrieve login page
POST | /users/login | Log in
GET | /users/register | Retrieve new user registration page
POST | /users/register | Submit details to register a new user
POST | /users/logout | Log out

