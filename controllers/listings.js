const Listing = require("../models/listing");
//const NodeGeocoder = require('node-geocoder');

// const geocoder = NodeGeocoder({
//     provider: 'nominatim',
//     httpAdapter: 'https',
// });

module.exports.index=async (req, res) => {
  const { search ,category} = req.query;
    let query = {};
    // 1. Search Logic: Title, Location ya Country mein search dhoondne ke liye
    if (category) {
        query.category = category;
    }
    else if (search && search.trim() !== "") {
        query = {
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ]
        };
    }
   
    const allListings = await Listing.find(query);
    res.render("listings/index", { allListings });
  }


 module.exports.renderNewForm = (req, res) => {
res.render("listings/new.ejs");
}

 module.exports.showListings=async (req, res) => {
     const { id } = req.params;
     const listing = await Listing.findById(id)
     .populate({path :"reviews",
       populate:{
       path:"author"
     },})
     .populate("owner");
     if (!listing) {
     req.flash("error", "listing you requeste for does not exist!");
   res.redirect("/listings");
   }
   console.log(listing);
     res.render("listings/show", { listing });
   };

module.exports.createListing = async (req, res, next) => {
    const location = req.body.listing.location;
    // Nominatim API URL
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
    
    try {
        const response = await fetch(url, {
            headers: { 'User-Agent': 'MajorProject-App' } 
        });
        const data = await response.json();

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        // GeoJSON Storing Logic
        if (data && data.length > 0) {
            newListing.geometry = {
                type: 'Point',
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] 
            };
            console.log("Success: Coordinates saved!", newListing.geometry.coordinates);
        } else {
            // Default Fallback
            newListing.geometry = { type: 'Point', coordinates: [77.209, 28.613] };
            console.log("Default coordinates used.");
        }

        if (req.file) {
            newListing.image = { url: req.file.path, filename: req.file.filename };
        }

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    } catch (err) {
        console.error("Geocoding Error:", err);
        next(err);
    }
};


   module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      return res.redirect("/listings");
    }

    let originalImageUrl =listing.image.url;
    originalImageUrl .replace("/upload","/upload/h_300,w_250")
    res.render("listings/edit", {listing,originalImageUrl });
  }
  
  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    // AGAR location update hui hai, toh naye coordinates fetch karein
    if (req.body.listing.location) {
        const location = req.body.listing.location;
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
        
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'MajorProject-App' } });
            const data = await response.json();

            if (data && data.length > 0) {
                listing.geometry = {
                    type: 'Point',
                    coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)] 
                };
                await listing.save(); // Naye coordinates save karein
                console.log("Updated Coordinates:", listing.geometry.coordinates);
            }
        } catch (err) {
            console.log("Geocoding Error during update:", err);
        }
    }

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};
// module.exports.updateListing= async (req, res) => {
//     const { id } = req.params;
//   let listing=  await Listing.findByIdAndUpdate(id, req.body.listing);
//     if ( typeof req.file !== "undefined") {
//     const url = req.file.path;
//     const filename = req.file.filename;
//     listing.image = { url, filename };
//     await listing.save();
//   }
//     req.flash("sucess", "Listing updated!");
//     res.redirect(`/listings/${id}`);
//   }



  module.exports.destroyListing=async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    req.flash("sucess", "New listing deleted!");
    res.redirect("/listings");
  }