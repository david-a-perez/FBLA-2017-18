var express = require('express');
var db = require('../db/query');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    db.query("SELECT (library_name) FROM users WHERE cookie = $1;", [req.cookies['sessionId']], function (err,data) {
        if (err) {
            console.error(err);
        }
        var library = data.rows[0].library_name;
        res.render('index', { title: 'Library Manager', library: library });
    });
});

module.exports = router;
