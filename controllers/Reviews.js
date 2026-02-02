const Listing = require("../models/listing");
const Review = require("../models/review"); // ✅ THIS WAS MISSING
module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("sucess", "New Review created!"); //
    res.redirect(`/listings/${listing._id}`);
  }
module.exports.deleteReview=async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);
    req.flash("sucess", "Review deleted!"); //
    res.redirect(`/listings/${id}`);
  }