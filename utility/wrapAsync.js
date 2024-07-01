// Function to wrap asynchronous middleware functions
function wrapAsync(fn) {
    // Return a new function that takes the standard middleware parameters
    return function (req, res, next) {
        // Call the asynchronous function and catch any errors
        // Pass errors to the next middleware (usually the error handler)
        fn(req, res, next).catch(next);
    }
}

// Export the wrapAsync function for use in other modules
module.exports = wrapAsync;