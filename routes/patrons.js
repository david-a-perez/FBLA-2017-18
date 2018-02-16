const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET /patrons */
router.get('/', async (req, res, next) => {
    // Show user all patrons
    const sqlResult = await db.query('SELECT * FROM patrons WHERE user_cookie = $1', [req.sessionId]);
    res.render('patrons', {title: 'Library Manager', library: req.library, patrons: sqlResult.rows});
});

/* GET /patrons/new */
router.get('/new', (req, res, next) => {
    // Add new patron
    res.render('patronsNew', {title: 'Library Manager', library: req.library});
});

/* POST /patrons/new */
router.post('/new', async (req, res, next) => {
    // Add new patron
    await db.query('INSERT INTO patrons(user_cookie, name, role) VALUES ($1, $2, $3);', [req.sessionId, req.body.name, req.body.role]);
    res.redirect('/patrons');
});

/* GET /patrons/id */
router.get('/:id', async (req, res, next) => {
    // Get more information on a specific patron
    const sqlResult = await db.query('SELECT * FROM patrons WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id]);
    res.render('patronsMore', {title: 'Library Manager', library: req.library, patron: sqlResult.rows});
});

/* POST /patrons/id/editname */
router.post('/:id/editname', async (req, res, next) => {
    // Edit a patron's name
    const sqlResult = await db.query('UPDATE patrons SET name = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.name]);
    res.redirect(req.originalUrl.replace("/editname", ""));
});

/* POST /patrons/id/editrole */
router.post('/:id/editrole', async (req, res, next) => {
    // Edit a patron's role
    const sqlResult = await db.query('UPDATE patrons SET role = $3 WHERE user_cookie = $1 AND id = $2;', [req.sessionId, req.params.id, req.body.role]);
    res.redirect(req.originalUrl.replace("/editrole", ""));
});

module.exports = router;
