const Joi = require('joi');
const review = require('./models/review');

// schema.js
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        // Ise aise likhein:
     image: Joi.object({
    url: Joi.string().required(),
    filename: Joi.string().allow("", null)
}),
category: Joi.string().valid(
            "trending", 
            "rooms", 
            "iconic", 
            "mountains", 
            "casals", 
            "pools", 
            "camping", 
            "arctic",
            "beaches",
            "nature"
        ).required()
    }).required()
});
module.exports.reviewSchema=Joi.object({
    review:Joi.object({
rating:Joi.number().required().min(1).max(5),
comment:Joi.string().required(),
    }).required()
});