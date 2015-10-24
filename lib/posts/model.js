//============================
//      Require
//============================       

var mongoose = require('mongoose');



//============================
//      Post Schema
//============================       

var PostSchema = mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String},
    author: {type: String, required: true },
    date: { type: Date, default: Date.now },
    category: {type: String},
    postimage: { type: String},
    comments: {type: []}
});


//============================
//      Export Model
//============================   

var Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.createPost = function(newPost, callback) {
    newPost.save(callback);
}