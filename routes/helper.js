
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