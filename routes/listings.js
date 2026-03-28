import express from "express";
const router = express.Router({ mergeParams: true });

import listing from '../models/Listing.js';
import Review from '../models/review.js';
import  verifyUser  from "../Middlewares/AuthMiddleware.js";
import multer from "multer";
import { getServerBaseUrl, serializeListing } from "../util/url.js";

const upload = multer({ dest: "uploads/" });
router.get("/", async (req, res) => {
  try {
    const alllistings = await listing.find();
    res.json(alllistings.map((item) => serializeListing(item, req)));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const listingById = await listing
      .findById(req.params.id)
      .populate({
        path: "reviews",
        populate: { path: "author", select: "username email" },
      })
      .populate("owner");
    if (!listingById) return res.status(404).json({ message: "Not found" });
 
    res.json(serializeListing(listingById, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", verifyUser, upload.single("image"), async (req, res) => {
  try {
    if (!req.body.title || !req.body.description || !req.body.location || !req.body.country) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newListing = new listing({
      ...req.body,
      price: req.body.price ? Number(req.body.price) : 0,
      image: req.file
        ? `${getServerBaseUrl(req)}/uploads/${req.file.filename}`
        : undefined,
    });
    newListing.owner = req.user._id;
    await newListing.save();
    res.status(201).json(serializeListing(newListing, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", verifyUser, async (req, res) => {
  try {
    const listingData = await listing.findById(req.params.id);

    if (!listingData) return res.status(404).json({ message: "Not found" });

    if (listingData.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deletedListing = await listing.findByIdAndDelete(req.params.id);

    await Review.deleteMany({ _id: { $in: deletedListing.reviews } });
    res.json({ message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", verifyUser, upload.single("image"), async (req, res) => {
  if (!req.body.title || !req.body.description || !req.body.location || !req.body.country) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existingListing = await listing.findById(req.params.id);
    if (!existingListing) return res.status(404).json({ message: "Not found" });

    if (existingListing.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedListing = await listing.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        price: req.body.price ? Number(req.body.price) : 0,
        image: req.file
          ? `${getServerBaseUrl(req)}/uploads/${req.file.filename}`
          : existingListing.image,
      },
      { new: true }
    );

    res.json(serializeListing(updatedListing, req));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
