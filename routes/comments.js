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

// define middleware to check user already loggedin or not
// which can be used to protect viewing pages from unlogged users
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;