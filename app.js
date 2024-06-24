const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Listing = require("./Modules/Listing");


app.use(express.static(path.join(__dirname,"public")));
// setting path for views dir
app.set("views",path.join(__dirname,"views"));
// seting ejs as view engine :
app.set("view engine","ejs");
// to parse all the data resived into the body of form
app.use(express.urlencoded({extended : true}));
// Use method-override middleware
app.use(methodOverride('_method'));


app.listen(8080,()=>{
	console.log("app is listening at port : 8080");
}); 

// function call
main()
.then(()=>{
	console.log("connected to MongoDB");
})
.catch(err => console.log(err));

// function which connect to databse
async function main() {
	const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
	await mongoose.connect(MONGO_URL);
	}


app.get("/",(req,res)=>{
	res.render("view.ejs");
});




// Index rout!
app.get("/listings",async (req,res)=>{
	const allListings =  await Listing.find({});
	res.render("listings/index.ejs",{allListings});
});

// to render new listings form
app.get("/listings/new",(req,res)=>{
	res.render("listings/newListings.ejs")
});
 
// show rout 
app.get("/listings/:id", async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
res.render("listings/show.ejs", {listing});
});

// rout for crating new listings
app.post("/listings", async (req,res)=>{
	const data = req.body.listing;

	const newlisting = new Listing(data); 

	await newlisting.save().then((result)=>{
		console.log("listing added:"+result);
	}).catch((error)=>{
		console.log(error);
	});
	res.redirect("/listings");
});

// edit rout request to render edit from 
app.get("/listings/:id/edit",async (req,res)=>{
	const { id } = req.params;
    const listing = await Listing.findById(id);
	res.render("listings/edit.ejs",{listing});

});

// rout recive patch request	 for db update
app.put("/listings/:id",async (req, res)=>{
	const { id } = req.params;
	await Listing.findByIdAndUpdate(id,{...req.body.listing}); // deconstruction listing[ keys ]
	res.redirect(`/listings/${id}`);
});

//**************************************************************************** */
// // delete rout  (my way)
// app.delete("/listings/:id", async(req,res)=>{
// 	const {id} = req.params;
// 	let deletedListing = await Listing.deleteOne({_id:id});
// 	console.log(deletedListing);
// 	res.redirect("/listings");

// });

// delete rout ( maam way )
app.delete("/listings/:id", async(req,res)=>{
	const {id} = req.params;
	const deletedListing = await Listing.findByIdAndDelete(id);
	console.log(deletedListing);
	res.redirect("/listings");

});
// //chat gpt way 
// app.delete("/listings/:id", async (req, res) => {
// 	const { id } = req.params; // Extract the id from the request parameters
// 	try {
// 	  // Find the listing by id and delete it, returning the deleted document
// 	  const deletedListing = await Listing.findByIdAndDelete(id);
// 	  console.log(`Deleted listing:`, deletedListing); // Log the deleted document
  
// 	  // Redirect to the /listings page after deletion
// 	  res.redirect("/listings");
// 	} catch (error) {
// 	  // Log any errors that occur during the delete operation
// 	  console.error(`Error deleting listing: ${error.message}`);
// 	  // Respond with a 500 Internal Server Error status and an error message
// 	  res.status(500).json({ message: 'Internal server error' });
// 	}
//   });
  
//**************************************************************************** */