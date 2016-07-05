var mongoose = require("mongoose");

// define mongoose user schema for MongoDB
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

// define mongoose campground model based on schema
module.exports = mongoose.model("user", userSchema);