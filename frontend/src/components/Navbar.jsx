import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Package, 
  ShoppingCart, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Heart, 
  Menu, 
  X, 
  UserPlus, 
  UserCheck, 
  UserX, 
  UserCog, 
  UserCircle, 
  Settings, 
  Bell, 
  Star, 
  Shield, 
  Truck, 
  CreditCard, 
  Home, 
  Store, 
  Phone 
} from "lucide-react";
import { getAllCategories, setSelectedCategory } from "@/store/features/categories/categoriesSlice";
import { searchProducts } from "@/store/features/products/productSlice";
import { selectCartItemCount } from "@/store/features/cart/cartSlice";
import { logout } from "@/store/features/auth/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const profileRef = useRef(null);
  const categoryRef = useRef(null);
  
  const user = useSelector((state) => state.auth.user);
  const categories = useSelector((state) => state.categories.categories) || [];
  const selectedCategory = useSelector((state) => state.categories.selectedCategory);
  const cartItemCount = useSelector(selectCartItemCount);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then((response) => {
        if (response?.success) {
          toast.success("Logged out successfully");
          navigate("/");
        } else {
          toast.error(response?.message || "Logout failed");
        }
      })
      .catch((error) => {
        toast.error(error || "Logout failed");
        // Even if the API call fails, clear local state and redirect
        navigate("/");
      });
  };

  const handleCategorySelect = (categoryId) => {
    const newCategory = categoryId === selectedCategory ? "" : categoryId;
    dispatch(setSelectedCategory(newCategory));
    dispatch(searchProducts({ search: "", page: 1, limit: 8, category: newCategory }));
    setIsCategoryOpen(false);
  };



  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-[#E0E0E0]' 
        : 'bg-white shadow-sm'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
              <Package className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B00] to-[#FF8C42] bg-clip-text text-transparent">
              ShopVille
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Home Link */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {/* Category Dropdown */}
            <div className="relative" ref={categoryRef}>
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium focus:outline-none"
              >
                <Store className="w-4 h-4" />
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Category Dropdown Menu */}
              {isCategoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E0E0E0] py-2 animate-fade-in">
                  <div className="px-4 py-2 border-b border-[#E0E0E0]">
                    <h3 className="text-sm font-semibold text-[#1C1C1E]">All Categories</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {Array.isArray(categories) && categories.length > 0 ? (
                      categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => handleCategorySelect(category._id)}
                          className={`flex items-center space-x-3 px-4 py-3 text-[#6C757D] hover:text-[#FF6B00] hover:bg-[#F8F9FA] transition-colors duration-200 w-full text-left ${selectedCategory === category._id ? 'bg-[#FF6B00]/10 text-[#FF6B00] font-semibold' : ''}`}
                        >
                          <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                          <span className="font-medium capitalize">{category.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-[#6C757D] text-sm">
                        No categories available
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-[#E0E0E0]">
                    <Link
                      to="/shop"
                      onClick={() => setIsCategoryOpen(false)}
                      className="text-[#FF6B00] hover:text-[#E55A00] font-semibold text-sm transition-colors duration-200"
                    >
                      View All Products →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Shop Link */}
            <Link 
              to="/shop" 
              className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
            >
              <Package className="w-4 h-4" />
              <span>Shop</span>
            </Link>
            {/* Wishlist Link */}
            <Link 
              to="/wishlist" 
              className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>

            {/* Contact Link */}
            <Link 
              to="/contact" 
              className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
            >
              <Phone className="w-4 h-4" />
              <span>Contact</span>
            </Link>
          </div>

          {/* Right Side - Search, Cart, Profile */}
          <div className="flex items-center space-x-4">
            {/* Cart Icon */}
            <Link 
              to="/cart" 
              className="relative group"
            >
              <div className="w-12 h-12 bg-[#F8F9FA] hover:bg-[#FF6B00]/10 rounded-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 border-2 border-[#E0E0E0] hover:border-[#FF6B00]">
                <ShoppingCart className="w-5 h-5 text-[#1C1C1E] group-hover:text-[#FF6B00] transition-colors duration-200" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#FF6B00] text-white text-xs rounded-full flex items-center justify-center font-bold animate-bounce-in">
                    {cartItemCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Profile Dropdown */}
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 focus:outline-none"
                >
                  {user.picture ? (
                    <img 
                      src={user.picture} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Profile Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#E0E0E0] py-2 animate-fade-in">
                    <div className="px-4 py-3 border-b border-[#E0E0E0]">
                      <div className="flex items-center space-x-3">
                        {user.picture ? (
                          <img 
                            src={user.picture} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-[#1C1C1E]">{user.name}</p>
                          <p className="text-sm text-[#6C757D]">{user.email || user.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-[#6C757D] hover:text-[#FF6B00] hover:bg-[#F8F9FA] transition-colors duration-200"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        to="/orders"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-[#6C757D] hover:text-[#FF6B00] hover:bg-[#F8F9FA] transition-colors duration-200"
                      >
                        <Package className="w-4 h-4" />
                        <span>My Orders</span>
                      </Link>
                      
                      <Link
                        to="/wishlist"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center space-x-3 px-4 py-3 text-[#6C757D] hover:text-[#FF6B00] hover:bg-[#F8F9FA] transition-colors duration-200"
                      >
                        <Heart className="w-4 h-4" />
                        <span>Wishlist</span>
                      </Link>
                      
                      {user.role === 1 && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center space-x-3 px-4 py-3 text-[#6C757D] hover:text-[#FF6B00] hover:bg-[#F8F9FA] transition-colors duration-200"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                    </div>
                    
                    <div className="px-4 py-2 border-t border-[#E0E0E0]">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsProfileOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-[#DC3545] hover:text-[#BD2130] hover:bg-[#F8F9FA] rounded-lg transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#1C1C1E] hover:text-[#FF6B00] font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-[#FF6B00] hover:bg-[#E55A00] text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 bg-[#F8F9FA] hover:bg-[#FF6B00]/10 rounded-xl flex items-center justify-center transition-all duration-200 border-2 border-[#E0E0E0] hover:border-[#FF6B00]"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-[#1C1C1E]" />
              ) : (
                <Menu className="w-5 h-5 text-[#1C1C1E]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#E0E0E0] animate-fade-in">
            <div className="space-y-4">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/shop" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
              >
                <Package className="w-4 h-4" />
                <span>Shop</span>
              </Link>
              
              <Link 
                to="/contact" 
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
              >
                <Phone className="w-4 h-4" />
                <span>Contact</span>
              </Link>
              
              {user && (
                <>
                  <Link 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                  
                  <Link 
                    to="/orders" 
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
                  >
                    <Package className="w-4 h-4" />
                    <span>My Orders</span>
                  </Link>
                  
                  {user.role === 1 && (
                    <Link 
                      to="/admin" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 text-[#1C1C1E] hover:text-[#FF6B00] transition-colors duration-200 font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin Panel</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 w-full text-left text-[#DC3545] hover:text-[#BD2130] transition-colors duration-200 font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
