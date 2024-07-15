const express = require("express");
const router = express.Router();
const ExpressError = require("../utility/ExpressError.js");
const Listing = require("../Modules/Listing.js");
const wrapAsync = require("../utility/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const { isLogedIn, isOwner } = require("../middleware.js");


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

// Index rout!
router.get("/", wrapAsync(
	async (req, res) => {
		const allListings = await Listing.find({});
		res.render("listings/index.ejs", { allListings });
	}
));

// to render new listings form
router.get("/new",isLogedIn,(req, res) => {
		res.render("listings/newListings.ejs")	
});

// Show rout 
router.get("/:id", wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const listing = await Listing.findById(id).populate("reviews").populate("owner");
		if(!listing){
			req.flash("error","listing not found");
			res.redirect("/listings");
		}
		else{
			res.render("listings/show.ejs", { listing });
		}
	}
));


// Route for creating new listings ***************************
router.post("/",isLogedIn, validateListing, wrapAsync(
	async (req, res) => {
		// Extract the listing data from the request body
		const data = req.body.listing;
		// Create a new Listing instance with the extracted data
		let newlisting = new Listing(data);
		newlisting.owner = req.user._id;
		// Save the new listing to the database
		await newlisting.save();
		req.flash("success","New Listing crated!");
		// Redirect the client to the /listings route after saving
		res.redirect("/listings");
	}
));

// edit rout request to render edit from 
router.get("/:id/edit",isLogedIn,isOwner, wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const listing = await Listing.findById(id);
		res.render("listings/edit.ejs", { listing });

	}
));

// rout recive patch request for db update
router.put("/:id",isLogedIn,isOwner, wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // deconstruction listing[ keys ]
		req.flash("success","Your lsiting updated!"); 
		res.redirect(`/listings/${id}`);
	}
));


// delete rout
router.delete("/:id",isLogedIn,isOwner, wrapAsync(
	async (req, res) => {
		const { id } = req.params;
		const deletedListing = await Listing.findByIdAndDelete(id);
		req.flash("error","Listing has been deleted!");
		console.log(deletedListing);
		res.redirect("/listings");
	}
));

module.exports = router;