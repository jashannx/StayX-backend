import User from "../models/User.js";
import { createSecretToken } from "../util/SecretToken.js";
import bcrypt from "bcrypt";



const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const verifyController = (req, res) => {
  return res.status(200).json({
    status: true,
    success: true,
    user: req.user,
  });
};
const Signup = async (req, res) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, getCookieOptions());
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to sign up" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password ){
      return res.status(400).json({message:'All fields are required'})
    }
    const user = await User.findOne({ email });
    if(!user){
      return res.status(401).json({message:'Incorrect password or email' }) 
    }
    const auth = await bcrypt.compare(password,user.password)
    if (!auth) {
      return res.status(401).json({message:'Incorrect password or email' }) 
    }
    const token = createSecretToken(user._id);
    res.cookie("token", token, getCookieOptions());
    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to log in" });
  }
};
export { Signup, Login as login ,verifyController};
