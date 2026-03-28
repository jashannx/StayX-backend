import mongoose from 'mongoose';
import Review from "./review.js";
const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
      type: String,
      default: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBob3VzZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
  },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
  
});

export default mongoose.model("Listing", listingSchema);
