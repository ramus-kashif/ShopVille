// routes/paymentRoutes.js

import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

router.post("/create-checkout-session", async (req, res) => {
  try {
    console.log("=== BACKEND STRIPE SESSION DEBUG START ===");
    console.log("1. Request body:", req.body);
    
    const { cartItems, userData } = req.body;
    
    console.log("2. Cart items count:", cartItems?.length);
    console.log("3. User data:", userData);
    
    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("4. Invalid cart items");
      return res.status(400).json({ error: "Invalid cart items" });
    }

    const line_items = cartItems.map((item) => ({
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    
    console.log("5. Line items created:", line_items);

    console.log("6. Creating Stripe session...");
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: "http://localhost:5173/cart",
      metadata: {
        customerEmail: userData?.email || "guest@example.com",
        customerName: userData?.name || "Guest",
        customerId: userData?._id || "",
      },
    });
    
    console.log("7. Stripe session created:", session.id);
    console.log("8. Session metadata:", session.metadata);
    console.log("=== BACKEND STRIPE SESSION DEBUG END ===");

    res.send({ id: session.id });
  } catch (error) {
    console.error("=== BACKEND STRIPE SESSION ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: error.message });
  }
});

router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
  console.log("=== STRIPE WEBHOOK DEBUG START ===");
  console.log("1. Webhook received");
  console.log("2. Headers:", req.headers);
  
  const sig = req.headers["stripe-signature"];
  console.log("3. Stripe signature:", sig ? "Present" : "Missing");

  let event;

  try {
    console.log("4. Constructing webhook endpoint...");
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    console.log("5. Webhook secret:", endpointSecret ? "Present" : "Missing");
    
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log("6. Event constructed successfully:", event.type);
  } catch (err) {
    console.error("7. Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log("8. Processing event type:", event.type);

  if (event.type === "checkout.session.completed") {
    console.log("9. Checkout session completed event");
    const session = event.data.object;
    console.log("10. Session data:", {
      id: session.id,
      customer_email: session.customer_email,
      metadata: session.metadata
    });

    try {
      console.log("11. Looking for existing order...");
      const existingOrder = await Order.findOne({ stripeSessionId: session.id });
      console.log("12. Existing order found:", existingOrder ? "Yes" : "No");

      if (!existingOrder) {
        console.log("13. No existing order found, creating new one...");
        const newOrder = new Order({
          cartItems: [], // Will be populated from frontend
          totalAmount: session.amount_total / 100,
          stripeSessionId: session.id,
          paymentStatus: "paid",
          paymentMethod: "stripe",
          customerEmail: session.customer_email || session.metadata?.customerEmail,
          customerName: session.metadata?.customerName || "Guest",
          customerId: session.metadata?.customerId || null,
        });

        const savedOrder = await newOrder.save();
        console.log("14. New order created:", savedOrder._id);
      } else {
        console.log("15. Order already exists, updating payment status...");
        existingOrder.paymentStatus = "paid";
        await existingOrder.save();
        console.log("16. Order updated successfully");
      }
    } catch (error) {
      console.error("17. Error processing webhook:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  console.log("18. Webhook processed successfully");
  console.log("=== STRIPE WEBHOOK DEBUG END ===");
  res.json({ received: true });
});

export default router;
