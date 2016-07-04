var mongoose            = require("mongoose");

// define mongoose campground schema for MongoDB
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

// define mongoose campground model based on schema
module.exports = mongoose.model("campground", campgroundSchema);