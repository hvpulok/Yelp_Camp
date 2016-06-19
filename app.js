var express = require("express");
var app = express();
var bodyParser = require('body-parser');

app.use(express.static("public")); //to automatically get files under public/ anyother folder
app.set("view engine", "ejs"); // to exclude extention of "ejs" files
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded


app.get("/", function(req, res){
    res.send("This is Home Page!");
});


app.listen(process.env.PORT, process.env.IP, function(req, res){
    console.log("Yelp Camp Server has Started");
});