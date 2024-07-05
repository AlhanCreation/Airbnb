const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./Modules/Listing.js");
const Review = require("./Modules/Review.js");
const wrapAsync = require("./utility/wrapAsync.js");
const ExpressError = require("./utility/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


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




// Index rout!
app.get("/listings", wrapAsync(
	async (req, res) => {
		const allListings = await Listing.find({});
		res.render("listings/index.ejs", { allListings });
	}
));

// Route to delete reviews:
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	// This 
	let r=await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
	// by this review will delete from reviews collection 
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/listings/${id}`);
	
}));

// to render new listings form
app.get("/listings/new", (req, res) => {
	res.render("listings/newListings.ejs")
});

// show rout 
app.get("/listings/:id", wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews");
		res.render("listings/show.ejs", { listing });
	}
));

// Middleware function to validate the schema of the request body
function validateListing(req, res, next) {
	// Validate the request body against the defined schema
	let { error } = listingSchema.validate(req.body);
	if (error) {
		// If there is an error, throw an ExpressError with status code 400 and the error message
		throw new ExpressError("400", error);
	} else {
		// If validation passes, move to the next middleware or route handler
		next();
	}
}
// Middleware function to validate the reviewSchema of the request body
function validateReview(req, res, next) {
	// Validate the request body against the defined schema
	let { error } = reviewSchema.validate(req.body);
	if (error) {
		// If there is an error, thro w an ExpressError with status code 400 and the error message
		throw new ExpressError("400", error);
	} else {
		// If validation passes, move to the next middleware or route handler
		next();
	}
}


// Route for creating new listings ***************************
app.post("/listings", validateListing, wrapAsync(
	async (req, res) => {
		// Extract the listing data from the request body
		const data = req.body.listing;
		// Create a new Listing instance with the extracted data
		const newlisting = new Listing(data);
		// Save the new listing to the database
		await newlisting.save();
		// Redirect the client to the /listings route after saving
		res.redirect("/listings");
	}
));

// post rout for uploding data into the Reviews model
app.post("/listings/:id/reviews", validateReview, wrapAsync(
	async (req, res) => {

		const listing = await Listing.findById(req.params.id);
		const newReview = new Review(req.body.review);

		await listing.reviews.push(newReview);
		await newReview.save();
		await listing.save();

		res.redirect(`/listings/${listing.id}`);
	}));

// edit rout request to render edit from 
app.get("/listings/:id/edit", wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const listing = await Listing.findById(id);
		res.render("listings/edit.ejs", { listing });

	}
));

// rout recive patch request for db update
app.put("/listings/:id", wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstruction listing[ keys ]
		res.redirect(`/listings/${id}`);
	}
));


// delete rout ( maam way )
app.delete("/listings/:id", wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const deletedListing = await Listing.findByIdAndDelete(id);
		console.log(deletedListing);
		res.redirect("/listings");

	}
));
// //chat gpt way 
// app.delete("/listings/:id", async (req, res) => {
// 	const { id } = req.params; // Extract the id from the request parameters
// 	try {
// 	  // Find the listing by id and delete it, returning the deleted document
// 	  const deletedListing = await Listing.findByIdAndDelete(id);
// 	  console.log(`Deleted listing:`, deletedListing); // Log the deleted document

// 	  // Redirect to the /listings page after deletion
// 	  res.redirect("/listings");
// 	} catch (error) {
// 	  // Log any errors that occur during the delete operation
// 	  console.error(`Error deleting listing: ${error.message}`);
// 	  // Respond with a 500 Internal Server Error status and an error message
// 	  res.status(500).json({ message: 'Internal server error' });
// 	}
//   });

//**************************************************************************** */

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