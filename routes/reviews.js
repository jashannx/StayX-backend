import express from "express";
const router = express.Router({ mergeParams: true });

import listing from '../models/Listing.js';
import Review from '../models/review.js';
import verifyUser from "../Middlewares/AuthMiddleware.js";


router.post("/", verifyUser, async (req, res) => {
  const { comment, rating } = req.body;

  if (!comment || !rating) {
    return res.status(400).json({ message: "Comment and rating are required" });
  }

  try {
    const foundListing = await listing.findById(req.params.id);
    if (!foundListing) return res.status(404).json({ message: "Listing not found" });

    const review = new Review({
      comment: comment.trim(),
      rating: Number(rating),
      author: req.user._id,
    });

    await review.save();
    foundListing.reviews.push(review._id);
    await foundListing.save();

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:reviewId", verifyUser, async (req, res) => {
  try {
    const foundListing = await listing.findById(req.params.id);
    if (!foundListing) return res.status(404).json({ message: "Listing not found" });

    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    if (review.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.reviewId);
    foundListing.reviews = foundListing.reviews.filter(
      (reviewId) => reviewId.toString() !== req.params.reviewId
    );
    await foundListing.save();

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
