//============================
//      Connect to DB
//============================       
var mongoose = require( 'mongoose' ); 
var dbURI = 'mongodb://localhost/nodeauth'; 
mongoose.connect(dbURI); 

//============================
//      Logging Messages
//============================       
// successfully
mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + dbURI);
}); 

// error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

// If the Node process ends, close the Mongoose connection 
process.on('SIGINT', function() {  
  mongoose.connection.close(function () { 
    console.log('Mongoose default connection disconnected through app termination'); 
    process.exit(0); 
  }); 
}); 

//============================
//      Bring in Schemas
//============================  
// why doesn't require('./model/user') work??      
require('./../model/user'); 
require('./../model/post'); 