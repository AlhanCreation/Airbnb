const express = require("express");
const router = express.Router({mergeParams:true});
const ExpressError = require("../utility/ExpressError.js");
const wrapAsync = require("../utility/wrapAsync.js");
const { reviewSchema } = require("../schema.js");
const { isLogedIn, isReviewAuthor} = require("../middleware.js");
const listingReviwesControllers = require("../controllers/reviews.js"); 

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
router.post("/", isLogedIn,validateReview, wrapAsync( listingReviwesControllers.createReview));


	// Route to delete reviews:
router.delete("/:reviewId", isLogedIn,isReviewAuthor,wrapAsync(listingReviwesControllers.deleteReview));

module.exports = router;