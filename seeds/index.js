import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import listings from "./listings.js";
import dotenv from "dotenv";
dotenv.config();

mongoose.connect("mongodb+srv://airbnbuser:zcA6yKazNcGVHGg4@airbnbuser.7oqezsj.mongodb.net/?appName=airbnbuser")
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch(err => console.log(err));    

const seedDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(listings);
    console.log("Database seeded!");
}
seedDB().then(() => {
    mongoose.connection.close();
});