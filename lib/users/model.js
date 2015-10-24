//============================
//      Require
//============================       
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');



//============================
//      User Schema
//============================       
var UserSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: { type: String, bcrypt:true, required: true},
    email: { type: String},
    name: { type: String},
    profileimage: { type: String}

});


//============================
//      Export User Methods
//============================       

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
    bcrypt.hash(newUser.password, 10, function(err, result) {
        if(err) throw err;

        // set password to new hashed passwd
        newUser.password = result;
        newUser.save(callback);
    });
    
}

module.exports.getUserByUsername = function(username, callback) {
    var query = {username: username};
    User.findOne(query, callback); // mongoose provided function
}


module.exports.getUserById = function(id, callback) {
    User.findById(id, callback); // mongoose provided function
}


module.exports.comparePassword = function(pass, hash, callback) {
    bcrypt.compare(pass, hash, function(err, isMatch) {
            if (err) return callback(err);
            callback(null, isMatch);
    });
}
