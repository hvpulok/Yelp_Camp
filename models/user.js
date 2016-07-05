var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");     //for mongoose local auth

// define mongoose user schema for MongoDB
var userSchema = new mongoose.Schema({
    username: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);   // mongoose local user auth plugins add

// define mongoose campground model based on schema
module.exports = mongoose.model("user", userSchema);