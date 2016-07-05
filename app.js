// Command to run Mongo DB: mongod --bind_ip=$IP --nojournal
var express             = require("express"),
    app                 = express(),
    bodyParser          = require('body-parser'),
    mongoose            = require("mongoose"),
    expressSanitizer    = require("express-sanitizer"),
    methodOverride      = require("method-override"),
    campground          = require("./models/campground"),
    comment             = require("./models/comment"),
    user                = require("./models/user"),         //requiring user model DB
    passport            = require("passport"),
    LocalStrategy       = require("passport-local");
    
app.use(express.static(__dirname + "/public")); //to automatically get files under public/ anyother folder
app.set("view engine", "ejs"); // to exclude extention of "ejs" files
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
mongoose.connect("mongodb://localhost/yelp_camp"); // connection mongoose to MongoDB
app.use(methodOverride("_method"));
app.use(expressSanitizer()); // use sanitizer to suppress user inputed scripts for security reasons

//=======Passport Configurations============
app.use(require("express-session")({
    secret: "This world is beautiful",
    resave: false,
    saveUninitialized : false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//=======Route Definitions============
app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res) {
    res.render("campgrounds/new");
});

app.post("/campgrounds",function(req,res){
    var newCampground = req.body.campground;
    newCampground.description = req.sanitize(newCampground.description);
    
    // store in MongoDB
    campground.create(newCampground, function(err, campground){
        if(err){
            console.log(err);
        } else {
            console.log("Newly created Campground: ");    
            console.log(campground);
        }
    });

    res.redirect("campgrounds");
});


// Route to show page of selected campground
app.get("/campgrounds/:id",function(req, res) {
    campground.findById(req.params.id).populate("comments").exec(function(err, selectedCampground){
        if(err){
            console.log(err);
        }else {
            // console.log(selectedCampground);
            res.render("campgrounds/show", {selectedCampground:selectedCampground});
        }
    });
});


// Delete selected campground route
app.delete("/campgrounds/:id", function(req, res){
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
app.get("/campgrounds/:id/edit", function(req, res) {
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

app.put("/campgrounds/:id", function(req, res){
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


//=============Comments Routes=======================================

//Create Route
app.get("/campgrounds/:id/comment/new", isLoggedIn,function(req, res) {
    campground.findById(req.params.id, function(err, selectedCampground) {
        if(err){
            console.log(err);
        } else{
            res.render("comments/new", {selectedCampground:selectedCampground});
        }
    })
});

app.post("/campgrounds/:id", isLoggedIn,function(req, res){
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

//============= Auth Routes=======================================
// show register form
app.get("/register", function(req, res) {
    res.render("register");
});

// Handle registeration or sign up logic
app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
    res.render("login");
});

// Handle user Log In logic
app.post("/login",passport.authenticate("local",
    {successRedirect: "/campgrounds",
    failureRedirect: "/login"}
),function(req, res) {});

// logout route logic
app.get("/logout", function(req, res) {
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

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});