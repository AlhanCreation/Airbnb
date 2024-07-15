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