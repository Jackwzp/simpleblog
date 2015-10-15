//============================
//      Dependencies
//============================       

var express = require('express');
var router = express.Router();
var multer = require('multer');
var Post = require('../model/post');

var upload = multer({dest: './public/images/uploads'}); 


//============================
//      Post Home Page
//============================       

function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

/* GET posts home page. */
router.get('/', checkAuthentication, function(req, res, next) {
    Post.find( {author: req.user.name}, {title: 1, date: 1}, function(err, posts) {
        if(err) console.error(err);
        //console.log(posts);
        res.render('posts/posts', { 
            title: 'Posts',
            posts: posts 
        });
    });
});

//============================
//      Add New Post
//============================       

// Get add post view
router.get('/new', checkAuthentication, function(req,res) {
    res.render('posts/new', {'title': 'New Post'});
});


// Add new post to DB
router.post('/new', function(req,res) {
    // get form values
    var title = req.body.title;
    var content = req.body.content;

    var newPost = new Post({
        title: title, 
        content: content,
        author: req.user.name
    });

    // the post param in callback is returned by mongoose
    Post.createPost(newPost, function(err, post) {
        if(err) throw err;
        console.log(post);        
    });
    
    // Success flash message
    req.flash('success', 'Post Created Successfully!');
    res.redirect('/posts');
});

//============================
//      Individual Post View
//============================       
router.get('/:id', checkAuthentication, function(req,res) {
    res.send('requesting single post view');
});

//============================
//      Edit Post
//============================

// edit post page
router.get('/edit', checkAuthentication, function(req, res) {
    res.render('posts/edit');
});

// insert modified post into db
router.put('/:id', checkAuthentication, function(req, res) {
    res.send('editing single post');
});

//============================
//      Delete Post
//============================              


//============================
//      Export Modules (Always Do this)
//============================       

module.exports = router;


