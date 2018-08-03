var express = require('express');
var router = express.Router();

/* GET PHOTOGALLERY page. */
router.get('/', function(req, res, next) {
    res.render('photogallery');
});
module.exports = router;
