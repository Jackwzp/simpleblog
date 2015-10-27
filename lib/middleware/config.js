//============================
//  Require
//============================       

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var db = require('./db');
var expressValidator = require('express-validator');
var session = require('express-session');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');
var expressMessages = require('express-messages');



//============================
//  Expose
//============================       

var publicDir = path.join(__dirname, '../../public');

exports.publicDir = publicDir;

exports.config = function(app) {

    app.set('view engine', 'jade');
    
    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // Handle Express Sessions
    app.use(session({
        secret: 'secret',
        saveUninitialized: true,
        resave: true
    }));

    // Passports
    app.use(passport.initialize());
    app.use(passport.session());

    // Validator
    app.use(expressValidator({
      errorFormatter: function(param, msg, value) {
          var namespace = param.split('.')
          , root    = namespace.shift()
          , formParam = root;

        while(namespace.length) {
          formParam += '[' + namespace.shift() + ']';
        }
        return {
          param : formParam,
          msg   : msg,
          value : value
        };
      }
    }));


    // original express stuff
    app.use(cookieParser());
    app.use(express.static(publicDir));


    // Connect-flash
    app.use(flash());

    // express-messages
    app.use(function (req, res, next) {
      res.locals.messages = expressMessages(req, res);
      next();
    });
}

exports.setLocals = function(app) {
    // set locals helpers
    app.locals.formatDate = require('./helper').formatDate;
    app.locals.truncate = require('./helper').truncate;
    app.locals.PostSlug = require('./helper').PostSlug;
    app.locals.CategorySlug = require('./helper').CategorySlug;
    app.locals.commonViewDir = path.join(__dirname, '../views');
}


//============================
//    Error Handlers
//============================    
exports.errorHandler = function(app) {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'development') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });
}