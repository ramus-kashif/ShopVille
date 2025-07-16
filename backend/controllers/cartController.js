import Cart from '../models/cartModel.js';
import Product from '../models/productsModel.js';

// Get user's cart
export const getCart = async (req, res) => {
  const userId = req.user._id;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  res.json({ success: true, cart });
};

// Add or update item in cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const idx = cart.items.findIndex(item => item.productId.equals(productId));
    
    if (idx > -1) {
      cart.items[idx].quantity = quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    
    await cart.save();
    
    res.json({ success: true, cart });
  } catch (error) {
    console.error('Error in addToCart:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ success: true });
  cart.items = cart.items.filter(item => !item.productId.equals(productId));
  await cart.save();
  res.json({ success: true, cart });
};

// Clear cart
export const clearCart = async (req, res) => {
  const userId = req.user._id;
  await Cart.findOneAndDelete({ userId });
  res.json({ success: true });
}; 