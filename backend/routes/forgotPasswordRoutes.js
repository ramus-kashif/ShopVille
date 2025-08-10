import express from "express";
import { sendOtp, updatePassword } from "../controllers/forgotPasswordController.js";

const router = express.Router();
router.post('/send-otp', sendOtp);
router.post('/update', updatePassword);

export default router;
