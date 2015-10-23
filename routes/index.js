//============================
//  Dependencies
//============================       
var express = require('express');
var router = express.Router();
var Post = require('../model/post');

//============================
//  Home Page Route
//============================       
/* GET home page. */
router.get('/', function(req, res, next) {
    Post.find({}, function(err, posts) {
        res.render('index', {title: 'Index', posts: posts});
    });
    
});

//============================
//  Export Module
//============================       
module.exports = router;
