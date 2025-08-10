import User from '../models/userModel.js';
// Use shared OTP store and helpers from authController
import { otpStore } from './authController.js';

// In-memory OTP store (use Redis in production)
// Use shared otpStore from authController

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const key = `forgot:${email}`;
  otpStore[key] = { otp, expires: Date.now() + 10 * 60 * 1000 };
  // Log sender and return OTP in response (for dev/testing)
    console.log(`[DEV] OTP sender: ${process.env.EMAIL_USER || 'no-sender-set'} for email: ${email}, OTP: ${otp}`);
  res.json({ success: true, otp });
};

export const updatePassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ success: false, message: 'All fields required' });
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  // Check OTP
  const key = `forgot:${email}`;
  const record = otpStore[key];
  if (!record) return res.status(400).json({ success: false, message: 'OTP not found or expired' });
  if (Date.now() > record.expires) {
    delete otpStore[key];
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }
  if (record.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
  // Update password
  user.password = newPassword;
  await user.save();
  delete otpStore[key];
  res.json({ success: true });
};
