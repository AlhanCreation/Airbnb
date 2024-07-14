const express = require("express");
const router = express.Router();
const User = require("../Modules/user.js");
const wrapAsync = require("../utility/wrapAsync.js");
const passport = require("passport");


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
		console.log(registerUser);
		req.flash("success", "Wellcome to wanderlust!")
		res.redirect("/listings");

	} catch (error) {
		req.flash("error", error.message);
		res.redirect("/signup");
	}
}));

router.get("/login",(req,res)=>{
	res.render("users/login.ejs");
});

router.post("/login",
		passport.authenticate("local", { failureRedirect: "/login", failureFlash: true}),
		async (req, res) => {
			req.flash("success","Wellcome to Wanderlust!");
			res.redirect("/listings");
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