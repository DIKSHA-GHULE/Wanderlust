const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Wanderlust";

main()
  .then(() => {
    console.log("Connected to DB");
    initDB(); 
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}
const initDB = async () => {
  try {
    await Listing.deleteMany({});
    console.log("Database cleared. Starting geocoding...");

    const categories = ["trending", "rooms", "iconic", "mountains", "pools", "camping", "nature", "beaches"];

    const updatedListings = [];

    for (let obj of initData.data) {
      // Fetching real coordinates for each listing's location
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(obj.location)}&limit=1`;
      
      try {
        const response = await fetch(url, { headers: { 'User-Agent': 'MajorProject' } });
        const data = await response.json();

        let coords = [77.209, 28.613]; // Default if not found
        if (data && data.length > 0) {
          coords = [parseFloat(data[0].lon), parseFloat(data[0].lat)];
        }

        updatedListings.push({
          ...obj,
          owner: new mongoose.Types.ObjectId("69787174843d7ff97caadbca"),
          category: categories[Math.floor(Math.random() * categories.length)],
          geometry: { type: "Point", coordinates: coords }
        });

        // Small delay to respect API limits
        await new Promise(resolve => setTimeout(resolve, 1000)); 
        console.log(`Geocoded: ${obj.location}`);

      } catch (err) {
        console.log(`Failed for ${obj.location}, using default.`);
      }
    }

    await Listing.insertMany(updatedListings);
    console.log("Success: All listings initialized with real locations!");
  } catch (err) {
    console.log("Error:", err);
  }
};

// const initDB = async () => {
//   try {
//     // Purana data delete karein
//     await Listing.deleteMany({});

//     // Saari categories ki list
//     const categories = [
//       "trending", "rooms", "iconic", "mountains", "casals", 
//       "pools", "camping",  "arctic", "nature", "beaches"
//     ];

//     const listingsWithOwner = initData.data.map((obj) => ({
//       ...obj,
//       // Aapki Owner ID
//       owner: new mongoose.Types.ObjectId("69787174843d7ff97caadbca"),
      
//       // Har listing ko random category milegi
//       category: categories[Math.floor(Math.random() * categories.length)],
      
//       // Geometry ka error fix karne ke liye default coordinates
//       geometry: {
//         type: "Point",
//         coordinates: [77.209, 28.613] // New Delhi coordinates
//       }
//     }));

//     await Listing.insertMany(listingsWithOwner);
//     console.log("Success: Data was initialised with categories and geometry!");
    
//   } catch (err) {
//     console.log("Error during initialization:", err);
//   }
// };

// const mongoose = require("mongoose");
// const initData=require("./data.js");
// const Listing=require("../models/listing.js");
 
// const MONGO_URL="mongodb://127.0.0.1:27017/Wanderlust";
// main().then(()=>{
//     console.log("connected to DB");
// }).catch((err)=>{
//     console.log(err)
// })

// async function main() {
//   await mongoose.connect(MONGO_URL)
// }


// const initDB = async () => {
// await Listing.deleteMany({});
// const listingsWithOwner = initData.data.map((obj) => ({
// ...obj,
// owner: new mongoose.Types.ObjectId("69787174843d7ff97caadbca"),
// }));
// await Listing.insertMany(listingsWithOwner);
// console.log("data was initialised");
// };
// initDB();