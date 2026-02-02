const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type: String,
        required: true // Ensures a review isn't empty
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    createdAt: {
        type: Date,
        default: Date.now() // Sets current time automatically
    },
    author :{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

// Create the model and export it
module.exports = mongoose.model("Review", reviewSchema);