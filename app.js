//============================
//    Initialization
//============================       
var express = require('express');
var path = require('path');
var app = express();

app.set('views', path.join(__dirname, 'lib/views'));

//============================
//    Middleware
//============================       

require('_/middleware').config(app);
require('_/middleware').setLocals(app);

//============================
//    Set our routes
//============================     

app.use(require('_/'));
app.use('/users', require('_/users'));
app.use('/posts', require('_/posts'));
app.use('/categories', require('_/categories'));



//============================
//    Error Handlers
//============================   
require('_/middleware').errorHandler(app);


//============================
//    Expose
//============================    
module.exports = app;
