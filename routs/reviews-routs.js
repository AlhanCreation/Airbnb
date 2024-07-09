const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utility/ExpressError.js");
const Review = require("../Modules/Review.js");
const Listing = require("../Modules/Listing.js");
const wrapAsync = require("../utility/wrapAsync.js");
const { reviewSchema } = require("../schema.js");



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


// post rout for uploding data into the Reviews model
router.post("/", validateReview, wrapAsync(
	async (req, res) => {

		const listing = await Listing.findById(req.params.id);
		const newReview = new Review(req.body.review);

		await listing.reviews.push(newReview);
		await newReview.save();
		await listing.save();
		req.flash("success","New review added");
		res.redirect(`/listings/${listing.id}`);
	}));


	// Route to delete reviews:
router.delete("/:reviewId", wrapAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	// This 
	await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
	// by this review will delete from reviews collection 
	await Review.findByIdAndDelete(reviewId);
	req.flash("failuer","Review deleted!");
	res.redirect(`/listings/${id}`);
	
}));

module.exports = router;