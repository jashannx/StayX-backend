import User from "../models/User.js";
import jwt from "jsonwebtoken";

 const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ attach full user OR just id
    req.user = user;

    next(); // 🔥 move forward
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
export default verifyUser;