var mongoose            = require("mongoose");

// define mongoose campground schema for MongoDB
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "user"
                    },
                username: String
            },
    comments:   [
                    {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "comment"
                    }
                ]
});

// define mongoose campground model based on schema
module.exports = mongoose.model("campground", campgroundSchema);