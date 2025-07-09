import express from "express";
import {
  createCashOnDeliveryOrder,
  createStripeOrder,
  updateStripeOrder,
  getAllOrders,
} from "../controllers/orderController.js";
import { isAuthorized, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Route to create Cash on Delivery order
router.post("/create", createCashOnDeliveryOrder);

// Route to save Stripe order after successful payment
router.post("/create-stripe-order", createStripeOrder);

// Route to update Stripe order after successful payment
router.put("/update-stripe-order/:orderId", updateStripeOrder);

// Route to get all orders (temporarily without auth for testing)
router.get("/all", getAllOrders);

export default router;