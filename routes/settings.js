const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

router.get('/', async (req, res, next) => {
    const sqlResult = await db.query('SELECT * FROM users WHERE cookie = $1', [req.sessionId]);
    res.render('settings', {title: 'Library Manager', library: req.library, settings: sqlResult.rows});
});

router.post('/setteachercheckoutlength', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET teacher_checkout_length = $2 WHERE cookie = $1;', [req.sessionId, req.body.teacher_checkout_length]);
    res.redirect('/settings');
});

router.post('/setstudentcheckoutlength', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET student_checkout_length = $2 WHERE cookie = $1;', [req.sessionId, req.body.student_checkout_length]);
    res.redirect('/settings');
});

router.post('/setteacheroverduefee', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET teacher_overdue_fee = $2 WHERE cookie = $1;', [req.sessionId, req.body.teacher_overdue_fee]);
    res.redirect('/settings');
});

router.post('/setstudentoverduefee', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET student_overdue_fee = $2 WHERE cookie = $1;', [req.sessionId, req.body.student_overdue_fee]);
    res.redirect('/settings');
});

router.post('/setteachermaxbooks', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET teacher_max_books = $2 WHERE cookie = $1;', [req.sessionId, req.body.teacher_max_books]);
    res.redirect('/settings');
});

router.post('/setstudentmaxbooks', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE users SET student_max_books = $2 WHERE cookie = $1;', [req.sessionId, req.body.student_max_books]);
    res.redirect('/settings');
});

module.exports = router;