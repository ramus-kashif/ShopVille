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
import Navbar from "./components/Navbar";
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

function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  return (
    <>
      {!isAdmin && <Navbar />}
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
          <Route path="products/update/:productId" element={<UpdateProduct />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
