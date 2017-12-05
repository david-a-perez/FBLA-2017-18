const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET /patrons */
router.get('/', async (req, res, next) => {
    //const sqlResult = await db.query('SELECT * FROM patrons WHERE user_cookie = $1', [req.sessionId]);
    const sqlResult = {};
    res.render('patrons', {title: 'Library Manager', library: req.library, patrons: sqlResult.rows});
});

/* GET /patrons/new */
router.get('/new', (req, res, next) => {
    res.render('patronsNew');
});

/* POST /patrons/new */
router.post('/new', async (req, res, next) => {
    //console.log('name: ' + req.body.name);
    await db.query('INSERT INTO patrons(user_cookie, name, role) VALUES ($1, $2, $3);', [req.sessionId, req.body.name, req.body.role]);
    res.redirect('/patrons');
});

module.exports = router;
