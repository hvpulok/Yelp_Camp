// Command to run Mongo DB: mongod --bind_ip=$IP --nojournal
var express         = require("express"),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override");

app.use(express.static(__dirname + "/public")); //to automatically get files under public/ anyother folder
app.set("view engine", "ejs"); // to exclude extention of "ejs" files
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
mongoose.connect("mongodb://localhost/yelp_camp"); // connection mongoose to MongoDB
app.use(methodOverride("_method"));

// define mongoose campground schema for MongoDB
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
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

// Create new Campground Route
app.get("/campgrounds/new", function(req, res) {
    res.render("addCampground");
});

app.post("/campgrounds",function(req,res){
    var newCampground = req.body.campground;
    
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
    campground.findById(req.params.id, function(err, selectedCampground){
        if(err){
            console.log(err);
        }else {
            console.log(selectedCampground);
            res.render("show", {selectedCampground:selectedCampground});
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
            console.log("Deleted Campground:");
            console.log(deletedCampground);
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
           console.log("Selected campground for Edit:");
           console.log(selectedCampground);
           res.render("edit", {selectedCampground:selectedCampground}) 
       }
   }); 
});

app.put("/campgrounds/:id", function(req, res){
    var updatedCampground = req.body.campground;
    campground.findByIdAndUpdate(req.params.id, updatedCampground, function(err, updatedCampground_data){
        if(err){
            console.log(err);
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
        }
    });
});



app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});