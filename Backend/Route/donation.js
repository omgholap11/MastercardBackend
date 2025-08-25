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
donationRouter.post("/create", checkForAuthenticationCookieDonor("token"), (req, res, next) => {
    console.log("Before multer middleware");
    uploadCategoryImages(req, res, (err) => {
        if (err) {
            console.error("Multer error:", err);
            return res.status(400).json({ error: "File upload error", details: err.message });
        }
        console.log("Multer middleware completed successfully");
        next();
    });
}, createDonation);

// Test endpoint without auth for debugging
donationRouter.post("/test", (req, res, next) => {
    console.log("Test endpoint - Before multer");
    uploadCategoryImages(req, res, (err) => {
        if (err) {
            console.error("Test multer error:", err);
            return res.status(400).json({ error: "File upload error", details: err.message });
        }
        console.log("Test multer completed");
        res.json({ message: "Test successful", body: req.body, files: req.files });
    });
});

// Get all donations
donationRouter.get("/", checkForAuthenticationCookieDonor("token") ,getAllDonations);

// Get donation by ID
donationRouter.get("/:id", checkForAuthenticationCookieDonor("token") , getDonationById);

// Get donations by donor ID
donationRouter.get("/donor/:donorId", checkForAuthenticationCookieDonor("token") , getDonationsByDonorId);

// Update donation status
donationRouter.patch("/:id/status", checkForAuthenticationCookieDonor("token") , updateDonationStatus);

export default donationRouter;
