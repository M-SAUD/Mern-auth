// controllers/google-auth.controller.js

import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import userModel from '../models/user-model.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLoginController = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'ID token is required',
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Google account does not contain a valid email',
      });
    }

    // Check if user already exists
    let user = await userModel.findOne({ email });



    if (user) {
  if (!user.isGoogleUser) {
    // Case: User exists but registered with email/password
    return res.json({
      success: false,
      message: "Email already registered. Please login with email and password."
    });
  }
  // else: user is Google user, proceed with login
} else {
  // No user found, create new Google user
  user = new userModel({
    name,
    email,
    isGoogleUser: true,
    isVerified: true,
    password: null, // or leave empty/null for Google users
  });
  await user.save();
}
   


    // Sign JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Google Login Successful',
    });
  } catch (error) {
    console.error('Google Login Error:', error);
    res.status(401).json({
      success: false,
      message: 'Google authentication failed',
    });
  }
};
