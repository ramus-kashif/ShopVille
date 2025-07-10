import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadUserCart, initializeCart } from "./store/features/cart/cartSlice";
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

function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isAdmin = location.pathname.startsWith("/admin");
  // Hide Navbar on login and register pages
  const hideNavbar = ["/login", "/register", "/admin/login"].includes(location.pathname);

  // Initialize cart on app start
  useEffect(() => {
    if (user?.user?._id) {
      dispatch(initializeCart({ userId: user.user._id }));
    }
  }, []); // Only run once on mount

  // Load user's cart when user changes
  useEffect(() => {
    if (user?.user?._id) {
      dispatch(loadUserCart({ userId: user.user._id }));
    }
  }, [user, dispatch]);

  return (
    <>
      {!isAdmin && !hideNavbar && <Navbar />}
      {!isAdmin && hideNavbar && null}
      <Routes>
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
        <Route path="/admin/login" element={<AdminLogin />} />
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
