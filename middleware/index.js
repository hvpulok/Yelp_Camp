// all the middleware goes here
var campground  = require("../models/campground"),
    comment     = require("../models/comment");

var middlewareObj = {};     // define empty object

// storing checkCampgroundOwnership function in middlewareObj object
middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        //find the selected campground
        campground.findById(req.params.id, function(err, selectedCampground) {
            if(err){
                res.redirect("back"); // redirect to previous page
            }else{
                // check creator and current user is same or not
                if(selectedCampground.author.id.equals(req.user.id)){
                    return next();
                } else{
                    res.redirect("back"); // redirect to previous page
                }
            }
        });
    } else{
        res.redirect("/login"); // redirect to login page
    }
}

// storing checkCampgroundOwnership function in middlewareObj object
middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        //find the selected campground
        comment.findById(req.params.comment_id, function(err, selectedComment) {
            if(err){
                console.log(err);
                res.redirect("back"); // redirect to previous page
            }else{
                // check creator and current user is same or not
                if(selectedComment.author.id.equals(req.user.id)){
                    return next();
                } else{
                    res.redirect("back"); // redirect to previous page
                }
            }
        });
    } else{
        res.redirect("/login"); // redirect to login page
    }
}

// To check user already loggedin or not
// which can be used to protect viewing pages from unlogged users
middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;