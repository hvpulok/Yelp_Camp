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
    LocalStrategy       = require("passport-local"),
    flash               = require("connect-flash");

// ==========Importing routers====================    
var indexRoutes         = require("./routes/index"),
    campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments");
    
app.use(express.static(__dirname + "/public")); //to automatically get files under public/ anyother folder
app.set("view engine", "ejs"); // to exclude extention of "ejs" files
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp"; // define environment variables to hide actual server address. In herouk env variables are defined in settings> config var
mongoose.connect(url); // connection mongoose to local MongoDB// in cmd write this code : export DATABASEURL=mongodb://localhost/yelp_camp

app.use(methodOverride("_method"));
app.use(expressSanitizer()); // use sanitizer to suppress user inputed scripts for security reasons
app.use(flash());   //use flash npm to show flash messages

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

// define middleware to make available user information in all pages
app.use(function(req,res,next){
   res.locals.currentUser = req.user;
   res.locals.error_message = req.flash("error");
   res.locals.success_message = req.flash("success");
   next();
});

// ==========Routers====================
app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comment",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});