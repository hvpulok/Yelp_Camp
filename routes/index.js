var express             = require("express"),
    router              = express.Router(),
    passport            = require("passport"),
    user                = require("../models/user");

//=======Root Route Definitions============
router.get("/", function(req, res){
    res.render("landing");
});

//============= Auth Routes=======================================
// show register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Handle registeration or sign up logic
router.post("/register", function(req, res) {
    var newUser = new user({username: req.body.username});
    user.register(newUser, req.body.password, function(err, user){
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.redirect("register");
       } 
       passport.authenticate("local")(req, res, function(){
           req.flash("success", user.username+" is Successfully signed-up!");
            res.redirect("/campgrounds");
       });
    });
})

// show login form
router.get("/login", function(req, res) {
    res.render("login");
});

// Handle user Log In logic
router.post("/login",passport.authenticate("local",
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"}
),function(req, res) {});

// logout route logic
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Successfully logged you out.");
    res.redirect("/campgrounds");
})

module.exports = router;