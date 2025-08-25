import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({

  requestorId : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Receiver",
    required: true
  },

  description: { type: String },
  

  clothes: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "sweater": { count: 5, images: ["url1", "url2"] },
    //   "jacket": { count: 3, images: ["url3", "url4"] },
    //   "shirt": { count: 10, images: ["url5"] }
    // }
  },
  
  stationary: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "notebooks": { count: 20, images: ["url1", "url2"] },
    //   "pens": { count: 50, images: ["url3"] },
    //   "pencils": { count: 30, images: ["url4", "url5"] }
    // }
  },
  
  foods: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "rice": { count: 10, images: ["url1"] },
    //   "wheat": { count: 5, images: ["url2", "url3"] },
    //   "lentils": { count: 8, images: ["url4"] }
    // }
  },
  
  furniture: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "chairs": { count: 4, images: ["url1", "url2"] },
    //   "tables": { count: 2, images: ["url3"] },
    //   "beds": { count: 1, images: ["url4", "url5"] }
    // }
  },
  
  electronics: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    // Example structure:
    // {
    //   "laptops": { count: 2, images: ["url1", "url2"] },
    //   "phones": { count: 3, images: ["url3"] },
    //   "tablets": { count: 1, images: ["url4"] }
    // }
  },
  
  // Request status and metadata
  status: { 
    type: String, 
    enum: ["pending", "approved", "partially_fulfilled", "fulfilled", "rejected"], 
    default: "pending" 
  },
  
//   priority: {
//     type: String,
//     enum: ["low", "medium", "high", "urgent"],
//     default: "medium"
//   },
}, { 
  timestamps: true // This will automatically manage createdAt and updatedAt
});

const Request = mongoose.model("Request", requestSchema);
export default Request;