import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_KEY, {
    expiresIn: 7*24*60*60, // 7 days in seconds
  });
};
export { createSecretToken };