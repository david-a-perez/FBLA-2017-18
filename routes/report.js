const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

router.get('/', async (req, res, next) => {
    const sqlResult = await db.query('' +
        'WITH X AS ' +
        '(SELECT c.id AS id, ' +
        'CASE ' +
        'WHEN p.role = \'student\'::role THEN c.checkout_date + u.student_checkout_length ' +
        'WHEN p.role = \'teacher\'::role THEN c.checkout_date + u.teacher_checkout_length END AS due_date, ' +
        'CASE ' +
        'WHEN p.role = \'student\'::role THEN u.student_overdue_fee ' +
        'WHEN p.role = \'teacher\'::role THEN u.teacher_overdue_fee END AS overdue_fee ' +
        'FROM book_copies c ' +
        'INNER JOIN books b ON b.id = c.book ' +
        'LEFT OUTER JOIN patrons p ON p.id = c.patron ' +
        'INNER JOIN users u ON u.cookie = c.user_cookie ' +
        'WHERE b.user_cookie = $1 AND c.user_cookie = $1) ' +
        'SELECT ' +
        'b.name AS book_name, ' +
        'b.author AS author, ' +
        'p.name AS patron_name, ' +
        'p.role AS patron_role, ' +
        'due_date AS due_date, ' +
        'c.call_num AS call_num, ' +
        'CASE ' +
        'WHEN CURRENT_DATE > due_date THEN (CURRENT_DATE-due_date) * overdue_fee END AS fees_due ' +
        'FROM book_copies c ' +
        'INNER JOIN books b ON b.id = c.book ' +
        'LEFT OUTER JOIN patrons p ON p.id = c.patron ' +
        'INNER JOIN X x ON x.id = c.id ' +
        'WHERE c.user_cookie = $1 AND b.user_cookie = $1;', [req.sessionId]);
    res.render('report', {title: 'Library Manager', library: req.library, data: sqlResult.rows});
});

module.exports = router;