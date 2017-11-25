const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET welcome page. */
router.get('/', function(req, res, next) {
    res.render('welcome');
});

/* POST welcome page. */
router.post('/', async (req, res, next) => {
    // Save library name to database
    // TODO: actually save library name to database (req.body.name)
    //await db.query("INSERT INTO users VALUES ($1,$2,7,7);", [req.cookies['sessionId'], req.body.name]);
    await db.query("UPDATE users SET library_name = $2, teacher_checkout_length = $3, student_checkout_length = $4 WHERE cookie = $1;",
        [req.sessionId, req.body.name, 7, 7]);
    res.redirect('/');
});

module.exports = router;
