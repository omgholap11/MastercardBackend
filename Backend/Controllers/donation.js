import Donation from "../Model/donation.js";
import Request from "../Model/request.js";

// Create a donation (donor donates to a specific request)
export const createDonation = async (req, res) => {
    try {
        console.log("=== DONATION CREATE REQUEST START ===");
        console.log("Request body:", req.body);
        console.log("Request files:", req.files);
        console.log("User from auth middleware:", req.user);
        console.log("========================================");

        const donorId = req.user.userId; // Get from auth middleware
        const {  
            requestId,
            description, 
            donationData,
        } = req.body;
        
        console.log("Parsed requestId:", donationData, requestId, description, donorId);

        if (!donorId || !requestId) {
            return res.status(400).json({ error: "Donor ID and Request ID are required" });
        }

        // Find the request to validate and update
        const request = await Request.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: "Request not found" });
        }

        // Parse donation data if it's a string (from form-data)
        let parsedDonationData = {};
        if (donationData) {
            try {
                parsedDonationData = typeof donationData === 'string' ? JSON.parse(donationData) : donationData;
            } catch (error) {
                return res.status(400).json({ error: "Invalid donation data format" });
            }
        }

        // Process uploaded images and organize by category
        const organizedDonationData = {
            clothes: {},
            stationary: {},
            foods: {},
            furniture: {},
            electronics: {}
        };

        let totalItemsCount = 0;

        // Helper function to process category data with images
        const processCategoryData = (categoryName, categoryData, images = []) => {
            if (categoryData && typeof categoryData === 'object') {
                Object.keys(categoryData).forEach(itemName => {
                    const itemValue = categoryData[itemName];
                    
                    // Handle two possible formats:
                    // 1. Frontend format: {"sweater": 1, "jacket": 2}
                    // 2. Backend format: {"sweater": {"count": 1}, "jacket": {"count": 2}}
                    let donatingCount;
                    if (typeof itemValue === 'number') {
                        // Frontend format: direct number value
                        donatingCount = parseInt(itemValue) || 0;
                    } else if (typeof itemValue === 'object' && itemValue.count) {
                        // Backend format: object with count property
                        donatingCount = parseInt(itemValue.count) || 0;
                    } else {
                        donatingCount = 0;
                    }
                    
                    if (donatingCount > 0) {
                        organizedDonationData[categoryName][itemName] = {
                            count: donatingCount,
                            images: images
                        };
                        totalItemsCount += donatingCount;
                    }
                });
            }
        };

        // Process each category with its images
        if (req.files) {
            // Process clothes
            if (parsedDonationData.clothes) {
                const clothesImages = req.files.clothesImages ? req.files.clothesImages.map(file => file.path) : [];
                processCategoryData('clothes', parsedDonationData.clothes, clothesImages);
            }

            // Process stationary
            if (parsedDonationData.stationary) {
                const stationaryImages = req.files.stationaryImages ? req.files.stationaryImages.map(file => file.path) : [];
                processCategoryData('stationary', parsedDonationData.stationary, stationaryImages);
            }

            // Process foods
            if (parsedDonationData.foods) {
                const foodsImages = req.files.foodsImages ? req.files.foodsImages.map(file => file.path) : [];
                processCategoryData('foods', parsedDonationData.foods, foodsImages);
            }

            // Process furniture
            if (parsedDonationData.furniture) {
                const furnitureImages = req.files.furnitureImages ? req.files.furnitureImages.map(file => file.path) : [];
                processCategoryData('furniture', parsedDonationData.furniture, furnitureImages);
            }

            // Process electronics
            if (parsedDonationData.electronics) {
                const electronicsImages = req.files.electronicsImages ? req.files.electronicsImages.map(file => file.path) : [];
                processCategoryData('electronics', parsedDonationData.electronics, electronicsImages);
            }
        } else {
            // If no files, process without images
            Object.keys(parsedDonationData).forEach(categoryName => {
                if (['clothes', 'stationary', 'foods', 'furniture', 'electronics'].includes(categoryName)) {
                    processCategoryData(categoryName, parsedDonationData[categoryName], []);
                }
            });
        }

        // Validate that donation items exist in the request and don't exceed requested amounts
        const updatedRequestData = JSON.parse(JSON.stringify(request.toObject()));
        let hasValidDonations = false;

        for (const categoryName of ['clothes', 'stationary', 'foods', 'furniture', 'electronics']) {
            const donatedItems = organizedDonationData[categoryName];
            const requestedItems = request[categoryName] || {};

            for (const itemName in donatedItems) {
                const donatedCount = donatedItems[itemName].count;
                const requestedCount = requestedItems[itemName]?.count || 0;

                if (requestedCount === 0) {
                    return res.status(400).json({ 
                        error: `Item "${itemName}" in category "${categoryName}" is not requested` 
                    });
                }

                if (donatedCount > requestedCount) {
                    return res.status(400).json({ 
                        error: `Cannot donate ${donatedCount} ${itemName}(s). Only ${requestedCount} requested.` 
                    });
                }

                // Update the request data (decrease the count)
                updatedRequestData[categoryName][itemName].count -= donatedCount;
                hasValidDonations = true;

                // If count becomes 0, remove the item
                if (updatedRequestData[categoryName][itemName].count === 0) {
                    delete updatedRequestData[categoryName][itemName];
                }
            }
        }

        if (!hasValidDonations) {
            return res.status(400).json({ error: "No valid donations provided" });
        }

        // Create the donation
        const newDonation = new Donation({
            donorId,
            requestId,
            description,
            clothes: organizedDonationData.clothes,
            stationary: organizedDonationData.stationary,
            foods: organizedDonationData.foods,
            furniture: organizedDonationData.furniture,
            electronics: organizedDonationData.electronics,
            totalItemsCount
        });

        // Save donation
        const savedDonation = await newDonation.save();

        // Update the request with decreased counts
        await Request.findByIdAndUpdate(requestId, {
            clothes: updatedRequestData.clothes,
            stationary: updatedRequestData.stationary,
            foods: updatedRequestData.foods,
            furniture: updatedRequestData.furniture,
            electronics: updatedRequestData.electronics,
            // Update status if request is fully fulfilled
            status: checkRequestFulfillment(updatedRequestData)
        });

        res.status(201).json({
            message: "Donation created successfully and request updated",
            donation: savedDonation
        });

    } catch (error) {
        console.error("Error creating donation:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};

// Helper function to check if request is fulfilled
const checkRequestFulfillment = (requestData) => {
    const categories = ['clothes', 'stationary', 'foods', 'furniture', 'electronics'];
    
    for (const category of categories) {
        const categoryData = requestData[category] || {};
        if (Object.keys(categoryData).length > 0) {
            return "partially_fulfilled";
        }
    }
    
    return "fulfilled"; // All categories are empty
};

// Get all donations
export const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find()
            .populate('donorId', 'name email phone')
            .populate('requestId', 'description requestorId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Donations retrieved successfully",
            donations
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get donation by ID
export const getDonationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const donation = await Donation.findById(id)
            .populate('donorId', 'name email phone address')
            .populate('requestId', 'description requestorId');

        if (!donation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({
            message: "Donation retrieved successfully",
            donation
        });
    } catch (error) {
        console.error("Error fetching donation:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Get donations by donor ID
export const getDonationsByDonorId = async (req, res) => {
    try {
        const { donorId } = req.params;

        const donations = await Donation.find({ donorId })
            .populate('requestId', 'description requestorId')
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Donations retrieved successfully",
            donations
        });
    } catch (error) {
        console.error("Error fetching donations:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// Update donation status
export const updateDonationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ["matched", "pending_pickup", "picked_up", "delivered", "cancelled"];
        
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }

        const updateData = { status };

        // Add timestamps based on status
        if (status === "picked_up") {
            updateData.pickedUpAt = new Date();
        } else if (status === "delivered") {
            updateData.deliveredAt = new Date();
        }

        const updatedDonation = await Donation.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('donorId', 'name email')
         .populate('requestId', 'description');

        if (!updatedDonation) {
            return res.status(404).json({ error: "Donation not found" });
        }

        res.status(200).json({
            message: "Donation status updated successfully",
            donation: updatedDonation
        });
    } catch (error) {
        console.error("Error updating donation status:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
