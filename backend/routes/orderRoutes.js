import express from "express";
const router = express.Router();
import {
  createCashOnDeliveryOrder,
  createStripeOrder,
  updateStripeOrder,
  getAllOrders,
  getUserOrders,
} from "../controllers/orderController.js";

// Route to get orders for a specific user
router.get("/user/:userId", getUserOrders);

// Route to create Cash on Delivery order
router.post("/create", createCashOnDeliveryOrder);

// Route to save Stripe order after successful payment
router.post("/create-stripe-order", createStripeOrder);

// Route to update Stripe order after successful payment
router.put("/update-stripe-order/:orderId", updateStripeOrder);

// Route to get all orders (temporarily without auth for testing)
router.get("/all", getAllOrders);

export default router;