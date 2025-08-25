import express from "express";
import { 
  getHistory,
  getMatchedDonations, 
  getAllRequests,
  getDashboardStats,
  updateDonationStatus
} from "../Controllers/admin.js";

const adminRouter = express.Router();

// Admin route to get history of completed donations and fulfilled requests
adminRouter.get("/history", getHistory);

// Admin route to get all matched donations (donations linked to requests)
adminRouter.get("/matched", getMatchedDonations);

// Admin route to get all requests (with optional status filter)
// Usage: /admin/requests or /admin/requests?status=pending
adminRouter.get("/requests", getAllRequests);

// Admin route to get dashboard statistics
adminRouter.get("/dashboard", getDashboardStats);

// Admin route to update donation status
adminRouter.patch("/donation/:donationId/status", updateDonationStatus);

export default adminRouter;
