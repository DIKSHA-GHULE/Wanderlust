const express = require("express");
const listingController=require("../controllers/Reviews.js");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateReview, isreviewAuthor } = require("../middlewares");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js"); // keep only one import
const Listing = require("../models/listing.js");


//require
const ReviewsController=require("../controllers/Reviews.js");
// ✅ CREATE review
router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewsController.createReview));

// ✅ DELETE review
router.delete("/:reviewId",isLoggedIn,isreviewAuthor,wrapAsync(ReviewsController.deleteReview));

module.exports = router;

