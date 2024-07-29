const mongoose = require("mongoose");
const Review = require("./Review.js");
const Schema = mongoose.Schema;
const User = require("./user.js");



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
		owner:{
			type:Schema.Types.ObjectId,
			ref:"User"
		},
	}
);


listingSchema.post("findOneAndDelete",async(listing)=>{
	await Review.deleteMany({reviews: {$in:listing.reviews}});
});
const Listing = new mongoose.model("Listing",listingSchema);

module.exports = Listing;