import { Link } from "react-router-dom";
import { ArrowRight, Star, Shield, Truck, CreditCard, Package, Users, Award } from "lucide-react";

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#FF6B00]/5 via-white to-[#FF6B00]/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl lg:text-7xl font-bold text-[#1C1C1E] mb-6 leading-tight">
              Welcome to <span className="text-[#FF6B00]">ShopVille</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#6C757D] mb-8 leading-relaxed">
              Your one-stop destination for quality products. Discover amazing deals, 
              fast delivery, and exceptional customer service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/shop" 
                className="inline-flex items-center gap-3 bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center gap-3 bg-[#F8F9FA] hover:bg-[#EDEDED] text-[#1C1C1E] px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border border-[#E0E0E0] hover:border-[#FF6B00]"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1C1C1E] mb-4">Why Choose ShopVille?</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              We provide the best shopping experience with quality products and excellent service
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-[#E0E0E0] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#FF6B00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1E] mb-3">Quality Products</h3>
              <p className="text-[#6C757D]">Curated selection of high-quality products from trusted brands</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-[#E0E0E0] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#28A745]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-[#28A745]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1E] mb-3">Fast Delivery</h3>
              <p className="text-[#6C757D]">Quick and reliable shipping to your doorstep</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-[#E0E0E0] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#007BFF]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-[#007BFF]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1E] mb-3">Secure Payment</h3>
              <p className="text-[#6C757D]">Multiple secure payment options for your convenience</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-[#E0E0E0] hover:shadow-lg transition-all duration-300">
              <div className="w-16 h-16 bg-[#FF6B00]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CreditCard className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <h3 className="text-xl font-bold text-[#1C1C1E] mb-3">Easy Returns</h3>
              <p className="text-[#6C757D]">Hassle-free returns and exchanges within 30 days</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">10K+</div>
              <div className="text-[#6C757D]">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">500+</div>
              <div className="text-[#6C757D]">Products Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">24/7</div>
              <div className="text-[#6C757D]">Customer Support</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#FF6B00] mb-2">4.8</div>
              <div className="text-[#6C757D]">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-20 bg-[#F8F9FA]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1C1C1E] mb-4">Shop by Category</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-[#FF6B00]/10 to-[#FF8C42]/10 flex items-center justify-center">
                <Package className="w-16 h-16 text-[#FF6B00]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Electronics</h3>
                <p className="text-[#6C757D] mb-4">Latest gadgets and electronic devices</p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8C42] font-semibold transition-colors duration-200"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-[#28A745]/10 to-[#20C997]/10 flex items-center justify-center">
                <Package className="w-16 h-16 text-[#28A745]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Fashion</h3>
                <p className="text-[#6C757D] mb-4">Trendy clothing and accessories</p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8C42] font-semibold transition-colors duration-200"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-sm border border-[#E0E0E0] overflow-hidden hover:shadow-lg transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-[#007BFF]/10 to-[#6610F2]/10 flex items-center justify-center">
                <Package className="w-16 h-16 text-[#007BFF]" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Home & Living</h3>
                <p className="text-[#6C757D] mb-4">Furniture and home decor items</p>
                <Link 
                  to="/shop" 
                  className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8C42] font-semibold transition-colors duration-200"
                >
                  Shop Now
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1C1C1E] mb-4">What Our Customers Say</h2>
            <p className="text-xl text-[#6C757D] max-w-3xl mx-auto">
              Don't just take our word for it - hear from our satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E0E0E0]">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FF6B00] fill-current" />
                ))}
              </div>
              <p className="text-[#6C757D] mb-4">
                "Amazing shopping experience! Fast delivery and quality products. Will definitely shop again."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1E]">Sarah Johnson</div>
                  <div className="text-sm text-[#6C757D]">Regular Customer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E0E0E0]">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FF6B00] fill-current" />
                ))}
              </div>
              <p className="text-[#6C757D] mb-4">
                "Great customer service and secure payment options. Highly recommended!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1E]">Mike Chen</div>
                  <div className="text-sm text-[#6C757D]">Verified Buyer</div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E0E0E0]">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-[#FF6B00] fill-current" />
                ))}
              </div>
              <p className="text-[#6C757D] mb-4">
                "Best prices and quality products. The return process was so easy!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-[#1C1C1E]">Emily Davis</div>
                  <div className="text-sm text-[#6C757D]">Loyal Customer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#FF6B00] to-[#FF8C42]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and discover amazing products at great prices
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-3 bg-white text-[#FF6B00] hover:bg-[#F8F9FA] px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Explore Products
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;