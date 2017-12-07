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

/* POST /books/new */
router.post('/new', async (req, res, next) => {
    //console.log('name: ' + req.body.name);
    await db.query('INSERT INTO books(user_cookie, name, author) VALUES ($1, $2, $3);', [req.sessionId, req.body.name, req.body.author]);
    res.redirect('/books');
});

module.exports = router;