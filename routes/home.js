var express = require('express');
var router = express.Router();

/* GET HOME page. */
router.get('/', function(req, res, next) {
    res.render('home', {API_KEY: global.API_KEY});
});

module.exports = router;
