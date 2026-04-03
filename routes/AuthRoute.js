import { Signup } from "../Controllers/AuthController.js";
import { login } from "../Controllers/AuthController.js";
import verifyUser from "../Middlewares/AuthMiddleware.js";
import express from "express";
import { verifyController } from "../Controllers/AuthController.js";
const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";

router.post("/signup", Signup);
router.post("/login", login);
router.get("/verify", verifyUser, verifyController);
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });
  res.json({ message: "Logged out" });
});
export default router;
