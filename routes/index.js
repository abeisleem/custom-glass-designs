var express = require('express');
var router = express.Router();

/* GET HOME page. */
router.get('/', function(req, res, next) {
  res.redirect('/home');
});

module.exports = router;
