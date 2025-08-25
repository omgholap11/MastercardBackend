import Donation from "../Model/donation.js";
import Request from "../Model/request.js";

// Admin function to get history of completed donations/requests
export const getHistory = async (req, res) => {
  try {
    // Get completed donations (delivered status)
    const completedDonations = await Donation.find({ 
      status: "delivered" 
    })
    .populate("donorId", "name email")
    .populate("requestId")
    .sort({ updatedAt: -1 });

    // Get fulfilled requests
    const fulfilledRequests = await Request.find({ 
      status: "fulfilled" 
    })
    .populate("requestorId", "name email")
    .sort({ updatedAt: -1 });

    res.status(200).json({
      message: "History retrieved successfully",
      data: {
        completedDonations: completedDonations,
        fulfilledRequests: fulfilledRequests,
        totalCompleted: completedDonations.length + fulfilledRequests.length
      }
    });

  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({
      message: "Failed to fetch history",
      error: error.message
    });
  }
};

// Admin function to get matched donations (donations linked to requests)
export const getMatchedDonations = async (req, res) => {
  try {
    // Get all donations that are matched (have requestId and status is matched/pending_pickup/picked_up)
    const matchedDonations = await Donation.find({
      requestId: { $exists: true },
      status: { $in: ["matched", "pending_pickup", "picked_up"] }
    })
    .populate("donorId", "name email phone")
    .populate({
      path: "requestId",
      populate: {
        path: "requestorId",
        select: "name email phone"
      }
    })
    .sort({ matchedAt: -1 });

    // Calculate statistics
    const statusCounts = {
      matched: 0,
      pending_pickup: 0,
      picked_up: 0
    };

    matchedDonations.forEach(donation => {
      statusCounts[donation.status]++;
    });

    res.status(200).json({
      message: "Matched donations retrieved successfully",
      data: {
        matchedDonations: matchedDonations,
        statistics: {
          totalMatched: matchedDonations.length,
          statusBreakdown: statusCounts
        }
      }
    });

  } catch (error) {
    console.error("Error fetching matched donations:", error);
    res.status(500).json({
      message: "Failed to fetch matched donations",
      error: error.message
    });
  }
};

// Admin function to get all donation requests
export const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;
    
    // Build filter based on query parameters
    let filter = {};
    if (status) {
      filter.status = status;
    }

    const requests = await Request.find(filter)
      .populate("requestorId", "name email phone")
      .sort({ createdAt: -1 });

    // Calculate category statistics
    const categoryStats = {
      clothes: 0,
      stationary: 0,
      foods: 0,
      furniture: 0,
      electronics: 0
    };

    const statusStats = {
      pending: 0,
      approved: 0,
      partially_fulfilled: 0,
      fulfilled: 0,
      rejected: 0
    };

    requests.forEach(request => {
      // Count status
      statusStats[request.status]++;
      
      // Count categories that have items
      Object.keys(categoryStats).forEach(category => {
        if (request[category] && Object.keys(request[category]).length > 0) {
          categoryStats[category]++;
        }
      });
    });

    res.status(200).json({
      message: "All requests retrieved successfully",
      data: {
        requests: requests,
        statistics: {
          totalRequests: requests.length,
          statusBreakdown: statusStats,
          categoryBreakdown: categoryStats
        }
      }
    });

  } catch (error) {
    console.error("Error fetching requests:", error);
    res.status(500).json({
      message: "Failed to fetch requests",
      error: error.message
    });
  }
};

// Admin function to get comprehensive dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    // Count totals
    const totalDonations = await Donation.countDocuments();
    const totalRequests = await Request.countDocuments();
    
    // Count by status
    const donationStatusCounts = await Donation.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    
    const requestStatusCounts = await Request.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // Recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentDonations = await Donation.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });
    
    const recentRequests = await Request.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.status(200).json({
      message: "Dashboard statistics retrieved successfully",
      data: {
        totals: {
          donations: totalDonations,
          requests: totalRequests
        },
        donationStatusBreakdown: donationStatusCounts,
        requestStatusBreakdown: requestStatusCounts,
        recentActivity: {
          donationsLast7Days: recentDonations,
          requestsLast7Days: recentRequests
        }
      }
    });

  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

// Admin function to update donation status
export const updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["matched", "pending_pickup", "picked_up", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        validStatuses: validStatuses
      });
    }

    const donation = await Donation.findByIdAndUpdate(
      donationId,
      { status: status },
      { new: true }
    ).populate("donorId", "name email").populate("requestId");

    if (!donation) {
      return res.status(404).json({
        message: "Donation not found"
      });
    }

    res.status(200).json({
      message: "Donation status updated successfully",
      donation: donation
    });

  } catch (error) {
    console.error("Error updating donation status:", error);
    res.status(500).json({
      message: "Failed to update donation status",
      error: error.message
    });
  }
};
