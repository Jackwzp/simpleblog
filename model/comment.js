//============================
//
//============================       

var mongoose = require('mongoose');


var commentSchema = new mongoose.Schema({
    author: String,
    body: String,
    date: Date
});


var Comment = module.exports = mongoose.model('Comment', commentSchema);

module.exports.createComment = function(newComment, callback) {
    newComment.save(callback);
}