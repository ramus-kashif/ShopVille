import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import nodemailer from 'nodemailer';
import { validateEmail } from '../utils/emailValidator.js';

// In-memory OTP store (for demo; use Redis or DB for production)
const otpStore = {};

// Helper: Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper: Send email (using nodemailer, configure with your SMTP)
async function sendEmailOtp(email, otp) {
  try {
    // Configure your SMTP here
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Your ShopVille Email OTP',
      text: `Your ShopVille email OTP is: ${otp}`,
    });
  } catch (error) {
    console.error('Email sending error:', error);
    // For demo purposes, just log the OTP
    console.log(`Email OTP for ${email}: ${otp}`);
  }
}

// Helper: Send SMS (mock for now)
async function sendSmsOtp(phone, otp) {
  // Integrate with Twilio or other SMS provider in production
  console.log(`Mock SMS to ${phone}: Your ShopVille phone OTP is: ${otp}`);
}

// Phone number validation for Pakistan
function isValidPakistaniPhone(phone) {
  return /^((\+92)?3[0-9]{9})$/.test(phone);
}

// Registration OTP sending
export const sendOtp = async (req, res) => {
  try {
    const { email, phone } = req.body;
    
    if (!email || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and phone are required' 
      });
    }

    // Validate email
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({ 
        success: false, 
        message: emailValidation.error 
      });
    }

    // Validate phone number
    if (!isValidPakistaniPhone(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please enter a valid Pakistani phone number (03xxxxxxxxx or +923xxxxxxxxx)' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or phone already exists' 
      });
    }

    // Generate OTPs
    const otpEmail = generateOtp();
    const otpPhone = generateOtp();
    
    // Store in memory (keyed by email+phone)
    otpStore[`${email}:${phone}`] = {
      otpEmail,
      otpPhone,
      expires: Date.now() + 10 * 60 * 1000, // 10 min expiry
    };

    // Send OTPs
    await sendEmailOtp(email, otpEmail);
    await sendSmsOtp(phone, otpPhone);
    
    res.json({ 
      success: true, 
      message: 'OTP sent to phone and email' 
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP' 
    });
  }
};

// OTP verification
export const verifyOtp = async (req, res) => {
  try {
    const { email, phone, otpEmail, otpPhone, name, password } = req.body;
    
    if (!email || !phone || !otpEmail || !otpPhone || !name || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields required' 
      });
    }
    
    const key = `${email}:${phone}`;
    const record = otpStore[key];
    
    if (!record) {
      return res.status(400).json({ 
        success: false, 
        message: 'OTP not found or expired' 
      });
    }
    
    if (Date.now() > record.expires) {
      delete otpStore[key];
      return res.status(400).json({ 
        success: false, 
        message: 'OTP expired' 
      });
    }
    
    if (record.otpEmail !== otpEmail || record.otpPhone !== otpPhone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid OTP' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { phone }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or phone already exists' 
      });
    }
    
    // Create the user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Remove OTP record
    delete otpStore[key];
    
    // Remove password from response
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    };
    
    res.json({ 
      success: true, 
      message: 'Account created successfully',
      user: userResponse,
      token
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'OTP verification failed' 
    });
  }
};

// Phone number login
export const phoneLogin = async (req, res) => {
  try {
    const { phone } = req.body;
    
    if (!phone || !isValidPakistaniPhone(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid Pakistani phone number required' 
      });
    }

    // Find user by phone
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate OTP for phone login
    const otp = generateOtp();
    otpStore[`login:${phone}`] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000, // 5 min expiry
    };

    // Send OTP
    await sendSmsOtp(phone, otp);
    
    res.json({ 
      success: true, 
      message: 'Login OTP sent to phone' 
    });
  } catch (err) {
    console.error('Phone login error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Phone login failed' 
    });
  }
};

// Phone login OTP verification
export const verifyPhoneLogin = async (req, res) => {
  try {
    const { phone, otp } = req.body;
    
    if (!phone || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone and OTP required' 
      });
    }

    const key = `login:${phone}`;
    const record = otpStore[key];
    
    if (!record || record.otp !== otp || Date.now() > record.expires) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid or expired OTP' 
      });
    }

    // Find user
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Clean up OTP
    delete otpStore[key];
    
    res.json({
      success: true,
      message: 'Phone login successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token
      }
    });
  } catch (err) {
    console.error('Phone login verification error:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Phone login verification failed' 
    });
  }
};

// Google OAuth callback handler
export const googleAuthCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange authorization code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${process.env.FRONTEND_URL}/auth/google/callback`
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token } = tokenResponse.data;

    // Get user info from Google
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { id, email, name, picture } = userInfoResponse.data;

    // Validate email (Google emails are usually not temporary, but check anyway)
    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: emailValidation.error
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        avatar: picture,
        googleId: id,
        isEmailVerified: true, // Google emails are verified
        role: 0 // Default user role
      });
      await user.save();
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = id;
        user.avatar = picture;
        user.isEmailVerified = true;
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    res.json({
      success: true,
      message: 'Google authentication successful',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        token
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed',
      error: error.message
    });
  }
}; 