import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      default: "",
    },

    isGoogleUser: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    verifyOtp: {
      type: String,
      default: "",
    },

    verifyOtpExpireAt: {
      type: Number,
      default: 0,
    },

    resetOtp: {
      type: String,
      default: "",
    },

    resetOtpExpireAt: {
      type: Number,
      default: 0,
    },
  }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
