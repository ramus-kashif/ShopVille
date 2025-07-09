import express from 'express';
import { 
  googleAuthCallback, 
  sendOtp, 
  verifyOtp, 
  phoneLogin, 
  verifyPhoneLogin 
} from '../controllers/authController.js';

const router = express.Router();

// Google OAuth callback route
router.post('/google/callback', googleAuthCallback);

// Registration OTP routes
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);

// Phone authentication routes
router.post('/phone/login', phoneLogin);
router.post('/phone/verify', verifyPhoneLogin);

export default router; 