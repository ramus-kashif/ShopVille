import { Link } from "react-router-dom";
import { Star, Shield, Truck, CreditCard, Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-[#E0E0E0] mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold text-[#1C1C1E] mb-4">ShopVille</h3>
            <p className="text-[#6C757D] mb-6 leading-relaxed">
              Your trusted destination for quality products. We offer a wide range of items 
              with excellent customer service and fast delivery.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center hover:bg-[#FF8C42] transition-colors duration-200">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center hover:bg-[#FF8C42] transition-colors duration-200">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center hover:bg-[#FF8C42] transition-colors duration-200">
                <Truck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#1C1C1E] mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  My Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold text-[#1C1C1E] mb-4">Customer Service</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Returns & Exchanges
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Shipping Information
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-[#6C757D] hover:text-[#FF6B00] transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-[#1C1C1E] mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#FF6B00]" />
                <span className="text-[#6C757D]">support@shopville.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#FF6B00]" />
                <span className="text-[#6C757D]">+92 300 1234567</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#FF6B00]" />
                <span className="text-[#6C757D]">Karachi, Pakistan</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-[#1C1C1E] mb-3">Follow Us</h5>
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-[#F8F9FA] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors duration-200 border border-[#E0E0E0] hover:border-[#FF6B00] cursor-pointer">
                  <span className="text-[#6C757D] hover:text-white font-bold text-sm transition-colors duration-200">f</span>
                </div>
                <div className="w-10 h-10 bg-[#F8F9FA] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors duration-200 border border-[#E0E0E0] hover:border-[#FF6B00] cursor-pointer">
                  <span className="text-[#6C757D] hover:text-white font-bold text-sm transition-colors duration-200">t</span>
                </div>
                <div className="w-10 h-10 bg-[#F8F9FA] hover:bg-[#FF6B00] rounded-full flex items-center justify-center transition-colors duration-200 border border-[#E0E0E0] hover:border-[#FF6B00] cursor-pointer">
                  <span className="text-[#6C757D] hover:text-white font-bold text-sm transition-colors duration-200">in</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-12 pt-8 border-t border-[#E0E0E0]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#28A745]/20 rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-[#28A745]" />
              </div>
              <div>
                <h5 className="font-semibold text-[#1C1C1E]">Free Shipping</h5>
                <p className="text-sm text-[#6C757D]">On orders over PKR 1000</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#007BFF]/20 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#007BFF]" />
              </div>
              <div>
                <h5 className="font-semibold text-[#1C1C1E]">Secure Payment</h5>
                <p className="text-sm text-[#6C757D]">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#FF6B00]" />
              </div>
              <div>
                <h5 className="font-semibold text-[#1C1C1E]">Easy Returns</h5>
                <p className="text-sm text-[#6C757D]">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#E0E0E0] text-center">
          <p className="text-[#6C757D]">
            &copy; 2024 ShopVille. All rights reserved. | 
            <a href="#" className="text-[#FF6B00] hover:text-[#FF8C42] ml-1 transition-colors duration-200">
              Terms of Service
            </a> | 
            <a href="#" className="text-[#FF6B00] hover:text-[#FF8C42] ml-1 transition-colors duration-200">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 