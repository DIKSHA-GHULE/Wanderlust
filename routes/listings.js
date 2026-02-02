const express = require("express");
const router = express.Router();
const listingController=require("../controllers/listings.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing");
const {isLoggedIn, isOwner,validateListing}=require("../middlewares.js");
const multer=require("multer");
const{storage}=require("../cloudConfig.js");
const upload=multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
wrapAsync(listingController.createListing))



// NEW
router.get("/new",isLoggedIn,listingController.renderNewForm );

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,
    isOwner,
     upload.single('listing[image]'),
    validateListing, 
    wrapAsync(listingController.updateListing))
.delete(isLoggedIn,wrapAsync(listingController.destroyListing));
// EDIT FORM
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm)
);





module.exports = router;