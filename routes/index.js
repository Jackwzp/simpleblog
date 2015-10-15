var express = require('express');
var router = express.Router();
var Post = require('../model/post');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Index'});
});


module.exports = router;
