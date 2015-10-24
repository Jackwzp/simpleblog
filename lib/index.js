//============================
//  Dependencies
//============================       
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');


//============================
//  Routes
//============================       

// All path route, used to display navbar
// properly depending on user logged in or not
// this must be placed before other routes
router.get('*', function(req, res, next) {
    res.locals.feuser = req.user || null;
    next();
});

router.get('/', function(req, res, next) {
    Post.find({}, function(err, posts) {
        res.render('index', {title: 'Index', posts: posts});
    });
    
});

//============================
//  Expose
//============================       
module.exports = router;