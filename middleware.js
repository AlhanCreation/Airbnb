const Listing = require("./Modules/Listing.js");

module.exports.isLogedIn = (req,res,next)=>{
	if(! req.isAuthenticated()){
		req.session.redirectUrl = req.originalUrl;
		req.flash("error","You need to login!");
	 return	res.redirect("/login");
	}
	next();
};

module.exports.saveRedirect = (req,res,next)=>{
	if(req.session.redirectUrl){
		res.locals.redirectUrl = req.session.redirectUrl ;
	}
	next();
};

module.exports.isOwner = async(req,res,next)=>{
	const { id } = req.params;
		let  listings = await Listing.findById(id);
		if(!listings.owner.equals(res.locals.currentUser._id)){
			req.flash("error","You are not the owner of this listing!")
			 return res.redirect(`/listings/${id}`);
		}
		next();
}