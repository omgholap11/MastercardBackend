import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'donation-requests', // Folder name in Cloudinary
        allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        transformation: [
            { width: 800, height: 600, crop: 'limit' }, // Resize images
            { quality: 'auto' } // Auto optimize quality
        ]
    },
});

// Configure Multer with Cloudinary Storage
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 10 // Maximum 10 files per request
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        console.error('Error deleting image from Cloudinary:', error);
        throw error;
    }
};

// Function to upload single image
const uploadSingle = upload.single('image');

// Function to upload multiple images
const uploadMultiple = upload.array('images', 10); // Max 10 images

// Function to upload images for different categories
const uploadCategoryImages = upload.fields([
    { name: 'clothesImages', maxCount: 10 },
    { name: 'stationaryImages', maxCount: 10 },
    { name: 'foodsImages', maxCount: 10 },
    { name: 'furnitureImages', maxCount: 10 },
    { name: 'electronicsImages', maxCount: 10 }
]);

export {
    cloudinary,
    uploadSingle,
    uploadMultiple,
    uploadCategoryImages,
    deleteImage
};
