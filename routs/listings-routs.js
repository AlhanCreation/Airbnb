const express = require("express");
const router = express.Router();
const ExpressError = require("../utility/ExpressError.js");
const wrapAsync = require("../utility/wrapAsync.js");
const { listingSchema} = require("../schema.js");
const { isLogedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js"); 
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");	
const upload = multer({ storage });


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
router.get("/", wrapAsync(listingController.index));

// to render new listings form
router.get("/new",isLogedIn,(req, res) => {
		res.render("listings/newListings.ejs")	
});

// Route for creating new listings ***************************
router.post("/",isLogedIn, upload.single('listing[image]'), validateListing ,wrapAsync(listingController.newListing)
);
// Show rout for perticuler lisitng
router.get("/:id", wrapAsync(listingController.show));


// edit rout request to render edit from 
router.get("/:id/edit",isLogedIn,isOwner, wrapAsync(listingController.edit));

// rout recive patch request for db update
router.put("/:id",isLogedIn,isOwner, upload.single('listing[image]'), validateListing ,wrapAsync(listingController.dbUpdate));


// delete rout
router.delete("/:id",isLogedIn,isOwner, wrapAsync(listingController.destroy));

module.exports = router;
