const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utility/ExpressError.js");

const listingsRouts = require("./routs/listings-routs.js");
const reviewsRouts = require("./routs/reviews-routs.js");

app.use(express.static(path.join(__dirname, "public")));
// setting path for views dir
app.set("views", path.join(__dirname, "views"));
// seting ejs as view engine :
app.set("view engine", "ejs");
// to parse all the data resived into the body of form
app.use(express.urlencoded({ extended: true }));
// Use method-override middleware
app.use(methodOverride('_method'));


app.listen(8080, () => {
	console.log("app is listening at port : 8080");
});


// function call
main()
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch(err => console.log(err));

// function which connect to databse
async function main() {
	const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
	await mongoose.connect(MONGO_URL);
}


app.get("/", (req, res) => {
	res.render("view.ejs");
});

app.use("/listings",listingsRouts);
app.use("/listings/:id/reviews",reviewsRouts);


// requiring ejs- mate
const ejs_mate = require("ejs-mate");

// defining engine for ejs as ejs mate  , // Set 'ejs-mate' as the engine for .ejs files
app.engine("ejs", ejs_mate);

//
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found!!!"))
});

// Golble error handing middleware
app.use((error, req, res, next) => {
	let defaultMsg = "Somting went wrong!";
	let defaultStatus = 500;
	// res.status(500).send("something went wrong!")
	let { statusCode = defaultStatus, message = defaultMsg } = error;
	res.status(statusCode).render("listings/error.ejs", { message })
});