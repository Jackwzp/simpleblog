//============================
//      Require
//============================ 
var mongoose = require('mongoose');


//============================
//      Post Schema
//============================   
var CategorySchema = mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true}
});


//============================
//      Export Model
//============================   

var Category = module.exports = mongoose.model('Category', CategorySchema);


module.exports.createCategory = function(newCategory, callback) {
    newCategory.save(callback);
}