const Router = require('express-promise-router');
const db = require('../db/query');
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

/* GET /books/id */
router.get('/:id', async (req, res, next) => {
    const sqlResult = await db.query('SELECT name, author, id FROM books WHERE user_cookie = $1 AND id = $2', [req.sessionId, req.params.id]);
    const sqlResult2 = await db.query('SELECT c.id AS id, p.name AS patron_name, justify_hours((make_interval(days=>u.student_checkout_length)-(CURRENT_TIMESTAMP-c.checkout_timestamp))) AS time_remaining FROM book_copies c INNER JOIN books b ON b.id = c.book LEFT OUTER JOIN patrons p ON p.id = c.patron INNER JOIN users u ON u.cookie = c.user_cookie WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
    res.render('booksMore', {title: 'Library Manager', library: req.library, book: sqlResult.rows, book_copies: sqlResult2.rows});
});

/* POST /books/id/new */
router.post('/:id/new', async (req, res, next) => {
    const sqlResult = await db.query('INSERT INTO book_copies (book, user_cookie) VALUES ($2, $1);', [req.sessionId, req.params.id]);
    res.redirect(req.originalUrl.replace("/new", ""));
});

/* GET /books/table/id */
router.get('/table/:id', async (req, res, next) => {
    const sqlResult = await db.query('SELECT c.id AS id, p.name AS patron_name, justify_hours((make_interval(days=>u.student_checkout_length)-(CURRENT_TIMESTAMP-c.checkout_timestamp))) AS time_remaining FROM book_copies c INNER JOIN books b ON b.id = c.book LEFT OUTER JOIN patrons p ON p.id = c.patron INNER JOIN users u ON u.cookie = c.user_cookie WHERE b.user_cookie = $1 AND c.user_cookie = $1 AND b.id = $2;', [req.sessionId, req.params.id]);
    res.render('booksCopiesTables', {title: 'Library Manager', library: req.library, book_copies: sqlResult.rows});
});

/* GET /books/copies/id/delete */
router.get('/copies/:id/delete', async (req, res, next) => {
    const sqlResult = await db.query('DELETE FROM book_copies WHERE user_cookie = $1 AND id = $2 RETURNING book;', [req.sessionId, req.params.id]);
    const path = "/books/" + (sqlResult.rows[0].book || "");
    res.redirect(path);
});

/* POST /books/new */
router.post('/new', async (req, res, next) => {
    //console.log('name: ' + req.body.name);
    await db.query('WITH book_id AS (INSERT INTO books(user_cookie, name, author) VALUES ($1, $2, $3) RETURNING id) INSERT INTO book_copies(user_cookie, book, patron) SELECT $1, id, null FROM book_id;', [req.sessionId, req.body.name, req.body.author]);
    //await db.query('WITH book_id AS (INSERT INTO book_copies(user_cookie, book, patron, checkout_timestamp) VALUES ($1, $2, $3, );', [req.sessionId, req.body.name, req.body.author]);
    res.redirect('/books');
});

module.exports = router;