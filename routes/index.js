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
           return res.render("register");
       } 
       passport.authenticate("local")(req, res, function(){
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
    res.redirect("/campgrounds");
})

// define middleware to check user already loggedin or not
// which can be used to protect viewing pages from unlogged users
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;