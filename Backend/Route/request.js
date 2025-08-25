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

import { checkForAuthenticationCookieForReceiver } from "../Middlewares/authentication.js";

const requestRouter = express.Router();

// Create a new request (no image upload needed)
requestRouter.post("/create", checkForAuthenticationCookieForReceiver("token"), createRequest);


requestRouter.get("/", checkForAuthenticationCookieForReceiver("token"), getAllRequests);

// Get request by ID
requestRouter.get("/:id", checkForAuthenticationCookieForReceiver("token"), getRequestById);

// Get requests by requestor ID
requestRouter.get("/requestor/:requestorId", checkForAuthenticationCookieForReceiver("token"), getRequestsByRequestorId);

// Update request status
requestRouter.patch("/:id/status", checkForAuthenticationCookieForReceiver("token"), updateRequestStatus);

// Delete request
requestRouter.delete("/:id", checkForAuthenticationCookieForReceiver("token"), deleteRequest);

export default requestRouter;
