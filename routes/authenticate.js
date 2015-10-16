//============================
// Check if user is logged in
//============================       

exports.check = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/users/login');
    }
}

