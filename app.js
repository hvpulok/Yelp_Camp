// Command to run Mongo DB: mongod --bind_ip=$IP --nojournal
var express         = require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose");

app.use(express.static("public")); //to automatically get files under public/ anyother folder
app.set("view engine", "ejs"); // to exclude extention of "ejs" files
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
mongoose.connect("mongodb://localhost/yelp_camp"); // connection mongoose to MongoDB

// define mongoose campground schema for MongoDB
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

// define mongoose campground model based on schema
var campground = mongoose.model("campground", campgroundSchema);

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from dB
    campground.find({}, function(err, allCampgroundData){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgroundData:allCampgroundData});
        }
    });
});

app.get("/addCampground", function(req, res) {
    res.render("addCampground");
});

app.post("/addCampground",function(req,res){
    var newCampgroundName = req.body.campgroundName;
    var newcampgroundImageURL = req.body.campgroundImageURL;
    var newCampground = {name: newCampgroundName, image: newcampgroundImageURL};
    
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

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});