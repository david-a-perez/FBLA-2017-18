const express = require('express');
const router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  next();
  console.log("next is fake")
  //res.send('respond with a resource');
});

module.exports = router;
