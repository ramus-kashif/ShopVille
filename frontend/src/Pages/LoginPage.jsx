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
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/features/auth/authSlice";
import { LogIn, Eye, EyeOff, Package, Shield, Truck, Mail, Phone } from "lucide-react";

export default function LoginPage() {
  const [inputValues, setInputValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState('email'); // 'email' or 'phone'
  const [phoneOtp, setPhoneOtp] = useState('');
  const [showPhoneOtp, setShowPhoneOtp] = useState(false);
  const [phoneLoginStatus, setPhoneLoginStatus] = useState(null);
  const { status } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputValues((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(inputValues))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          setTimeout(() => {
            // Role-based redirect
            if (response?.user?.role === 1) {
              navigate("/admin");
            } else {
              navigate("/shop");
            }
          }, 2000);
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (!inputValues.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/phone/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: inputValues.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setShowPhoneOtp(true);
        toast.success("OTP sent to your phone");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Server error sending OTP");
    }
  };

  const handlePhoneOtpVerify = async (e) => {
    e.preventDefault();
    setPhoneLoginStatus('verifying');
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/phone/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          phone: inputValues.phone, 
          otp: phoneOtp 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPhoneLoginStatus('success');
        toast.success("Phone login successful!");
        
        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.user.role === 1) {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      } else {
        setPhoneLoginStatus('error');
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      setPhoneLoginStatus('error');
      toast.error("Server error verifying OTP");
    }
  };

  const handleGoogleLogin = () => {
    // Initialize Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(window.location.origin + '/auth/google/callback')}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
    
    // Open Google OAuth popup
    const popup = window.open(googleAuthUrl, 'googleOAuth', 'width=500,height=600,scrollbars=yes,resizable=yes');
    
    // Listen for the callback
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        // Handle popup closed without completion
        toast.error('Google login was cancelled');
      }
    }, 1000);
    
    // Listen for message from popup
    window.addEventListener('message', (event) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
        clearInterval(checkClosed);
        popup.close();
        
        // Handle successful Google login
        const { user } = event.data;
        toast.success('Successfully logged in with Google!');
        
        // Store user data and redirect
        localStorage.setItem('user', JSON.stringify(user));
        if (user.role === 1) {
          navigate("/admin");
        } else {
          navigate("/shop");
        }
      } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
        clearInterval(checkClosed);
        popup.close();
        toast.error(event.data.error || 'Google login failed');
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] via-white to-[#F1F3F4] flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-4xl flex flex-col lg:flex-row items-stretch shadow-2xl rounded-3xl overflow-hidden bg-white border border-[#E0E0E0] animate-fade-in">
        {/* Visual/Side Section */}
        <div className="hidden lg:flex flex-col items-center justify-center w-1/2 bg-gradient-to-br from-[#FF6B00] via-[#FF8C42] to-[#FF6B00] p-12 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-full"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-6 mx-auto animate-bounce-in">
              <LogIn className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Sign in to access your account and explore our amazing products
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Secure & Fast Login</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Access to Premium Products</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Fast & Free Shipping</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col justify-center p-8 lg:p-12">
          {/* Login Method Toggle */}
          <div className="flex mb-6 bg-[#F8F9FA] rounded-xl p-1">
            <button
              onClick={() => setLoginMethod('email')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                loginMethod === 'email' 
                  ? 'bg-white text-[#FF6B00] shadow-sm' 
                  : 'text-[#6C757D] hover:text-[#1C1C1E]'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setLoginMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                loginMethod === 'phone' 
                  ? 'bg-white text-[#FF6B00] shadow-sm' 
                  : 'text-[#6C757D] hover:text-[#1C1C1E]'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {loginMethod === 'email' ? (
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <CardHeader className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
                  Sign In to ShopVille
                </CardTitle>
                <CardDescription className="text-lg text-[#6C757D] mt-2">
                  Welcome back! Please login to your account.
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#1C1C1E] font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
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
                      placeholder="Enter your password"
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
              
              <CardFooter className="pt-6 space-y-4">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  disabled={status == "loading"}
                >
                  {status == "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Sign In
                    </span>
                  )}
                </Button>
                
                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-[#E0E0E0]" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-[#6C757D]">Or continue with</span>
                  </div>
                </div>
                
                {/* Google OAuth Button */}
                <Button
                  type="button"
                  onClick={() => handleGoogleLogin()}
                  className="w-full h-12 bg-white hover:bg-[#F8F9FA] text-[#1C1C1E] font-semibold rounded-xl text-lg shadow-lg border-2 border-[#E0E0E0] hover:border-[#FF6B00] transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </span>
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="w-full max-w-md mx-auto">
              <CardHeader className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
                  Phone Login
                </CardTitle>
                <CardDescription className="text-lg text-[#6C757D] mt-2">
                  Enter your phone number to receive OTP
                </CardDescription>
              </CardHeader>
              
              {!showPhoneOtp ? (
                <form onSubmit={handlePhoneLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[#1C1C1E] font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="03xxxxxxxxx or +923xxxxxxxxx"
                      required
                      name="phone"
                      value={inputValues.phone || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Phone className="w-5 h-5" />
                      Send OTP
                    </span>
                  </Button>
                </form>
              ) : (
                <form onSubmit={handlePhoneOtpVerify} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-[#1C1C1E] font-medium">
                      Enter OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      required
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    disabled={phoneLoginStatus === 'verifying'}
                  >
                    {phoneLoginStatus === 'verifying' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Shield className="w-5 h-5" />
                        Verify OTP
                      </span>
                    )}
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => setShowPhoneOtp(false)}
                    className="w-full text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
                  >
                    ← Back to phone input
                  </button>
                </form>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-[#6C757D] mb-4">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-[#FF6B00] hover:text-[#E55A00] font-semibold transition-colors duration-200"
              >
                Create Account
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-4 text-[#6C757D] text-sm">
              <Link to="/forgot-password" className="hover:text-[#FF6B00] transition-colors duration-200">
                Forgot Password?
              </Link>
              <span>•</span>
              <Link to="/contact" className="hover:text-[#FF6B00] transition-colors duration-200">
                Need Help?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
