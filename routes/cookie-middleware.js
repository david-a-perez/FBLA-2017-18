const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* Cookie middleware. */
router.use(async (req, res, next) => {
    // This middleware is to make sure that the user has the cookie sessionId so that they can be identified by the server.
    // This is to prevent the databases of the different users colliding
    if (req.cookies['sessionId'] === undefined) {

        // sessionId cookie has not been set, set it using a random number
        let randomNumber = Math.random().toString();
        randomNumber = randomNumber.substring(2, randomNumber.length);

        // Set the cookie with a max age of approximately 1 year : 1000 * 60 * 60 * 24 * 365 = 31536000 milliseconds
        res.cookie('sessionId', randomNumber, {maxAge: 31536000000, httpOnly: true});

        // Send user to cookie page to make user the cookie was set
        if (req.path === '/cookie') {
            // Avoid redirect loop to cookie page
            return next();
        } else {
            return res.redirect('/cookie');
        }
        // If name has not been set forward user to welcome page
    }

    if (req.path === '/cookie') {
        return next();
    }

    req.sessionId = req.cookies['sessionId'];

    // Request the user's user data from database
    const sqlResponse = await db.query("SELECT * FROM users WHERE cookie = $1;", [req.sessionId]);

    let row;
    if (sqlResponse.rows.length === 0) {
        // Add the users sessionId to database
        await db.query('INSERT INTO users(cookie) VALUES ($1);', [req.sessionId]);
        const newSqlResponse = await db.query("SELECT * FROM users WHERE cookie = $1;", [req.sessionId]);
        row = newSqlResponse.rows[0];
    } else {
        row = sqlResponse.rows[0];
    }



    if (row.library_name === null || row.teacher_checkout_length === null || row.student_checkout_length === null || row.library_name === "") {
        // User needs to set name and checkout lengths
        // If the user is not going to welcome page redirect the user to /welcome
        if (req.path !== '/welcome') {
            return res.redirect('/welcome');
        }
        return next();
    }

    // Set a variable so that it will be easier to access the library name later
    req.library = row.library_name;
    next();
});

module.exports = router;
