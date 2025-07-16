import {
  removeFromCart,
  updateQuantity,
  removeFromCartWithBackendSync,
  updateQuantityWithBackendSync,
} from "@/store/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import formatNumber from "format-number";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Package } from "lucide-react";

function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);

  const handleChangeQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    if (user?._id) {
      dispatch(updateQuantityWithBackendSync({
        productId,
        quantity,
        userId: user._id,
      }));
    } else {
      dispatch(
        updateQuantity({
          productId,
          quantity,
          userId: null,
        })
      );
    }
  };

  const handleRemoveCart = (productId) => {
    if (user?._id) {
      dispatch(removeFromCartWithBackendSync({ itemId: productId, userId: user._id }));
    } else {
      dispatch(removeFromCart({ itemId: productId, userId: null }));
    }
    toast.info("Item removed from cart successfully", { autoClose: 1500 });
  };

  // Robust subtotal calculation
  const totalAmount = cartItems.reduce((total, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return total + price * quantity;
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          {/* Animated Shopping Cart Icon */}
          <div className="relative mb-8">
            <div className="w-32 h-32 mx-auto bg-[#FF6B00] rounded-full flex items-center justify-center shadow-lg animate-pulse">
              <ShoppingCart className="w-16 h-16 text-white" />
            </div>
            {/* Floating items animation */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#DC3545] rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-sm font-bold">0</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-[#1C1C1E] mb-4">Your Cart is Empty</h1>
          <p className="text-lg text-[#6C757D] mb-8 leading-relaxed">
            Looks like you haven't added any items to your cart yet. 
            Start shopping to discover amazing products!
          </p>
          
          {/* Animated shopping suggestions */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-4 text-[#6C757D]">
              <Package className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Browse our latest products</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-[#6C757D]">
              <ShoppingCart className="w-5 h-5 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <span className="text-sm">Add items to your cart</span>
            </div>
            <div className="flex items-center justify-center space-x-4 text-[#6C757D]">
              <ArrowRight className="w-5 h-5 animate-pulse" style={{ animationDelay: '1s' }} />
              <span className="text-sm">Complete your purchase</span>
            </div>
          </div>
          
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <ShoppingCart className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#1C1C1E] mb-2">Shopping Cart</h1>
          <p className="text-lg text-[#6C757D]">Review your items and proceed to checkout</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <div
                key={item.productId + '-' + (item.title || index)}
                className="bg-white rounded-2xl shadow-sm p-6 transform transition-all duration-300 hover:shadow-lg border border-[#E0E0E0] hover:border-[#FF6B00]/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-6">
                  {/* Product Image */}
                  <div className="relative">
                    <img
                      src={item.pictureUrl || item.picture || "/placeholder.png"}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-xl shadow-sm"
                      onError={e => { e.target.onerror = null; e.target.src = "/placeholder.png"; }}
                    />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B00] text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-[#1C1C1E] mb-2">{item.title}</h3>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-[#FF6B00]">
                        {formatNumber({ prefix: "PKR " })(item.price)}
                      </div>
                      <div className="text-lg font-semibold text-[#6C757D]">
                        Total: {formatNumber({ prefix: "PKR " })(item.price * item.quantity)}
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleChangeQuantity(item.productId, item.quantity - 1)}
                          className="w-10 h-10 bg-[#F8F9FA] hover:bg-[#EDEDED] text-[#1C1C1E] hover:text-[#FF6B00] rounded-lg flex items-center justify-center transition-colors duration-200 border border-[#E0E0E0] hover:border-[#FF6B00]"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center text-lg font-semibold text-[#1C1C1E]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleChangeQuantity(item.productId, item.quantity + 1)}
                          className="w-10 h-10 bg-[#F8F9FA] hover:bg-[#EDEDED] text-[#1C1C1E] hover:text-[#FF6B00] rounded-lg flex items-center justify-center transition-colors duration-200 border border-[#E0E0E0] hover:border-[#FF6B00]"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveCart(item.productId)}
                        className="flex items-center gap-2 text-[#DC3545] hover:text-[#BD2130] transition-colors duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="font-medium">Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8 border border-[#E0E0E0]">
              <h2 className="text-2xl font-bold text-[#1C1C1E] mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6C757D]">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">{formatNumber({ prefix: "PKR " })(totalAmount.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-[#6C757D]">
                  <span>Shipping</span>
                  <span className="text-[#28A745] font-semibold">Free</span>
                </div>
                <div className="border-t border-[#E0E0E0] pt-4">
                  <div className="flex justify-between text-xl font-bold text-[#1C1C1E]">
                    <span>Total</span>
                    <span className="text-[#FF6B00]">{formatNumber({ prefix: "PKR " })(totalAmount.toFixed(2))}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="w-full bg-[#FF6B00] hover:bg-[#FF8C42] text-white py-4 px-6 rounded-xl text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <div className="mt-4 text-center">
                <Link 
                  to="/shop" 
                  className="text-[#FF6B00] hover:text-[#FF8C42] font-medium transition-colors duration-200"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
