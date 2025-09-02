import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import otpModel from "../models/otpModel.js";
import {
  EMAIL_VERIFY_TEMPLATE,
  PASSWORD_RESET_TEMPLATE,
} from "../config/emailTemplates.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const existing = await userModel.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    const userotp = String(Math.floor(100000 + Math.random() * 900000));
    const otpExpiresAt = Date.now() + 30 * 60 * 1000;

    let otpEntry = await otpModel.findOne({ email });
    let token;
    if (otpEntry) {
      token = jwt.sign({ id: otpEntry._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      otpEntry.verifyOtp = userotp;
      otpEntry.verifyOtpExpireAt = otpExpiresAt;
      await otpEntry.save();
    } else {
      const newotp = new otpModel({
        email,
        verifyOtp: userotp,
        verifyOtpExpireAt: otpExpiresAt,
      });
      token = jwt.sign({ id: newotp._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      await newotp.save();
    }

    //cookie functionality
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 60 * 60 * 1000,
    });

    //Sending otp
    const info = await transporter.sendMail({
      from: `"Khoji Pro" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Account Verification OTP",
      html: EMAIL_VERIFY_TEMPLATE.replace("{{otp}}", userotp).replace(
        "{{email}}",
        email
      ),
    });

    res.json({ success: true, message: "Verification OTP Sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // trim to avoid spaces-only inputs
  if (!email?.trim() || !password?.trim()) {
    return res.json({
      success: false,
      message: "Email and password are required.",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //cookie functionality
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });
    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { firstName, lastName, email, password, otp } = req.body;

  const userId = req.user.id;

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }
  try {
    const otpuser = await otpModel.findById(userId);

    if (!otpuser) {
      return res.json({ success: false, message: "User Not Found" });
    }
    if (otpuser.verifyOtp === "" || otpuser.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }
    if (Date.now() > otpuser.verifyOtpExpireAt) {
      return res.json({ success: false, message: "OTP Expired" });
    }
    otpuser.verifyOtp = "";
    otpuser.verifyOtpExpireAt = 0;
    await otpuser.save();

    //10 is the level of complexity of encrypted password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    await user.save();

    //Sending welcome email
    const info = await transporter.sendMail({
      from: `"Khoji Pro" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Khoji Pro!",
      html: `<h2>Welcome, ${firstName} ${lastName}!</h2>
                <p>Your account has been successfully created using this email: <strong>${email}</strong>.</p>
                <p>We're glad to have you on board!</p>`,
    });

    //token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    //cookie functionality
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 1000,
    });

    return res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//send password reset otp
export const sendPasswordResetOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otpuser = await otpModel.findOne({ email });
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    otpuser.resetOtp = otp;
    otpuser.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await otpuser.save();

    //Sending reset password email
    const info = await transporter.sendMail({
      from: `"Khoji Pro" <${process.env.GMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: PASSWORD_RESET_TEMPLATE.replace("{{otp}}", otp).replace(
        "{{email}}",
        user.email
      ),
    });

    res.json({ success: true, message: "Password Reset OTP Sent on Email" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//check rest otp
export const checkOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }
  if (!otp) {
    return res.json({ success: false, message: "OTP is required" });
  }

  try {
    const otpuser = await otpModel.findOne({ email });
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (otpuser.resetOtp === "" || otpuser.resetOtp !== otp) {
      return res.json({ success: false, message: "Invaid OTP" });
    }
    if (otpuser.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    otpuser.resetOtp = "";
    otpuser.resetOtpExpireAt = 0;
    await otpuser.save();

    return res.json({ success: true, message: "OTP verified." });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Reset user password
export const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email) {
    return res.json({ success: false, message: " Email is required" });
  }
  if (!newPassword) {
    return res.json({ success: false, message: " New Password is required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.json({
        success: false,
        message: "Old password cannot be used again.",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully.",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};
