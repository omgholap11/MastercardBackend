import Request from "../Model/request.js";
import Receiver from "../Model/receiver.js"; // Import to register the model

// Create a new request (simple, no images)
export const createRequest = async (req, res) => {
    try {
        console.log("Request body:", req.body);

        const requestorId = req.user.userId;
        console.log("Requestor ID from token:", requestorId);
        const { description, clothes, stationary, foods, furniture, electronics } = req.body;

        if (!requestorId) {
            return res.status(400).json({ error: "Requestor ID is required" });
        }

        // Helper function to process category data (just item names and counts)
        const processCategoryData = (categoryData) => {
            if (categoryData && typeof categoryData === 'object') {
                const processedData = {};
                Object.keys(categoryData).forEach(itemName => {
                    const itemData = categoryData[itemName];
                    processedData[itemName] = {
                        count: itemData.count || 0
                        // No images field for requests - they're just asking for items
                    };
                });
                return processedData;
            }
            return {};
        };

        // Process each category (no images, just item names and counts)
        const organizedData = {
            clothes: processCategoryData(clothes),
            stationary: processCategoryData(stationary),
            foods: processCategoryData(foods),
            furniture: processCategoryData(furniture),
            electronics: processCategoryData(electronics)
        };

        // Create new request
        const newRequest = new Request({
            requestorId,
            description,
            clothes: organizedData.clothes,
            stationary: organizedData.stationary,
            foods: organizedData.foods,
            furniture: organizedData.furniture,
            electronics: organizedData.electronics
        });

        const savedRequest = await newRequest.save();

        res.status(201).json({
            message: "Request created successfully",
            request: savedRequest
        });

    } catch (error) {
        console.error("Error creating request:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Get all requests
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate('requestorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Requests retrieved successfully",
            requests
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



// Get request by ID
export const getRequestById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const request = await Request.findById(id)
            .populate('requestorId', 'name email phone address');

        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.status(200).json({
            message: "Request retrieved successfully",
            request
        });
    } catch (error) {
        console.error("Error fetching request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update request status
export const updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["pending", "approved", "partially_fulfilled", "fulfilled", "rejected"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updatedRequest = await Request.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).populate('requestorId', 'name email');

        if (!updatedRequest) {
            return res.status(404).json({ error: "Request not found" });
        }

        res.status(200).json({
            message: "Request status updated successfully",
            request: updatedRequest
        });
    } catch (error) {
        console.error("Error updating request status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Delete request
export const deleteRequest = async (req, res) => {
    try {
        const { id } = req.params;

        const request = await Request.findById(id);
        
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Since requests don't have images, just delete the request directly
        await Request.findByIdAndDelete(id);

        res.status(200).json({
            message: "Request deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting request:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get requests by requestor ID
export const getRequestsByRequestorId = async (req, res) => {
    try {
        const { requestorId } = req.params;

        const requests = await Request.find({ requestorId })
            .populate('requestorId', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Requests retrieved successfully",
            requests
        });
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
