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
import { register } from "../store/features/auth/authSlice";
import { UserPlus, Eye, EyeOff, Package, Shield, Truck, Mail, Phone, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [inputValues, setInputValues] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerMethod, setRegisterMethod] = useState('email'); // 'email' or 'phone'
  const [otpEmail, setOtpEmail] = useState('');
  const [otpPhone, setOtpPhone] = useState('');
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null);
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
    dispatch(register(inputValues))
      .unwrap()
      .then((response) => {
        if (response?.success == true) {
          toast.success(response?.message, { autoClose: 2000 });
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          toast.error(response?.message, { autoClose: 2000 });
        }
      })
      .catch((error) => {
        toast.error(error, { autoClose: 2000 });
      });
  };

  const handlePhoneRegistration = async (e) => {
    e.preventDefault();
    if (!inputValues.name || !inputValues.email || !inputValues.phone) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: inputValues.email, 
          phone: inputValues.phone 
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowOtpForm(true);
        toast.success("OTP sent to your email and phone");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error("Server error sending OTP");
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    setOtpStatus('verifying');
    
    try {
      const res = await fetch("http://localhost:8080/api/v1/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: inputValues.name,
          email: inputValues.email, 
          phone: inputValues.phone,
          password: inputValues.password,
          otpEmail,
          otpPhone
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpStatus('success');
        toast.success("Account created successfully!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setOtpStatus('error');
        toast.error(data.message || "OTP verification failed");
      }
    } catch (err) {
      setOtpStatus('error');
      toast.error("Server error verifying OTP");
    }
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
              <UserPlus className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 tracking-tight">
              Join ShopVille!
            </h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Create your account and start exploring amazing products
            </p>
            
            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Secure Registration</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg">Access Premium Products</span>
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
          {/* Registration Method Toggle */}
          <div className="flex mb-6 bg-[#F8F9FA] rounded-xl p-1">
            <button
              onClick={() => setRegisterMethod('email')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                registerMethod === 'email' 
                  ? 'bg-white text-[#FF6B00] shadow-sm' 
                  : 'text-[#6C757D] hover:text-[#1C1C1E]'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email
            </button>
            <button
              onClick={() => setRegisterMethod('phone')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                registerMethod === 'phone' 
                  ? 'bg-white text-[#FF6B00] shadow-sm' 
                  : 'text-[#6C757D] hover:text-[#1C1C1E]'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              Phone
            </button>
          </div>

          {registerMethod === 'email' ? (
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
              <CardHeader className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#FF6B00] to-[#FF8C42] rounded-2xl flex items-center justify-center shadow-lg">
                    <UserPlus className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-[#1C1C1E] tracking-tight">
                  Create Account
                </CardTitle>
                <CardDescription className="text-lg text-[#6C757D] mt-2">
                  Join ShopVille and start shopping today!
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#1C1C1E] font-medium">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    required
                    name="name"
                    value={inputValues.name || ""}
                    onChange={handleChange}
                    className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                  />
                </div>
                
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
                      placeholder="Create a strong password"
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
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#1C1C1E] font-medium">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      required
                      name="confirmPassword"
                      value={inputValues.confirmPassword || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] pr-12 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="pt-6">
                <Button
                  type="submit"
                  className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  disabled={status == "loading"}
                >
                  {status == "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Creating Account...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Create Account
                    </span>
                  )}
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
                  Phone Registration
                </CardTitle>
                <CardDescription className="text-lg text-[#6C757D] mt-2">
                  Register with phone number and email verification
                </CardDescription>
              </CardHeader>
              
              {!showOtpForm ? (
                <form onSubmit={handlePhoneRegistration} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[#1C1C1E] font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      required
                      name="name"
                      value={inputValues.name || ""}
                      onChange={handleChange}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                    />
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[#1C1C1E] font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[#1C1C1E] font-medium">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                        name="confirmPassword"
                        value={inputValues.confirmPassword || ""}
                        onChange={handleChange}
                        className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] pr-12 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
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
                <form onSubmit={handleOtpVerification} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otpEmail" className="text-[#1C1C1E] font-medium">
                      Email OTP
                    </Label>
                    <Input
                      id="otpEmail"
                      type="text"
                      placeholder="Enter email OTP"
                      required
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="otpPhone" className="text-[#1C1C1E] font-medium">
                      Phone OTP
                    </Label>
                    <Input
                      id="otpPhone"
                      type="text"
                      placeholder="Enter phone OTP"
                      required
                      value={otpPhone}
                      onChange={(e) => setOtpPhone(e.target.value)}
                      className="h-12 rounded-xl border-2 border-[#E0E0E0] focus:border-[#FF6B00] focus:ring-4 focus:ring-[#FF6B00]/10 bg-white text-[#1C1C1E] placeholder-[#6C757D] transition-all duration-200"
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full h-12 bg-[#FF6B00] hover:bg-[#E55A00] text-white font-semibold rounded-xl text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                    disabled={otpStatus === 'verifying'}
                  >
                    {otpStatus === 'verifying' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Verifying...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Verify & Create Account
                      </span>
                    )}
                  </Button>
                  
                  <button
                    type="button"
                    onClick={() => setShowOtpForm(false)}
                    className="w-full text-[#6C757D] hover:text-[#1C1C1E] transition-colors duration-200"
                  >
                    ← Back to registration form
                  </button>
                </form>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-[#6C757D] mb-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#FF6B00] hover:text-[#E55A00] font-semibold transition-colors duration-200"
              >
                Sign In
              </Link>
            </p>
            
            <div className="flex items-center justify-center gap-4 text-[#6C757D] text-sm">
              <Link to="/terms" className="hover:text-[#FF6B00] transition-colors duration-200">
                Terms of Service
              </Link>
              <span>•</span>
              <Link to="/privacy" className="hover:text-[#FF6B00] transition-colors duration-200">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
