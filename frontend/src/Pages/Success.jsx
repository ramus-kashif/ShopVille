import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "@/store/features/cart/cartSlice";

function Success() {
  const navigate = useNavigate();
  const location = useLocation();
  const reduxUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const saveOrder = async () => {
      console.log("=== SUCCESS PAGE DEBUG START ===");
      console.log("1. Location search:", location.search);
      
      const sessionId = new URLSearchParams(location.search).get("session_id");
      console.log("2. Session ID:", sessionId);
      
      if (!sessionId) {
        console.error("3. No session ID found");
        toast.error("No session ID found");
        return;
      }

      // Get data from localStorage
      const cartItems = JSON.parse(localStorage.getItem("cartItems"));
      const totalAmount = parseFloat(localStorage.getItem("totalAmount"));
      const userFromStorage = JSON.parse(localStorage.getItem("orderUser"));
      
      console.log("4. Cart items from localStorage:", cartItems);
      console.log("5. Total amount from localStorage:", totalAmount);
      console.log("6. User from localStorage:", userFromStorage);
      
      // Use Redux user if available, otherwise use localStorage data
      const customerEmail = reduxUser?.user?.email || reduxUser?.email || userFromStorage?.email || "guest@example.com";
      const customerName = reduxUser?.user?.name || reduxUser?.name || userFromStorage?.name || "Guest";
      const customerId = reduxUser?.user?._id || reduxUser?._id || userFromStorage?._id || null;
      
      console.log("7. Final customer data:", {
        email: customerEmail,
        name: customerName,
        id: customerId
      });

      if (!cartItems || !totalAmount) {
        console.error("8. Missing cart data");
        toast.error("Order data not found. Please try again.");
        navigate("/cart");
        return;
      }

      try {
        console.log("9. Creating order with data:", {
          cartItems: cartItems.length,
          totalAmount,
          customerEmail,
          customerName,
          customerId,
          sessionId
        });

        const orderData = {
          cartItems,
          totalAmount,
          stripeSessionId: sessionId,
          customerEmail,
          customerName,
          customerId,
        };
        
        console.log("10. Order data to send:", orderData);

        const response = await fetch("http://localhost:8080/api/v1/orders/create-stripe-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
        
        console.log("11. Response status:", response.status);
        console.log("12. Response headers:", response.headers);

        const data = await response.json();
        console.log("13. Order creation response:", data);

        if (data.success) {
          console.log("14. Order created successfully");
          dispatch(clearCart());
          toast.success("Payment successful! Order has been created.");
        } else {
          console.error("15. Order creation failed:", data.message);
          toast.error(data.message || "Payment succeeded but failed to save order");
        }
      } catch (error) {
        console.error("16. Error creating order:", error);
        console.error("Error stack:", error.stack);
        toast.error("Payment succeeded but failed to save order. Please contact support.");
      }

      // Cleanup localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("orderUser");
      console.log("17. localStorage cleaned up");
      console.log("=== SUCCESS PAGE DEBUG END ===");
    };

    saveOrder();
  }, [location, reduxUser, dispatch, navigate]);

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful 🎉</h1>
      <p className="text-lg">Thank you for your purchase!</p>
      <button
        className="mt-6 px-6 py-2 bg-orange-500 text-white rounded"
        onClick={() => navigate("/")}
      >
        Go to Home
      </button>
    </div>
  );
}

export default Success;
