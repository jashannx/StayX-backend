import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: { type: Date, default: Date.now }
});
export default mongoose.model("Review", reviewSchema);
