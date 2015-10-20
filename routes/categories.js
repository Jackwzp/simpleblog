//============================
//      Dependencies
//============================       

var express = require('express');
var router = express.Router();
var authenticate = require('./helper').authenticate;
var Post = require('../model/post');
var Category = require('../model/category');

//============================
//      Main Category
//============================       

router.get('/', authenticate, function(req, res) {
    Category.find({author: req.user.name}, {title: 1}, function(err, data) {
        if(err) console.error(err);

        res.render('categories/categories', {
            title: 'Category',
            categories: data
        });
    })
    
});

//============================
//      Add New Category
//============================              

// router.get('/newcategory', authenticate, function(req, res) {
//     res.render('categories/newcategory', {title: 'Category'});
// });

// add new category to DB
router.post('/', authenticate, function(req, res) {
    var title = req.body.title;

    Category.findOne({author: req.user.name, title: title}, {title: 1}, function(err, data) {
        if(err) console.error(err);

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

router.get('/:id', authenticate, function(req, res) {
    Post.find({author: req.user.name, category: req.params.id}, function(err, data){
        if(err) console.error(err);
        res.render('categories/postsbycategory', {
            title: req.params.id,
            posts: data
        });
    });
});

//============================
//      Edit/Delete Category
//============================       

// Both PUT and DELETE will come in as POST
router.post('/:id', authenticate, function(req, res){
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

module.exports = router;


