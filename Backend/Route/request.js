import express from "express";
import { 
    createRequest, 
    getAllRequests, 
    getRequestById, 
    updateRequestStatus, 
    deleteRequest,
    getRequestsByRequestorId 
} from "../Controllers/request.js";
// Removed multer import since requests don't need images

const requestRouter = express.Router();

// Create a new request (no image upload needed)
requestRouter.post("/create", createRequest);


requestRouter.get("/", getAllRequests);

// Get request by ID
requestRouter.get("/:id", getRequestById);

// Get requests by requestor ID
requestRouter.get("/requestor/:requestorId", getRequestsByRequestorId);

// Update request status
requestRouter.patch("/:id/status", updateRequestStatus);

// Delete request
requestRouter.delete("/:id", deleteRequest);

export default requestRouter;
