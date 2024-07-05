const mongoose = require("mongoose");
const Review = require("./Review.js");
const Schema = mongoose.Schema;
// const Review = require(".Review.js")

const imageSchema = new Schema({
	filename: {
	  type: String,
	  default: "listingimage"
	},
	url: {
	  type: String,
	  default: "https://unsplash.com/photos/a-group-of-flamingos-standing-next-to-each-other-jzbLdt3EncQ",
	  set: (v) => {
		return v.trim() === "" ? "https://unsplash.com/photos/a-group-of-flamingos-standing-next-to-each-other-jzbLdt3EncQ" : v;
	  }
	}
  }, { _id: false });

const listingSchema = new Schema(
	{
		title: {
			type: String,
			required : true,
		},

		description:{
			type: String,
			required : true,
		},
		image:{
			type:String,
			default:"https://images.unsplash.com/photo-1718571702272-1b0f9009d97c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
			set: (v) => 
				 v === "" ? "https://images.unsplash.com/photo-1718571702272-1b0f9009d97c?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" : v
			// or 
			// set: (v) => {
			// 	return v.trim() === "" ? "https://unsplash.com/photos/a-group-of-flamingos-standing-next-to-each-other-jzbLdt3EncQ" : v;
			// }

			// type: imageSchema,
			// default: () => ({})
	
		},
		price:{
			type:Number,
		},
		location:{
			type:String,
		},
		country:{
			type:String,
		},
		reviews:[
			{
				type:Schema.Types.ObjectId,
				ref:"Review" // refrence mai model deyte hain 
			}
		],
	}
);


listingSchema.post("findOneAndDelete",async(listing)=>{
	await Review.deleteMany({reviews: {$in:listing.reviews}});
});
const Listing = new mongoose.model("Listing",listingSchema);

module.exports = Listing;