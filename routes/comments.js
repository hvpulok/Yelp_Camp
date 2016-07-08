var express             = require("express"),
    router              = express.Router({mergeParams: true}),
    campground          = require("../models/campground"),
    comment             = require("../models/comment");

//=============Comments Routes=======================================

//Create Route
router.get("/new", isLoggedIn,function(req, res) {
    campground.findById(req.params.id, function(err, selectedCampground) {
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {selectedCampground:selectedCampground});
        }
    })
});

router.post("/", isLoggedIn,function(req, res){
    //retrieve the comments from the form body
    var newComment = req.body.comment;
    //find the selected campground
    campground.findById(req.params.id, function(err, selectedCampground) {
        if(err){
            console.log(err);
        } else{
            // Create newComment in comment DB
            comment.create(newComment, function(err, newComment){
                if(err){
                    console.log(err);
                } else{
                    //add username and id to newComment
                    newComment.author.id = req.user.id;
                    newComment.author.username = req.user.username;
                    newComment.save();
                    // Connect newComment to selectedCampground
                    selectedCampground.comments.push(newComment);
                    selectedCampground.save();
                    // redirect to selectedCampground show page
                    res.redirect("/campgrounds/" + req.params.id);
                    // console.log(selectedCampground);
                }
            });
        }
    })
});

// comment Edit route
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
    var selectedCampground = req.params.id;
    var selectedComment = req.params.comment_id;
    campground.findById(selectedCampground).populate("comments").exec(function(err, selectedCampground){
        if(err){
            console.log(err);
        }else {
            comment.findById(selectedComment, function(err, selectedComment) {
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else{
                    console.log(selectedComment);
                    res.render("comments/edit", {selectedCampground:selectedCampground, selectedComment:selectedComment});                    
                }
            })
        }
    });
});

// Comment post/ PUT route
router.put("/:comment_id/", checkCommentOwnership, function(req, res){
    comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedCommentData){
        if(err){
            console.log(err);
            res.redirect("back");
        } else{
            console.log(updatedCommentData);
            res.redirect("/campgrounds/"+ req.params.id);
        }
    })
});


// define middleware to check user already loggedin or not
// which can be used to protect viewing pages from unlogged users
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

// to check ownership of selected comment
function checkCommentOwnership(req, res, next){
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

module.exports = router;