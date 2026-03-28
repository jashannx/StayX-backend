import { Signup } from "../Controllers/AuthController.js";
import { login } from "../Controllers/AuthController.js";
import verifyUser from "../Middlewares/AuthMiddleware.js";
import express from "express";
const router = express.Router();

const sendVerification = (req, res) => {
  res.json({
    status: true,
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

router.post("/signup", Signup);
router.post("/login", login);
router.post("/verify", verifyUser, sendVerification);
router.get("/verify", verifyUser, sendVerification);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.json({ message: "Logged out" });
});
export default router;
