const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");


app.use(express.static(path.join(__dirname,"public")));
// setting path for views dir
app.set("views",path.join(__dirname,"views"));
// seting ejs as view engine :
app.set("view engine","ejs");
// to parse all the data resived into the body of form
app.use(express.urlencoded({extended : true}));
// Use method-override middleware
app.use(methodOverride('_method'));


app.listen(8080,()=>{
	console.log("app is listening at port : 8080");
}); 

// function call
main()
.then(()=>{
	console.log("connected to MongoDB");
})
.catch(err => console.log(err));

// function which connect to databse
async function main() {
	const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
	await mongoose.connect(MONGO_URL);
	}


app.get("/",(req,res)=>{
	res.render("view.ejs");
});