
const Review = require("../Modules/Review.js");
const Listing = require("../Modules/Listing.js");

module.exports.createReview = async (req, res) => {

	const listing = await Listing.findById(req.params.id);
	const newReview = new Review(req.body.review);
	newReview.author = req.user._id;
	await listing.reviews.push(newReview);
	// console.log(newReview);
	await newReview.save();
	await listing.save();
	req.flash("success","New review added");
	res.redirect(`/listings/${listing.id}`);
}

module.exports.deleteReview = async (req, res) => {
	const { id, reviewId } = req.params;
	// console.log(req.params);	
	// This 
	await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
	// by this review will delete from reviews collection 
	await Review.findByIdAndDelete(reviewId);
	req.flash("error","Review deleted!");
	res.redirect(`/listings/${id}`);
}