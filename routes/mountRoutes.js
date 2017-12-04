// JavaScript files that I have written to handle the various pages
const index = require('./index');
const users = require('./users');
const welcome = require('./welcome');
const books = require('./books');
const patrons = require('./patrons');

// JavaScript files that I have written to handle cookies
const cookieMiddleware = require('./cookie-middleware');
const cookie = require('./cookie');

module.exports = (app) => {
    app.use(cookieMiddleware);

    app.use('/', index);
    app.use('/users', users);
    app.use('/welcome', welcome);
    app.use('/books', books);
    app.use('/patrons', patrons);
    app.use('/cookie', cookie);
};