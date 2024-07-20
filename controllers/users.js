const User = require("../Modules/user.js");


module.exports.signupform =(req, res) => {
	res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
	try {
		let { username, password, email } = req.body;
		let newUser = new User(
			{
				email,
				username
			}
		);
		let registerUser = await User.register(newUser, password);
		req.login(registerUser,(error)=>{
			if(error){
				 return next(error);
			}else{
				console.log(registerUser);
				req.flash("success",`Hi ${req.user.username}, Wellcome to Wanderlust!`);
				res.redirect("/listings");
			}
		});

	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/signup");
	}
}

module.exports.login = async (req, res) => {
	req.flash("success",`Hi ${req.user.username}, Wellcome to Wanderlust!`);
	let redirectUrl = res.locals.redirectUrl || "/listings";
	// console.log(redirectUrl);
	res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logOut((error) => {
        if (error) {
            return res.status(500).send(error);
        }

        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
}