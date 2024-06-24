const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
			default:"https://unsplash.com/photos/a-group-of-flamingos-standing-next-to-each-other-jzbLdt3EncQ",
			set: (v) => 
				 v === "" ? "https://unsplash.com/photos/a-group-of-flamingos-standing-next-to-each-other-jzbLdt3EncQ" : v
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
	}
);

const Listing = new mongoose.model("Listing",listingSchema);

module.exports = Listing;