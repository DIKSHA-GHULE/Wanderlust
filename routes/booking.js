const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const { isLoggedIn } = require("../middlewares");

router.post("/:listingId", isLoggedIn, async (req, res) => {
  const { listingId } = req.params;
  const { checkIn, checkOut, totalPrice } = req.body;

  const booking = new Booking({
    user: req.user._id,
    listing: listingId,
    checkIn,
    checkOut,
    totalPrice
  });

  await booking.save();
  req.flash("success", "Booking successful!");
  res.redirect("/bookings");
});
router.get("/", isLoggedIn, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("listing");

  res.render("bookings/index", { bookings });
});


module.exports = router;
