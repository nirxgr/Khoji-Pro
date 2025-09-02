import express from "express";
import {
  checkOtp,
  login,
  logout,
  register,
  resetPassword,
  sendPasswordResetOtp,
  verifyEmail,
} from "../controllers/authController.js";
import userAuth from "../middleware/userAuth.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.post("/send-reset-otp", sendPasswordResetOtp);
authRouter.post("/check-otp", checkOtp);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
