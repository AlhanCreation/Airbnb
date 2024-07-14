module.exports.isLogedIn = (req,res,next)=>{
	if(! req.isAuthenticated()){
		req.flash("error","You need to login!");
		res.redirect("/login");
	}
	next();
};