//============================
//      Dependencies
//============================       

var express = require('express');
var path = require('path');
var config = require('_/middleware');
var multer = require('multer');
var upload = multer({dest: config.publicDir + '/images/uploads'}); 
var authenticate = require('_/middleware/helper').authenticate;

// Get models
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.locals.formatDate = require('_/middleware/helper').formatDate;
app.locals.truncate = require('_/middleware/helper').truncate;
//============================
//      Post Home Page
//============================       

app.get('/', authenticate, function(req, res, next) {
    Post.find( {author: req.user.name}, function(err, posts) {
        if(err) throw err;
        //console.log(posts);
        res.render('posts', { 
            title: 'Posts',
            posts: posts 
        });
    });
});

//============================
//      Add New Post
//============================       

// Get add post view
app.get('/newpost', authenticate, function(req,res) {
    Category.find({author: req.user.name}, {title: 1}, function(err, categories) {
        if (err) throw err;      
        res.render('newpost', {
            title: 'New Post',
            categories: categories
        });
    });
    
});


// Add new post to DB
// The upload.single('<name>'), the <name> must match the one in the form in view
app.post('/newpost', authenticate, upload.single('postimage'), function(req,res) {
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

// get edit post page
app.get('/:id/edit', authenticate, function(req, res) {
    Post.findOne({author: req.user.name, title: req.params.id}, function(err, data) {
        Category.find({author: req.user.name}, {title: 1}, function(err, categories) {
            if (err) throw err;

            res.render('editpost', {
                title: data.title,
                post: data,
                categories: categories
            });
        });
    });
});


// update edited post in DB
app.post('/:id/edit', authenticate, upload.single('postimage'), function(req, res) {
    var postQuery = {author: req.user.name, title: req.params.id};

    // Find the original Post
    Post.findOne(postQuery, {postimage: 1}, function(err, data) {
        if (err) throw err;

        // get form values
        var title = req.body.title;
        var content = req.body.content;
        var category = req.body.category;

        // check for image
        if (req.file) {
            console.log("Uploading file...");
            var postImgName = req.file.filename;
        } else {        
            // keep original image
            var postImgName = data.postimage;
        }

        var update = {
            title: title, 
            content: content,
            category: category,
            postimage: postImgName
        };


        // update DB and redirect to post page
        Post.update(postQuery, update).exec();
        res.redirect('/posts/' + req.user.name + '/' + title);
    });

});


//============================
//      Delete Post
//============================       

// insert modified post into db
app.delete('/:id', authenticate, function(req, res) {
    console.log("Deleting post named " + req.params.id);
    var postQuery = {author: req.user.name, title: req.params.id};

    Post.remove(postQuery).exec();
});

/*
 * This Needs to be placed at the end in order to render other routes before it.
 * Since this route will redirect any /posts/<any string> to this route. If we place
 * this before say /edit route, then it will use this route instead of edit route.
*/
//============================
//      Individual Post View
//============================       
app.get('/:author/:title', function(req,res) {
    Post.findOne({author: req.params.author, title: req.params.title}, function(err, data){
        if(err) throw err;

        var user = (req.isAuthenticated()? req.user.name : null);

        // Found matching post, go render view
        if(data != null) {
            res.render('singlepost', {
                title: req.params.title,
                post: data,
                comments: data.comments,
                user: user
            });
        } 
        else {
            res.send("Can not find such post...");
        }
    });
});

//============================
//      Add Comments
//============================       

app.post('/:id/addcomment', authenticate, function(req, res) {
    var postQuery = {author: req.user.name, title: req.params.id};

    Post.findOne(postQuery, function(err, data) {
        // get form values
        var name = req.body.name;
        var email = req.body.email;
        var body = req.body.comment;

        var comment = {
            name: name, 
            email: email,
            body: body
        };

        data.comments.push(comment);
        data.save(function(err) {
            if(err) throw err;
            req.flash('success', "Comments Added");
            res.redirect('back');
        });
    });

});


//============================
//      Expose
//============================       

module.exports = app;


