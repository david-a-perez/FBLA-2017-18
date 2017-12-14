const Router = require('express-promise-router');
const db = require('../db/query');
const shortid = require('shortid');
const router = Router();

/* GET /books */
router.get('/', async (req, res, next) => {
    const sqlResult = await db.query('SELECT * FROM books WHERE user_cookie = $1', [req.sessionId]);
    res.render('books', {title: 'Library Manager', library: req.library, books: sqlResult.rows});
});

/* GET /books/new */
router.get('/new', (req, res, next) => {
    res.render('booksNew', {title: 'Library Manager', library: req.library});
});

/* GET /books/tooManyBooks */
router.get('/tooManyBooks', (req, res, next) => {
    res.render('tooManyBooks', {title: 'Library Manager', library: req.library});
});

/* GET /books/id */
router.get('/:id', async (req, res, next) => {
    const sqlResult = await db.query('SELECT name, author, id FROM books WHERE user_cookie = $1 AND id = $2', [req.sessionId, req.params.id]);
    //const sqlResult2 = await db.query('SELECT c.id AS id, p.name AS patron_name, p.role AS patron_role, CASE WHEN p.role = \'student\'::role THEN c.checkout_date + u.student_checkout_length WHEN p.role = \'teacher\'::role THEN c.checkout_date + u.teacher_checkout_length END AS due_date FROM book_copies c INNER JOIN books b ON b.id = c.book LEFT OUTER JOIN patrons p ON p.id = c.patron INNER JOIN users u ON u.cookie = c.user_cookie WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
    const sqlResult2 = await db.query('' +
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
        'WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2) ' +
        'SELECT c.id AS id, ' +
        'b.name AS name, ' +
        'b.author AS author, ' +
        'p.name AS patron_name, ' +
        'p.role AS patron_role, ' +
        'due_date, ' +
        'c.call_num AS call_num, ' +
        'CASE ' +
        'WHEN CURRENT_DATE > due_date THEN (CURRENT_DATE-due_date) * overdue_fee END AS fees_due ' +
        'FROM book_copies c ' +
        'INNER JOIN books b ON b.id = c.book ' +
        'LEFT OUTER JOIN patrons p ON p.id = c.patron ' +
        'INNER JOIN X x ON x.id = c.id ' +
        'WHERE c.user_cookie = $1 AND b.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
    console.log(sqlResult2.rows[0].due_date)
    res.render('booksMore', {title: 'Library Manager', library: req.library, book: sqlResult.rows, book_copies: sqlResult2.rows});
});

/* POST /books/id/new */
router.post('/:id/new', async (req, res, next) => {
    const sqlResult = await db.query('INSERT INTO book_copies (book, user_cookie, call_num) VALUES ($2, $1, $3);', [req.sessionId, req.params.id, shortid.generate()]);
    res.redirect(req.originalUrl.replace("/new", ""));
});

/* POST /books/id/editname */
router.post('/:id/editname', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE books SET name = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.name]);
    res.redirect(req.originalUrl.replace("/editname", ""));
});

/* POST /books/id/editauthor */
router.post('/:id/editauthor', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE books SET author = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.author]);
    res.redirect(req.originalUrl.replace("/editauthor", ""));
});

/* GET /books/table/id */
router.get('/table/:id', async (req, res, next) => {
    //const sqlResult = await db.query('SELECT c.id AS id, p.name AS patron_name, p.role AS patron_role, CASE WHEN p.role = \'student\'::role THEN c.checkout_date + u.student_checkout_length WHEN p.role = \'teacher\'::role THEN c.checkout_date + u.teacher_checkout_length END AS due_date FROM book_copies c INNER JOIN books b ON b.id = c.book LEFT OUTER JOIN patrons p ON p.id = c.patron INNER JOIN users u ON u.cookie = c.user_cookie WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
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
        'WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2) ' +
        'SELECT c.id AS id, ' +
        'b.name AS name, ' +
        'b.author AS author, ' +
        'p.name AS patron_name, ' +
        'p.role AS patron_role, ' +
        'due_date, ' +
        'c.call_num AS call_num, ' +
        'CASE ' +
        'WHEN CURRENT_DATE > due_date THEN (CURRENT_DATE-due_date) * overdue_fee END AS fees_due ' +
        'FROM book_copies c ' +
        'INNER JOIN books b ON b.id = c.book ' +
        'LEFT OUTER JOIN patrons p ON p.id = c.patron ' +
        'INNER JOIN X x ON x.id = c.id ' +
        'WHERE c.user_cookie = $1 AND b.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
    res.render('booksCopiesTables', {title: 'Library Manager', library: req.library, book_copies: sqlResult.rows});
});

/* GET /books/copies/id/delete */
router.get('/copies/:id/delete', async (req, res, next) => {
    const sqlResult = await db.query('DELETE FROM book_copies WHERE user_cookie = $1 AND id = $2 RETURNING book;', [req.sessionId, req.params.id]);
    //const path = "/books/" + (sqlResult.rows[0].book || "");
    res.redirect("back");
});

/* GET /books/copies/id/checkout */
router.get('/copies/:id/checkout', async (req, res, next) => {
    const sqlResult = await db.query('SELECT c.id AS id, b.name AS name, b.author AS author FROM book_copies c INNER JOIN books b ON b.id = c.book WHERE c.user_cookie = $1 AND b.user_cookie = $1 AND c.id = $2;', [req.sessionId, req.params.id]);
    const sqlResult2 = await db.query('SELECT * FROM patrons WHERE user_cookie = $1;', [req.sessionId]);
    res.render('checkoutBook', {title: 'Library Manager', library: req.library, book: sqlResult.rows, patrons: sqlResult2.rows});
});

// CASE WHEN p.role = 'student'::role THEN c.checkout_date + u.student_checkout_length WHEN p.role = 'teacher'::role THEN c.checkout_date + u.teacher_checkout_length END AS due_date
/* GET /books/copies/id/return */
router.get('/copies/:id/return', async (req, res, next) => {
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
        'WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND c.id = $2) ' +
        'SELECT c.id AS id, ' +
        'b.name AS name, ' +
        'b.author AS author, ' +
        'p.name AS patron_name, ' +
        'c.call_num AS call_num, ' +
        'CASE ' +
        'WHEN CURRENT_DATE > due_date THEN (CURRENT_DATE-due_date) * overdue_fee END AS fees_due ' +
        'FROM book_copies c ' +
        'INNER JOIN books b ON b.id = c.book ' +
        'LEFT OUTER JOIN patrons p ON p.id = c.patron ' +
        'INNER JOIN X x ON x.id = c.id ' +
        'WHERE c.user_cookie = $1 AND b.user_cookie = $1 AND c.id = $2;', [req.sessionId, req.params.id]);
    res.render('returnBook', {title: 'Library Manager', library: req.library, data: sqlResult.rows});
});

/* POST /books/copies/id/return */
router.post('/copies/:id/return', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE book_copies SET patron = null, checkout_date = null WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id]);
    res.redirect('/books');
});

router.post('/copies/:id/checkout', async (req, res, next) => {
    const sqlResult1 = await db.query('SELECT CASE WHEN p.role = \'teacher\'::role THEN u.teacher_max_books WHEN p.role = \'student\'::role THEN u.student_max_books END AS max_books FROM patrons p INNER JOIN users u ON p.user_cookie = u.cookie WHERE p.user_cookie = $1 AND p.id = $2;', [req.sessionId, req.body.patron]);
    const max_books = sqlResult1.rows[0].max_books;
    const sqlResult3 = await db.query('SELECT COUNT (patron) FROM book_copies WHERE user_cookie = $1 AND patron = $2;', [req.sessionId, req.body.patron]);
    const count = sqlResult3.rows[0].count;
    if (max_books > 0) {
        if (count >= max_books){
            return res.redirect('/books/tooManyBooks');
        }
    }
    const sqlResult = await db.query('UPDATE book_copies SET patron = $3, checkout_date = CURRENT_DATE WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.patron]);
    res.redirect('/books');
});

/* POST /books/new */
router.post('/new', async (req, res, next) => {
    //console.log('name: ' + req.body.name);
    await db.query('WITH book_id AS (INSERT INTO books(user_cookie, name, author) VALUES ($1, $2, $3) RETURNING id) INSERT INTO book_copies(user_cookie, book, patron, call_num) SELECT $1, id, null, $4 FROM book_id;', [req.sessionId, req.body.name, req.body.author, shortid.generate()]);
    //await db.query('WITH book_id AS (INSERT INTO book_copies(user_cookie, book, patron, checkout_timestamp) VALUES ($1, $2, $3, );', [req.sessionId, req.body.name, req.body.author]);
    res.redirect('/books');
});

module.exports = router;