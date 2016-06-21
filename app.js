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

var campgroundData = [
        {name: "Camp 1", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg" },
        {name: "Camp 2", image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg" },
        {name: "Camp 3", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg" },
        {name: "Camp 4", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg" },
        {name: "Camp 5", image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg" },
        {name: "Camp 1", image: "https://farm4.staticflickr.com/3270/2617191414_c5d8a25a94.jpg" },
        {name: "Camp 2", image: "https://farm3.staticflickr.com/2464/3694344957_14180103ed.jpg" },
        {name: "Camp 3", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg" },
        {name: "Camp 4", image: "https://farm2.staticflickr.com/1281/4684194306_18ebcdb01c.jpg" },
        {name: "Camp 5", image: "https://farm8.staticflickr.com/7205/7121863467_eb0aa64193.jpg" }
        
    ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgroundData:campgroundData});
});

app.get("/addCampground", function(req, res) {
    res.render("addCampground");
});

app.post("/addCampground",function(req,res){
    var newCampgroundName = req.body.campgroundName;
    var newcampgroundImageURL = req.body.campgroundImageURL;
    var newCampground = {name: newCampgroundName, image: newcampgroundImageURL};
    campgroundData.push(newCampground);
    res.redirect("campgrounds");
    
});

app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});