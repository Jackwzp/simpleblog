//============================
//      Dependencies
//============================       

var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'}); 
var authenticate = require('./helper').authenticate;

// Two ways to get access to the model
var mongoose = require('mongoose')
var Post = mongoose.model('Post')
//var Post = require('../model/post');
var Category = require('../model/category');




//============================
//      Post Home Page
//============================       

router.get('/', authenticate, function(req, res, next) {
    Post.find( {author: req.user.name}, function(err, posts) {
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
router.get('/newpost', authenticate, function(req,res) {
    Category.find({author: req.user.name}, {title: 1}, function(err, categories) {
        if (err) console.error(err);      
        res.render('posts/newpost', {
            title: 'New Post',
            categories: categories
        });
    });
    
});


// Add new post to DB
// The upload.single('<name>'), the <name> must match the one in the form in view
router.post('/newpost', authenticate, upload.single('postimage'), function(req,res) {
    // get form values
    var title = req.body.title;
    var content = req.body.content;
    var category = req.body.category;

    // check for image
    if (req.file) {
        console.log("Uploading file...");
        var postImgName = req.file.filename;
    } else {        
        var postImgName = 'no.png';
    }

    var newPost = new Post({
        title: title, 
        content: content,
        author: req.user.name,
        category: category,
        postimage: postImgName
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
//      Edit Post
//============================

// edit post page
router.get('/edit', authenticate, function(req, res) {
    res.render('posts/edit');
});

// insert modified post into db
router.put('/:id', authenticate, function(req, res) {
    res.send('editing single post');
});

//============================
//      Delete Post
//============================       



/*
 * This Needs to be placed at the end in order to render other routes before it.
 * Since this route will redirect any /posts/<any string> to this route. If we place
 * this before say /edit route, then it will use this route instead of edit route.
*/
//============================
//      Individual Post View
//============================       
router.get('/:id', authenticate, function(req,res) {
    Post.findOne({author: req.user.name, title: req.params.id}, function(err, data){
        if(err) console.error(err);

        // Found matching post, go render view
        if(data != null) {
            res.render('posts/singlepost', {
                title: req.params.id,
                post: data
            });
        } 
        else {
            res.send("Can not find such post...");
        }
    });
});

//============================
//      Export Modules (Always Do this)
//============================       

module.exports = router;


