//============================
//      Dependencies
//============================       

var express = require('express');
var router = express.Router();
var authentication = require('./authenticate');
var Post = require('../model/post');
var Category = require('../model/category');

//============================
//      Main Category
//============================       

router.get('/', authentication.check, function(req, res) {
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

router.get('/newcategory', authentication.check, function(req, res) {
    res.render('categories/newcategory', {title: 'Category'});
});

// add new category to DB
router.post('/newcategory', authentication.check, function(req, res) {
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
            req.flash('success', title + ' Created Successfully!');
            res.redirect('/categories');

        } else { 
            // Category already exists...display error
            req.flash('error', title + ' already exists...try another one.');
            res.redirect('back');
        }
    });
});

//============================
//      Posts by Category
//============================

router.get('/:id', function(req, res) {
    Post.find({author: req.user.name, category: req.params.id}, function(err, data){
        if(err) console.error(err);
        res.render('categories/postsbycategory', {
            title: req.params.id,
            posts: data
        });
    });
});

//============================
//      Edit Category
//============================       

router.put('/:id', function(req, res){
    res.send('Put request for ' + req.params.id);
});


//============================
//      Delete Category
//============================       


//============================
//      Export Modules (Always Do this)
//============================       

module.exports = router;


