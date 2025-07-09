
// ✅ Order model (models/orderModel.js)
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    cartItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        title: String,
        quantity: Number,
        price: Number,
        pictureUrl: String, // Add this field to store product image URL
      },
    ],
    totalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ["paid", "pending", "failed"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "stripe", "payfast"],
      required: true,
    },
    stripeSessionId: String,
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerName: String,
    customerEmail: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;