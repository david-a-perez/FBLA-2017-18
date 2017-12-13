const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET welcome page. */
router.get('/', function(req, res, next) {
    res.render('welcome');
});

/* POST welcome page. */
router.post('/', async (req, res, next) => {
    // Save library name, teacher checkout length, and student checkout length to database
    // If length is not defined by user, use default of 7 days
    await db.query("UPDATE users SET library_name = $2, teacher_checkout_length = $3, student_checkout_length = $4, teacher_overdue_fee = $5, student_overdue_fee = $6 WHERE cookie = $1;",
        [req.sessionId, req.body.name, req.body.teacher_checkout_length || 7, req.body.student_checkout_length || 7,
        req.body.teacher_overdue_fee || 0.25, req.body.student_overdue_fee || 0.25]);
    res.redirect('/');
});

module.exports = router;
