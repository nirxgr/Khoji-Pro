import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpireAt: { type: Number, default: 0 },
  resetOtp: { type: String, default: "" },
  resetOtpExpireAt: { type: Number, default: 0 },
});

//IF OTP MODEL EXISTS IT USES THIS OR CREATES NEW ONE
const otpModel = mongoose.models.otp || mongoose.model("Otp", otpSchema);
export default otpModel;
