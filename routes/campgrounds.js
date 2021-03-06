var express             = require("express"),
    router              = express.Router(),
    campground          = require("../models/campground"),
    middleware          = require("../middleware/index.js");

//=============campground Routes=======================================
//show route
router.get("/", function(req, res){
    //get all campgrounds from dB
    campground.find({}, function(err, allCampgroundData){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgroundData:allCampgroundData});
        }
    });
});

// Create new Campground Route
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

router.post("/", middleware.isLoggedIn,function(req,res){
    var newCampground = req.body.campground;
    newCampground.description = req.sanitize(newCampground.description);
    // store in MongoDB
    campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
                // add username and id to newCampground
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
            // console.log("Newly created Campground: ");    
            // console.log(campground);
        }
    });

    res.redirect("campgrounds");
});

// Route to show page of selected campground
router.get("/:id",function(req, res) {
    //get all campgrounds from dB, this is to show campground links in sidebar
    var allCampgroundData;
    campground.find({}, function(err, campgroundData){
        if(err){
            console.log(err);
        } else {
            allCampgroundData = campgroundData;
        }
    });
     //get selected campgrounds from dB
    
    campground.findById(req.params.id).populate("comments").exec(function(err, selectedCampground){
        if(err){
            console.log(err);
        }else {
            // console.log(selectedCampground);
            res.render("campgrounds/show", {selectedCampground:selectedCampground, campgroundData:allCampgroundData});
        }
    });
});

// Delete selected campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    campground.findByIdAndRemove(req.params.id, function(err, deletedCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else {
            // console.log("Deleted Campground:");
            // console.log(deletedCampground);
            res.redirect("/campgrounds");
        }
    });
});

//Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
   campground.findById(req.params.id, function(err,selectedCampground){
       if(err){
           console.log(err);
       } else {
        //   console.log("Selected campground for Edit:");
        //   console.log(selectedCampground);
           res.render("campgrounds/edit", {selectedCampground:selectedCampground}) 
       }
   }); 
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    var updatedCampground = req.body.campground;
    updatedCampground.description = req.sanitize(updatedCampground.description);
    campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updatedCampground_data){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});

module.exports = router;