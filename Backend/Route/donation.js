import express from "express";
import { 
    createDonation, 
    getAllDonations, 
    getDonationById, 
    updateDonationStatus,
    getDonationsByDonorId 
} from "../Controllers/donation.js";
import { uploadCategoryImages } from "../Utils/cloudinary.js";

const donationRouter = express.Router();

// Create a new donation with image uploads
donationRouter.post("/create", uploadCategoryImages, createDonation);

// Get all donations
donationRouter.get("/", getAllDonations);

// Get donation by ID
donationRouter.get("/:id", getDonationById);

// Get donations by donor ID
donationRouter.get("/donor/:donorId", getDonationsByDonorId);

// Update donation status
donationRouter.patch("/:id/status", updateDonationStatus);

export default donationRouter;
