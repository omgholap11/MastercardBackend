import express from "express";
import { 
    createDonation, 
    getAllDonations, 
    getDonationById, 
    updateDonationStatus,
    getDonationsByDonorId 
} from "../Controllers/donation.js";
import { uploadCategoryImages } from "../Utils/cloudinary.js";

import {checkForAuthenticationCookieDonor} from "../Middlewares/authentication.js";

const donationRouter = express.Router();

// Create a new donation with image uploads
donationRouter.post("/create", checkForAuthenticationCookieDonor("token") , uploadCategoryImages, createDonation);

// Get all donations
donationRouter.get("/", checkForAuthenticationCookieDonor("token") ,getAllDonations);

// Get donation by ID
donationRouter.get("/:id", checkForAuthenticationCookieDonor("token") , getDonationById);

// Get donations by donor ID
donationRouter.get("/donor/:donorId", checkForAuthenticationCookieDonor("token") , getDonationsByDonorId);

// Update donation status
donationRouter.patch("/:id/status", checkForAuthenticationCookieDonor("token") , updateDonationStatus);

export default donationRouter;
