import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { LogIn, Eye, EyeOff, Shield } from "lucide-react";
import axios from "axios";
import { setUserFromPhoneRegistration } from "@/store/features/auth/authSlice";
import { loadUserCart } from "@/store/features/cart/cartSlice";

export default function AdminLogin() {
  const [inputValues, setInputValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/users/admin/login",
        inputValues,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      
      if (response?.data?.success) {
        toast.success(response?.data?.message, { autoClose: 2000 });
        
        // Store user data in localStorage and update Redux state
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Update Redux state to reflect logged-in status
        dispatch(setUserFromPhoneRegistration(response.data.user));
        
        // Load user's cart after successful login
        if (response.data.user._id) {
          dispatch(loadUserCart({ userId: response.data.user._id }));
        }
        
        setTimeout(() => {
          navigate("/admin");
        }, 2000);
      } else {
        toast.error(response?.data?.message, { autoClose: 2000 });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed", { autoClose: 2000 });
    } finally {
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F1F3F4] flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
              Admin Login
            </CardTitle>
            <CardDescription className="text-lg text-[#6C757D] mt-2">
              Access admin panel with your credentials
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#1C1C1E] font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter admin email"
                  required
                  name="email"
                  value={inputValues.email || ""}
                  onChange={handleChange}
                  className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1C1C1E] font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    required
                    name="password"
                    value={inputValues.password || ""}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] pr-12 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-6">
              <Button
                type="submit"
                className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                disabled={status === "loading"}
              >
                {status === "loading" ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-5 h-5" />
                    Admin Sign In
                  </span>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-[#6C757D] mb-4">
            Need to login as user?{" "}
            <Link
              to="/login"
              className="text-[#FF6B00] hover:text-[#E55A00] font-semibold transition-colors duration-200"
            >
              User Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
} 