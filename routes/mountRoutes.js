// JavaScript files that I have written to handle the various pages
const index = require('./index');
const welcome = require('./welcome');
const books = require('./books');
const patrons = require('./patrons');
const report = require('./report');
const settings = require('./settings');

// JavaScript files that I have written to handle cookies
const cookieMiddleware = require('./cookie-middleware');
const cookie = require('./cookie');

module.exports = (app) => {
    app.use(cookieMiddleware);

    app.use('/', index);
    app.use('/welcome', welcome);
    app.use('/books', books);
    app.use('/patrons', patrons);
    app.use('/report', report);
    app.use('/settings', settings);
    app.use('/cookie', cookie);
};