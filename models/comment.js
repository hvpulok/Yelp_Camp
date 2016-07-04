var mongoose = require("mongoose");

// define mongoose comment schema for MongoDB
var commentSchema = new mongoose.Schema({
    text: String,
    author: String,
    commentDate: {type: Date, default: Date.now}
});

// define mongoose campground model based on schema
module.exports = mongoose.model("comment", commentSchema);