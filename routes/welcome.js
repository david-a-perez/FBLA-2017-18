var express = require('express');
var db = require('../db/query');
var router = express.Router();

/* GET welcome page. */
router.get('/', function(req, res, next) {
    res.render('welcome');
});

/* POST welcome page. */
router.post('/',function(req, res, next) {
    // Save library name to database
    // TODO: actually save library name to database (req.body.name)
    db.query("INSERT INTO users VALUES ($1,$2,7,7);", [req.cookies['sessionId'], req.body.name], function (err,data){
        if (err) {
            console.error("ERROR:" + err);
        }
        console.log(data);
    });
    res.redirect('/');
});

module.exports = router;
