import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserCart, initializeCart, fetchUserCart, updateCartPrices } from "./store/features/cart/cartSlice";
import { getAllProducts } from "./store/features/products/productSlice";
import RegisterPage from "./Pages/RegisterPage";
import LoginPage from "./Pages/LoginPage";
import AdminLogin from "./Pages/Admin/AdminLogin";
import HomePage from "./Pages/HomePage";
import DashboardLayout from "./Pages/Admin/DashboardLayout";
import Dashboard from "./Pages/Admin/Dashboard";
import Users from "./Pages/Admin/Users";
import Products from "./Pages/Admin/Products";
import Orders from "./Pages/Admin/Orders";
import Carousel from "./Pages/Admin/Carousel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./Pages/About";
import Shop from "./Pages/Shop";
import Contact from "./Pages/Contact";
import Profile from "./Pages/Profile";
import Categories from "./Pages/Admin/Categories";
import UpdateCategory from "./Pages/Admin/UpdateCategory";
import AddProduct from "./Pages/Admin/addProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdateProduct from "./Pages/Admin/UpdateProduct";
import ProductDetails from "./Pages/ProductDetails";
import CartPage from "./Pages/CartPage";
import CheckoutPage from "./Pages/CheckoutPage";
import Success from "./Pages/Success";
import Cancel from "./Pages/Cancel";
import OrderPage from "./Pages/OrderPage";
import GoogleAuthCallback from "./Pages/GoogleAuthCallback";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import socket from './store/socket.js';
import { toast } from "react-toastify";

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.products.products);
  const isAdmin = location.pathname.startsWith("/admin");
  // Hide Navbar on login and register pages and all /admin* routes
  const hideNavbar = ["/login", "/register"].includes(location.pathname) || isAdmin;

  // Initialize cart on app start
  useEffect(() => {
    if (user?._id) {
      dispatch(initializeCart({ userId: user._id }));
      // Only connect if not already connected
      if (!socket.connected) {
        socket.connect();
      }
      const handleConnect = () => {
        // Only emit join if not already in the room
        console.log('[Socket.IO] Emitting join for user:', user._id);
        socket.emit('join', user._id);
      };
      const handleConnectError = (error) => {
        // Only log critical errors
        // Optionally, you can toast or report this
        console.error('[Socket.IO] Connection error:', error);
      };
      const priceAlertHandler = (data) => {
        console.log('[Socket.IO] Received priceAlert:', data);
        if (data.newPrice < data.oldPrice) {
          toast.info(`Price alert: ${data.title} dropped from PKR ${data.oldPrice} to PKR ${data.newPrice}`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        // Always update cart prices on any priceAlert
        dispatch(getAllProducts()).then((action) => {
          if (action.payload && action.payload.products) {
            dispatch(updateCartPrices({ products: action.payload.products }));
          }
        });
      };
      socket.off('connect', handleConnect);
      socket.off('connect_error', handleConnectError);
      socket.off('priceAlert');
      socket.on('connect', handleConnect);
      socket.on('connect_error', handleConnectError);
      socket.on('priceAlert', priceAlertHandler);
      return () => {
        socket.off('connect', handleConnect);
        socket.off('connect_error', handleConnectError);
        socket.off('priceAlert', priceAlertHandler);
        // Disconnect socket on logout
        if (!user?._id && socket.connected) {
          console.log('[Socket.IO] Disconnecting socket (user logged out)');
          socket.disconnect();
        }
      };
    } else {
      // Only disconnect if connected
      if (socket.connected) {
        console.log('[Socket.IO] Disconnecting socket (no user)');
        socket.disconnect();
      }
    }
  }, [user, dispatch]);

  // Update cart prices when products change
  useEffect(() => {
    if (products && products.products && Array.isArray(products.products)) {
      dispatch(updateCartPrices({ products: products.products }));
    }
  }, [products, dispatch]);

  // Load user's cart when user changes
  useEffect(() => {
    if (user?._id) {
      dispatch(loadUserCart({ userId: user._id }));
    }
  }, [user, dispatch]);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route
          path="/adminLogin"
          element={<AdminLogin />}
        />
        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/update/:slug" element={<UpdateCategory />} />
          <Route
            path="products/update/:productId"
            element={<UpdateProduct />}
          />
          <Route path="orders" element={<Orders />} />
          <Route path="carousel" element={<Carousel />} />
        </Route>
      </Routes>
      {!isAdmin && <Footer />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </>
  );
}

export default App;
