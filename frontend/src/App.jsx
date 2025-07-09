import { Routes, Route, useLocation } from "react-router-dom";
import RegisterPage from "./Pages/RegisterPage";
import { ToastContainer } from "react-toastify";
import LoginPage from "./Pages/LoginPage";
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

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  // Hide Navbar on login and register pages
  const hideNavbar = ["/login", "/register"].includes(location.pathname);
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
      <ToastContainer />
    </>
  );
}

export default App;
