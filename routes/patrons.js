const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET /patrons */
router.get('/', async (req, res, next) => {
    const sqlResult = await db.query('SELECT * FROM patrons WHERE user_cookie = $1', [req.sessionId]);
    //const sqlResult = {};
    res.render('patrons', {title: 'Library Manager', library: req.library, patrons: sqlResult.rows});
});

/* GET /patrons/new */
router.get('/new', (req, res, next) => {
    res.render('patronsNew', {title: 'Library Manager', library: req.library});
});

/* POST /patrons/new */
router.post('/new', async (req, res, next) => {
    //console.log('name: ' + req.body.name);
    await db.query('INSERT INTO patrons(user_cookie, name, role) VALUES ($1, $2, $3);', [req.sessionId, req.body.name, req.body.role]);
    res.redirect('/patrons');
});

/* GET /patrons/id */
router.get('/:id', async (req, res, next) => {
    const sqlResult = await db.query('SELECT * FROM patrons WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id]);
    res.render('patronsMore', {title: 'Library Manager', library: req.library, patron: sqlResult.rows});
});

/* POST /patrons/id/editname */
router.post('/:id/editname', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE patrons SET name = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.name]);
    res.redirect(req.originalUrl.replace("/editname", ""));
});

/* POST /patrons/id/editname */
router.post('/:id/editrole', async (req, res, next) => {
    const sqlResult = await db.query('UPDATE patrons SET role = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.role]);
    res.redirect(req.originalUrl.replace("/editrole", ""));
});

module.exports = router;
