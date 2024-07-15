const express = require("express");
const router = express.Router();
const User = require("../Modules/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");
const { saveRedirect } = require("../middleware.js");


router.get("/signup", (req, res) => {
	res.render("users/signup.ejs");
});

router.post("/signup", wrapAsync(async (req, res) => {
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
				req.flash("success", "Wellcome to wanderlust!");
				res.redirect("/listings");
			}
		});

	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/signup");
	}
}));

router.get("/login",(req,res)=>{
	res.render("users/login.ejs");
});

router.post("/login",
		saveRedirect,passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}),
		async (req, res) => {
			req.flash("success","Wellcome to Wanderlust!");
			let redirectUrl = res.locals.redirectUrl || "/listings";
			res.redirect(redirectUrl);
});

router.get("/logout", (req, res) => {
    req.logOut((error) => {
        if (error) {
            return res.status(500).send(error);
        }

        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings");
    });
});


	module.exports = router;