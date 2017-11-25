const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    /*const { rows } = await db.query("SELECT (library_name) FROM users WHERE cookie = $1;", [req.cookies['sessionId']]);
    const library = rows[0].library_name;
    console.log(library);*/
    res.render('index', { title: 'Library Manager', library: req.library });
});

module.exports = router;
