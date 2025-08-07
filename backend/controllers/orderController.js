// controllers/orderController.js
import Order from "../models/orderModel.js";
import Product from "../models/productsModel.js";
import { io } from "../server.js";

// Create order: Cash on Delivery
export const createCashOnDeliveryOrder = async (req, res) => {
  try {
    const { cartItems, totalAmount, paymentMethod, paymentStatus, customerEmail, customerName, customerId } = req.body;

    const newOrder = new Order({
      cartItems,
      totalAmount,
      paymentStatus,
      paymentMethod,
      customerEmail,
      customerName,
      customerId,
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create order: Stripe (before redirect)
export const createStripeOrder = async (req, res) => {
  try {
    console.log("=== BACKEND ORDER CREATION DEBUG START ===");
    console.log("1. Request body:", req.body);
    
    const {
      cartItems,
      totalAmount,
      stripeSessionId,
      customerEmail,
      customerName,
      customerId,
    } = req.body;

    console.log("2. Extracted data:", {
      cartItemsCount: cartItems?.length,
      totalAmount,
      stripeSessionId,
      customerEmail,
      customerName,
      customerId
    });

    // Validate required fields
    if (!stripeSessionId) {
      console.error("3. Missing stripeSessionId");
      return res.status(400).json({ success: false, message: 'Missing stripeSessionId' });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      console.error("4. Invalid cart items");
      return res.status(400).json({ success: false, message: 'Invalid cart items' });
    }

    console.log("5. Creating order object...");
    const newOrder = new Order({
      cartItems,
      totalAmount,
      stripeSessionId,
      paymentStatus: "paid",
      paymentMethod: "stripe",
      customerEmail,
      customerName,
      customerId,
    });

    console.log("6. Order object created:", newOrder);

    console.log("7. Saving order to database...");
    const savedOrder = await newOrder.save();
    console.log("8. Order saved successfully:", savedOrder._id);
    console.log("=== BACKEND ORDER CREATION DEBUG END ===");

    res.status(201).json({ success: true, order: savedOrder });
  } catch (error) {
    console.error("=== BACKEND ORDER CREATION ERROR ===");
    console.error("Error details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Stripe order after successful payment
export const updateStripeOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { stripeSessionId, paymentStatus } = req.body;

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        stripeSessionId,
        paymentStatus,
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('updateStripeOrder Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all orders for admin dashboard
export const getAllOrders = async (req, res) => {
  try {
    console.log("Fetching all orders...");
    const orders = await Order.find({})
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 }); // Most recent first
    
    console.log(`Found ${orders.length} orders`);
    
    res.status(200).json({ 
      success: true, 
      orders,
      total: orders.length 
    });
  } catch (error) {
    console.log(`getAllOrders Error ${error}`);
    res.status(500).json({ success: false, message: "Error fetching orders", error: error.message });
  }
};

async function updateStockAndNotify(cartItems) {
  for (const item of cartItems) {
    const product = await Product.findById(item.productId);
    if (product) {
      console.log(`[STOCK] Before update: ${product.title} (Stock: ${product.stock}), Decrement by: ${item.quantity || 1}`);
      product.stock = Math.max(0, product.stock - (item.quantity || 1));
      await product.save();
      console.log(`[STOCK] After update: ${product.title} (Stock: ${product.stock})`);
      if (product.stock <= 3) {
        io.to('admin').emit("lowStock", {
          productId: product._id,
          title: product.title,
          stock: product.stock,
        });
        console.log(`[SOCKET.IO] lowStock emitted to admin room for product: ${product.title} (Stock: ${product.stock})`);
      }
    } else {
      console.log(`[STOCK] Product not found for productId: ${item.productId}`);
    }
  }
}
