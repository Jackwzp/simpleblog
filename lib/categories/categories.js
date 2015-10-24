//============================
//      Dependencies
//============================       

var express = require('express');
var path = require('path');
var app = express();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Category = mongoose.model('Category');
var authenticate = require('_/middleware/helper').authenticate;

app.set('views', path.join(__dirname, 'views'));
app.locals.formatDate = require('_/middleware/helper').formatDate;
app.locals.truncate = require('_/middleware/helper').truncate;
//============================
//      Main Category
//============================       

app.get('/', authenticate, function(req, res) {
    Category.find({author: req.user.name}, {title: 1}, function(err, data) {
        if(err) throw err;

        res.render('categories', {
            title: 'Category',
            categories: data
        });
    })
    
});

//============================
//      Add New Category
//============================              

// add new category to DB
app.post('/', authenticate, function(req, res) {
    var title = req.body.title;

    Category.findOne({author: req.user.name, title: title}, {title: 1}, function(err, data) {
        if(err) throw err;

        // Category doesn't exist...create new one
        if (data == null) {
            var newcategory = new Category({
                title: title,
                author: req.user.name
            });

            Category.createCategory(newcategory, function(err, category) {
                if (err) throw err;
                console.log(category);
            });

            // Success flash message
            //req.flash('success', title + ' Created Successfully!');
            

        } else { 
            // Category already exists...display error
            req.flash('error', title + ' already exists...try another one.');
        }

        res.redirect('back');
    });
});

//============================
//      Posts by Category
//============================

app.get('/:id', authenticate, function(req, res) {
    Post.find({author: req.user.name, category: req.params.id}, function(err, data){
        if(err) throw err;
        res.render('postsbycategory', {
            title: req.params.id,
            posts: data
        });
    });
});

//============================
//      Edit/Delete Category
//============================       

// Both PUT and DELETE will come in as POST
app.post('/:id', authenticate, function(req, res){
    var method = req.body._method;
    
    if (method == 'PUT') {
        editPost(req, res);
    }
    else if (method == 'DELETE'){
        delPost(req, res);
    }    
});
    
// edit category    
var editPost = function (req, res) {
    var newTitle = req.body.newtitle;
    var postQuery = {author: req.user.name, category: req.params.id};
    var catQuery = {author: req.user.name, title: req.params.id};

    // Update all posts with current category name to the new name
    Post.update(postQuery, {category: newTitle}, {multi: true}).exec();

    // Now update the category name as well and redirect back to same page
    Category.update(catQuery, {title: newTitle}).exec();

    res.redirect('back');    
}

// del category
var delPost = function(req, res) {
    var postQuery = {author: req.user.name, category: req.params.id};
    var catQuery = {author: req.user.name, title: req.params.id};

    // Update all posts with current category name to blank
    Post.update(postQuery, {category: ''}, {multi: true}).exec();

    // Now remove the category and redirect back to same page
    Category.remove(catQuery).exec();
    res.redirect('back');
}

//============================
//      Export Modules (Always Do this)
//============================       

module.exports = app;


