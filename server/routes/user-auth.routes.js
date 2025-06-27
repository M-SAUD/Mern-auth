import express from "express";
import {
  isAuthenticated,
  login,
  logout,
  register,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  verifyEmail,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userauth.middleware.js";
import { loginLimiter } from "../ratelimiter/loginratelimiter.js";
import { otpLimiter } from "../ratelimiter/otp-rate-limiter.js";
import { googleLoginController } from '../controllers/google-auth.controller.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", loginLimiter, login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", otpLimiter, userAuth, sendVerifyOtp);
authRouter.post("/verify-account", userAuth, verifyEmail);
authRouter.get("/is-auth", userAuth, isAuthenticated);
authRouter.post("/send-reset-otp", otpLimiter, sendResetOtp);
authRouter.post("/reset-password", resetPassword);


// ========== Google Login Route ==========
authRouter.post("/google-login", googleLoginController); 

export default authRouter;
