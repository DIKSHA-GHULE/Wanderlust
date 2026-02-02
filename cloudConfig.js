const cloudinary = require('cloudinary').v2; // Pehle require karein
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// 2. Storage configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV',
        allowedFormats: ["png", "jpg", "jpeg"],

    },
});

// 3. SABSE LAST MEIN EXPORT KAREIN
module.exports = {cloudinary,storage};