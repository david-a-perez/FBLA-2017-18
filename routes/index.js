const Router = require('express-promise-router');
const db = require('../db/query');
const router = Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    res.render('index', { title: 'Library Manager', library: req.library });
});

module.exports = router;
