import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Donor", 
    required: true 
  },
  
  requestId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Request", 
    required: true 
  },
  
  description: { type: String },
  
  // Donated items with images and counts (same structure as request)
  clothes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "sweater": { count: 2, images: ["url1", "url2"] },
    //   "jacket": { count: 1, images: ["url3"] }
    // }
  },
  
  stationary: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  foods: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  furniture: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  electronics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  
  status: { 
    type: String, 
    enum: ["matched", "pending_pickup", "picked_up", "delivered", "cancelled"], 
    default: "matched" 
  },
  
  // Track total items donated for quick reference
  totalItemsCount: {
    type: Number,
    default: 0
  },
  
  // Timestamps for tracking
  matchedAt: { type: Date, default: Date.now },
  
}, { 
  timestamps: true 
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;