import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import formatNumber from "format-number";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { clearCart } from "@/store/features/cart/cartSlice";
import { CreditCard, Truck, Shield, ArrowLeft, CheckCircle, Award } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function CheckoutPage() {
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cartItems.length) navigate("/cart");
  }, [cartItems, navigate]);

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCashOnDelivery = async () => {
    try {
      // Get user info from Redux (full response object)
      const userData = user?.user || {};
      const res = await fetch("http://localhost:8080/api/v1/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          paymentMethod: "cod",
          paymentStatus: "pending",
          customerEmail: userData.email || "guest@example.com",
          customerName: userData.name || "Guest",
          customerId: userData._id || null,
        }),
      });
      const data = await res.json();
      if (data.success) {
        dispatch(clearCart());
        toast.success("Order placed with Cash on Delivery", { autoClose: 1500 });
        navigate("/orders");
      } else {
        toast.error("Order placement failed");
      }
    } catch (e) {
      console.error(e);
      toast.error("Server error while placing COD order");
    }
  };

  const handleStripePayment = async () => {
    try {
      console.log("=== STRIPE PAYMENT DEBUG START ===");
      console.log("1. User data:", user);
      console.log("2. Cart items:", cartItems);
      console.log("3. Total amount:", totalAmount);
      
      const stripe = await stripePromise;
      console.log("4. Stripe loaded successfully");
      
      // Prepare user data - use the same structure as Cash on Delivery
      const userData = user?.user || {};
      const userDataForStripe = {
        email: userData.email || "guest@example.com",
        name: userData.name || "Guest",
        _id: userData._id || null,
      };
      
      console.log("5. Prepared user data:", userDataForStripe);
      
      // Save to localStorage first
      localStorage.setItem("orderUser", JSON.stringify(userDataForStripe));
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("totalAmount", totalAmount.toString());
      console.log("6. Data saved to localStorage");
      
      // 1) Create Stripe Checkout Session with user data
      console.log("7. Creating Stripe session...");
      const sessionRes = await fetch(
        "http://localhost:8080/api/v1/payments/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            cartItems,
            userData: userDataForStripe
          }),
        }
      );
      
      console.log("8. Session response status:", sessionRes.status);
      console.log("9. Session response headers:", sessionRes.headers);
      
      if (!sessionRes.ok) {
        const errorData = await sessionRes.json();
        console.error("10. Session creation failed:", errorData);
        throw new Error(errorData.error || "Failed to create checkout session");
      }
      
      const sessionData = await sessionRes.json();
      console.log("11. Session data received:", sessionData);
      
      const { id: sessionId } = sessionData;
      
      if (!sessionId) {
        console.error("12. No session ID in response");
        throw new Error("No session ID received from server");
      }

      console.log("13. Session ID:", sessionId);

      // 2) Redirect to Stripe Checkout
      console.log("14. Redirecting to Stripe checkout...");
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error("15. Stripe redirect error:", error);
        throw new Error(error.message);
      }
      
      console.log("16. Stripe redirect successful");
      console.log("=== STRIPE PAYMENT DEBUG END ===");
    } catch (error) {
      console.error("=== STRIPE PAYMENT ERROR ===");
      console.error("Error details:", error);
      console.error("Error stack:", error.stack);
      toast.error(`Payment error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-[#1C1C1E] mb-2">Checkout</h1>
          <p className="text-lg text-[#6C757D]">Complete your purchase securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-8 mb-6 border border-[#E0E0E0]">
              <h2 className="text-2xl font-bold text-[#1C1C1E] mb-6 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-[#28A745]" />
                Order Summary
              </h2>
              
              <div className="space-y-4">
                {cartItems.map((item, index) => (
                  <div
                    key={item.productId}
                    className="flex items-center gap-4 p-4 bg-[#F8F9FA] rounded-xl border border-[#E0E0E0]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={item.pictureUrl}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1C1C1E]">{item.title}</h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-[#6C757D]">
                          Qty: {item.quantity} × {formatNumber({ prefix: "PKR " })(item.price)}
                        </div>
                        <div className="font-semibold text-[#1C1C1E]">
                          {formatNumber({ prefix: "PKR " })(item.price * item.quantity)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-sm p-8 border border-[#E0E0E0]">
              <h2 className="text-2xl font-bold text-[#1C1C1E] mb-6">Payment Method</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cash on Delivery */}
                <div className="border-2 border-[#E0E0E0] rounded-xl p-6 hover:border-[#FF6B00]/50 transition-colors duration-200 cursor-pointer group bg-[#F8F9FA]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#28A745]/20 rounded-full flex items-center justify-center group-hover:bg-[#28A745]/30 transition-colors duration-200">
                      <Truck className="w-6 h-6 text-[#28A745]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1C1C1E]">Cash on Delivery</h3>
                      <p className="text-sm text-[#6C757D]">Pay when you receive</p>
                    </div>
                  </div>
                  <ul className="space-y-2 text-sm text-[#6C757D]">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      No upfront payment required
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      Pay with cash upon delivery
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      Secure and convenient
                    </li>
                  </ul>
                  <button
                    onClick={handleCashOnDelivery}
                    className="w-full mt-4 bg-[#28A745] hover:bg-[#218838] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Choose Cash on Delivery
                  </button>
                </div>

                {/* Stripe Payment */}
                <div className="border-2 border-[#E0E0E0] rounded-xl p-6 hover:border-[#FF6B00]/50 transition-colors duration-200 cursor-pointer group bg-[#F8F9FA]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-[#007BFF]/20 rounded-full flex items-center justify-center group-hover:bg-[#007BFF]/30 transition-colors duration-200">
                      <CreditCard className="w-6 h-6 text-[#007BFF]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[#1C1C1E]">Secure Payment</h3>
                      <p className="text-sm text-[#6C757D]">Pay with card online</p>
                    </div>
                  </div>
                  
                  {/* Payment Icons */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      {/* Visa */}
                      <div className="w-12 h-8 bg-gradient-to-r from-[#1A1F71] to-[#00539C] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">VISA</span>
                      </div>
                      {/* Mastercard */}
                      <div className="w-12 h-8 bg-gradient-to-r from-[#EB001B] to-[#F79E1B] rounded flex items-center justify-center">
                        <div className="w-6 h-4 bg-white rounded-sm flex items-center justify-center">
                          <div className="w-3 h-3 bg-[#EB001B] rounded-full"></div>
                        </div>
                      </div>
                      {/* American Express */}
                      <div className="w-12 h-8 bg-gradient-to-r from-[#006FCF] to-[#00A1DE] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">AMEX</span>
                      </div>
                      {/* PayPal */}
                      <div className="w-12 h-8 bg-[#003087] rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">PayPal</span>
                      </div>
                    </div>
                  </div>
                  
                  <ul className="space-y-2 text-sm text-[#6C757D]">
                    <li className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#007BFF]" />
                      SSL encrypted payment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      Instant order confirmation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      Multiple card types accepted
                    </li>
                  </ul>
                  <button
                    onClick={handleStripePayment}
                    className="w-full mt-4 bg-[#007BFF] hover:bg-[#0056B3] text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Pay with Card
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Total */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8 border border-[#E0E0E0]">
              <h2 className="text-xl font-bold text-[#1C1C1E] mb-6">Order Total</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-[#6C757D]">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">{formatNumber({ prefix: "PKR " })(totalAmount.toFixed(2))}</span>
                </div>
                <div className="flex justify-between text-[#6C757D]">
                  <span>Shipping</span>
                  <span className="text-[#28A745] font-semibold">Free</span>
                </div>
                <div className="flex justify-between text-[#6C757D]">
                  <span>Tax</span>
                  <span className="font-semibold">Included</span>
                </div>
                <div className="border-t border-[#E0E0E0] pt-4">
                  <div className="flex justify-between text-2xl font-bold text-[#1C1C1E]">
                    <span>Total</span>
                    <span className="text-[#FF6B00]">{formatNumber({ prefix: "PKR " })(totalAmount.toFixed(2))}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-[#28A745]/10 border border-[#28A745]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#28A745]">
                    <Shield className="w-4 h-4" />
                    <span className="text-sm font-medium">Secure Checkout</span>
                  </div>
                  <p className="text-xs text-[#28A745]/80 mt-1">
                    Your payment information is protected with bank-level security
                  </p>
                </div>
                
                <div className="bg-[#007BFF]/10 border border-[#007BFF]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#007BFF]">
                    <Truck className="w-4 h-4" />
                    <span className="text-sm font-medium">Free Shipping</span>
                  </div>
                  <p className="text-xs text-[#007BFF]/80 mt-1">
                    Free delivery on all orders
                  </p>
                </div>

                <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 text-[#FF6B00]">
                    <Award className="w-4 h-4" />
                    <span className="text-sm font-medium">Quality Guarantee</span>
                  </div>
                  <p className="text-xs text-[#FF6B00]/80 mt-1">
                    30-day return policy on all items
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => navigate("/cart")}
                className="w-full mt-6 flex items-center justify-center gap-2 text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
