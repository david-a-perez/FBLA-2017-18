const Router = require('express-promise-router');
const router = Router();

/* GET home page. */
router.get('/', async (req, res) => {
    res.render('index', { title: 'Library Manager', library: req.library });
});

module.exports = router;
