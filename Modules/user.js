// Import the mongoose library to interact with MongoDB
const mongoose = require("mongoose");

// Create a new Schema object from mongoose
const Schema = mongoose.Schema;

// Import the passport-local-mongoose plugin for user authentication
const passportLocalMongoose = require('passport-local-mongoose');

// Define the user schema with an email field that is required
const userSchema = new Schema({
    email: { type: String, required: true } // Email field of type String, required for each user
});

// Add the passport-local-mongoose plugin to the user schema
// This plugin will add username, hash, and salt fields to the schema and also provide methods for user authentication
userSchema.plugin(passportLocalMongoose);

// Export the User model, which is based on the user schema
module.exports = mongoose.model('User', userSchema);

