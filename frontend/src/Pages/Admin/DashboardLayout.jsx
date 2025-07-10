import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  CircleUser,
  Home,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
  Image,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { logout } from "@/store/features/auth/authSlice";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) {
      setMessage("You are not logged in. Redirecting you to login page");
      setTimeout(() => {
        navigate("/login");
      }, [3000]);
    } else if (user.role !== 1) {
      setMessage(
        "You are not authorized to access this resource. Redirecting you to Homepage"
      );
      setTimeout(() => {
        navigate("/");
      }, [3000]);
    }
  }, [user, navigate]);
  
  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          setTimeout(() => {
            navigate("/");
          }, 2000);
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (message) {
    return (
      <div className="h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-3xl text-gray-800">{message}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Desktop Menu */}
      <div className="hidden border-r border-gray-200 bg-white shadow-lg md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b border-gray-200 px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-orange-500">
              <Package2 className="h-6 w-6" />
              <span className="">ShopVille</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                to={"/admin"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                to={"/admin/orders"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin/orders") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <ShoppingCart className="h-4 w-4" />
                Orders
              </Link>
              <Link
                to={"/admin/products"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin/products") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Package2 className="h-4 w-4" />
                Products
              </Link>
              <Link
                to={"/admin/categories"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin/categories") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Package className="h-4 w-4" />
                Categories
              </Link>
              <Link
                to={"/admin/carousel"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin/carousel") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Image className="h-4 w-4" />
                Carousel
              </Link>
              <Link
                to={"/admin/users"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  isActive("/admin/users") 
                    ? "bg-orange-100 text-orange-700 border-r-2 border-orange-500" 
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                }`}
              >
                <Users className="h-4 w-4" />
                Users
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Mobile Menu */}
        <header className="flex h-14 items-center gap-4 border-b border-gray-200 bg-white shadow-sm px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-white border-gray-200">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold text-orange-500"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">ShopVille</span>
                </Link>
                <Link
                  to={"/admin"}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                    isActive("/admin") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  to={"/admin/orders"}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                    isActive("/admin/orders") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  Orders
                </Link>
                <Link
                  to={"/admin/products"}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                    isActive("/admin/products") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Package className="h-5 w-5" />
                  Products
                </Link>
                <Link
                  to={"/admin/categories"}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    isActive("/admin/categories") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Package2 className="h-4 w-4" />
                  Categories
                </Link>
                <Link
                  to={"/admin/carousel"}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                    isActive("/admin/carousel") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Image className="h-5 w-5" />
                  Carousel
                </Link>
                <Link
                  to={"/admin/users"}
                  className={`mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 transition-all ${
                    isActive("/admin/users") 
                      ? "bg-orange-100 text-orange-700" 
                      : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
                  }`}
                >
                  <Users className="h-5 w-5" />
                  Users
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex-1"></div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full border border-gray-300 bg-white hover:bg-gray-50">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="h-5 w-5 rounded-full object-cover" 
                  />
                ) : (
                  <CircleUser className="h-5 w-5 text-gray-600" />
                )}
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white border-gray-200 text-gray-700 min-w-[220px] shadow-lg">
              <DropdownMenuLabel className="text-gray-900">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* User details */}
              <div className="px-3 py-2 flex items-center gap-3 text-sm text-gray-600">
                {user?.picture ? (
                  <img 
                    src={user.picture} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border border-gray-300" 
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg text-gray-500">?</div>
                )}
                <div className="font-semibold text-gray-800">{user?.name}</div>
              </div>
              <DropdownMenuSeparator />
              {/* Edit profile */}
              <DropdownMenuItem className="hover:bg-orange-50 text-gray-700 hover:text-orange-700">
                <Link to="/profile">Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="hover:bg-orange-50 text-gray-700 hover:text-orange-700">
                <button onClick={handleLogout}>Logout</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        {/* Right Side */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-gradient-to-br from-gray-50 to-blue-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
