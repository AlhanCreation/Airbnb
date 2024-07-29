if (process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./utility/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./Modules/user.js")


const listingsRouter = require("./routs/listings-routs.js");
const reviewsRouter = require("./routs/reviews-routs.js");
const userRouter = require("./routs/user-routs.js");

app.use(express.static(path.join(__dirname, "public")));
// setting path for views dir
app.set("views", path.join(__dirname, "views"));
// seting ejs as view engine :
app.set("view engine", "ejs");
// to parse all the data resived into the body of form
app.use(express.urlencoded({ extended: true }));
// Use method-override middleware
app.use(methodOverride('_method'));

const sessionOption = {
	secret: 'mysupersecretkey',
	resave: false,
	saveUninitialized: true,
	cookie: {
		expire: Date.now() + 7 * 24 * 60 * 60 * 1000,
		maxAge: 7 * 24 * 60 * 60 * 1000,
		httpOnly: true,
	}
};

app.listen(8080, () => {
	console.log("app is listening at port : 8080");
});


// function call
main()
	.then(() => {
		console.log("connected to MongoDB");
	})
	.catch(err => console.log(err));

// function which connect to databse
async function main() {
	const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
	await mongoose.connect(MONGO_URL);
}


app.use(session(sessionOption));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.success = req.flash("success");
	res.locals.failuer = req.flash("error");
	res.locals.currentUser = req.user;

	next();
});

app.get("/", (req, res) => {
	res.render("view.ejs");
});

// app.get("/demouser",async (req,res)=>{
// 	let fakeUser = new User(
// 		{
// 			email:"fakeuser001@gmail.com",
// 			username: "alpha-student"
// 		}
// 	);
// 	let registerUser = await User.register(fakeUser,"helloworld");
// 	res.send(registerUser);
// });

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/",userRouter);


// requiring ejs- mate
const ejs_mate = require("ejs-mate");

// defining engine for ejs as ejs mate  , // Set 'ejs-mate' as the engine for .ejs files
app.engine("ejs", ejs_mate);

//
app.all("*", (req, res, next) => {
	next(new ExpressError(404, "Page not found!!!"))
});

// Golble error handing middleware
app.use((error, req, res, next) => {
	let defaultMessage = "Something went wrong!";
	let defaultStatus = 500;
	let { statusCode = defaultStatus, message = defaultMessage } = error;
	res.status(statusCode).render("listings/error.ejs", { message });
});
