var express = require('express');
var router = express.Router();

/* GET FINISH / GLASS  page. */
router.get('/', function(req, res, next) {
    res.render('finish-glass');
});
module.exports = router;
