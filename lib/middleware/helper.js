
var moment = require('moment');


exports.truncate = function(text) {
  return text.substring(0,400);
}

exports.formatDate = function(date) {
  return moment(date).format("LL");
}

exports.authenticate = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.session.redirectURL = req.originalUrl;
        res.redirect('/users/login');
    }
}


exports.PostSlug = {
    get: function(post) {
        return '/posts/' + post.author + '/' + post.title;
    },

    edit: function(post) {
        return '/posts/' + post.title + '/edit' ;
    }
    
}


exports.CategorySlug = {
    // categories title are passed in directly right now
    // so only slug option is to use the title, can't use id etc.
    // need to change post schema to contain whole category obj 
    // instead of just title if want to use different slug option
    get: function(title) {
        return '/categories/' + title;
    }    
}