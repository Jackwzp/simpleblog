var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest: './public/images/uploads'}); 
var User = require('../model/user');

var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//============================
//      Register
//============================       
router.get('/register', function(req, res, next) {
  res.render('users/register', {'title': 'Register'});
});

// Post
router.post('/register', upload.single('profileimg'), function(req, res, next) {
  // Get form values
  var name = req.body.name;
  var email = req.body.email;
  var usrname = req.body.username;
  var pass = req.body.password;
  var pass2 = req.body.password2;

  // check for image
  if (req.file) {
    console.log("Uploading file...");
    var imgName = req.file.originalName;
    var profileImgName = req.file.name;
    var profileImgMime = req.file.mimetype;
    var profileImgPath = req.file.path;
    var profileImgExt = req.file.ext;
    var profileImgSize = req.file.size;
  } else {
    // Set a default image
    var profileImgName = 'noimage.png';
  }

  // Form validation (the first param is 'name' attr of html in jade file; not the form values from above)
  req.checkBody('name', 'Name field is requried').notEmpty();
  req.checkBody('email', 'Email field is not valid').isEmail();
  req.checkBody('username', 'Username field is requried').notEmpty();
  req.checkBody('password', 'Password field is requried').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(pass);

  // check for errors
  var err = req.validationErrors();

  if (err) {
    console.log({body: req.body})
    res.render('users/register', {
        errorss: err,
        name: name,
        email: email,
        username: usrname,
        password: pass,
        password2: pass2
    });
  } else {
    //create user from the user.js model
    var newUser = new User({
        name: name,
        email: email,
        username: usrname,
        password: pass,
    });

    User.createUser(newUser, function(err, user) {
        if(err) throw err;
        console.log(user);        
    });

    // Success flash message
    req.flash('success', 'You are now registered and may login');
    res.location('/');
    res.redirect('/');
  }

  //res.send('respond with a resource');
});



//============================
//      Login
//============================       
router.get('/login', function(req, res, next) {
  res.render('users/login', {'title': 'Login'});
});


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(new localStrategy( function(username, password, done) {
    User.getUserByUsername(username, function(err, user) {
        if(err) throw err;
        if(!user) {
            console.log('Unknown User');
            return done(null, false, {message: 'Unknown User'});
        }

        User.comparePassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                console.log('Invalid Password');
                return done(null, false, {message: 'Invalid Password'});
            }
        });
    });

}));

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username and password'}), function(req, res) {
    console.log('Authentication successful');
    req.flash('success', 'You are logged in');
    res.redirect('/posts');
});


//============================
//      Logout
//============================       
router.get('/logout', function(req, res, next) {
  req.logout();
  req.flash('success', 'You have logged out');
  res.redirect('/users/login');
});

//============================
//    Export Modules
//============================       
module.exports = router;
