import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSingleProduct } from "@/store/features/products/productSlice";
import formatNumber from "format-number";
import { addToCart, addToCartWithBackendSync } from "@/store/features/cart/cartSlice";
import { toast } from "react-toastify";
import { ShoppingCart, Star, Truck, Shield, ArrowLeft, Package, Heart, CheckCircle, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";
import ReviewSection from "@/components/ReviewSection";

function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [productDetails, setProductDetails] = useState({
    title: "",
    category: "",
    picture: "",
    description: "",
    price: "",
  });
  const dispatch = useDispatch();
  const { productId } = useParams();
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const user = useSelector((state) => state.auth.user);

  const handleDecrement = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleAddToCart = () => {
    if (user?.user?._id) {
      dispatch(addToCartWithBackendSync({
        item: {
          productId,
          title,
          price,
          pictureUrl,
          quantity,
        },
        userId: user.user._id,
      }));
    } else {
      dispatch(
        addToCart({
          item: {
            productId,
            title,
            price,
            pictureUrl,
            quantity,
          },
          userId: null,
        })
      );
    }
    toast.success("Product added to cart successfully!", {
      position: "bottom-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  useEffect(() => {
    dispatch(getSingleProduct(productId));
  }, [productId, dispatch]);

  useEffect(() => {
    if (products && products.product) {
      setProductDetails(products.product);
    }
  }, [products]);
  
  const { title, price, picture, description, category, discount, stock } = productDetails;
  const pictureUrl = picture?.secure_url || "";
  const categoryName = category?.name || "";

  // Sample product description
  const sampleDescription = `Experience the perfect blend of style and functionality with our premium ${title}. Crafted with meticulous attention to detail, this exceptional product combines cutting-edge technology with timeless design to deliver an unparalleled user experience.

Key Features:
• Premium Quality Materials: Built with the finest materials for lasting durability
• Advanced Technology: Incorporates the latest innovations for optimal performance
• Ergonomic Design: Thoughtfully designed for maximum comfort and ease of use
• Versatile Functionality: Adapts to various needs and environments seamlessly
• Eco-Friendly: Manufactured with sustainable practices and recyclable materials

Perfect for both personal and professional use, this product offers exceptional value while maintaining the highest standards of quality. Whether you're looking for reliability, style, or innovation, this product exceeds expectations in every category.

Technical Specifications:
• Dimensions: Optimized for perfect fit and portability
• Weight: Lightweight design for enhanced mobility
• Compatibility: Works seamlessly with most systems and devices
• Warranty: Comprehensive coverage for peace of mind

Don't miss out on this opportunity to own a product that truly makes a difference. Order now and experience the quality that sets us apart from the competition.`;

  // Sample reviews data
  const sampleReviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      title: "Absolutely Amazing Product!",
      comment: "This product exceeded all my expectations. The quality is outstanding and it works perfectly. Highly recommend!",
      date: "2024-01-15",
      helpful: 12
    },
    {
      id: 2,
      user: "Michael Chen",
      rating: 5,
      title: "Best Purchase This Year",
      comment: "I've been using this for 3 months now and it's still as good as new. The design is beautiful and functionality is top-notch.",
      date: "2024-01-10",
      helpful: 8
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      rating: 4,
      title: "Great Value for Money",
      comment: "Really happy with this purchase. The quality is excellent and it arrived quickly. Would definitely buy again!",
      date: "2024-01-08",
      helpful: 5
    },
    {
      id: 4,
      user: "David Thompson",
      rating: 5,
      title: "Exceeds Expectations",
      comment: "This product is simply fantastic. The attention to detail is remarkable and it performs flawlessly. Worth every penny!",
      date: "2024-01-05",
      helpful: 15
    }
  ];

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
          <p className="text-xl text-[#1C1C1E] font-semibold">Loading Product Details...</p>
        </div>
      </div>
    );
  }
  
  if (error === "error") {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-12 h-12 text-[#6C757D]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1C1C1E] mb-2">Product Not Found</h2>
          <p className="text-[#6C757D] mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-2 text-[#FF6B00] hover:text-[#FF8C42] transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-[#E0E0E0]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Product Image */}
              <div className="relative bg-[#F8F9FA] p-8 lg:p-12">
                <div className="relative group">
                  <img
                    src={pictureUrl}
                    alt={title}
                    className="w-full h-96 lg:h-[500px] object-contain rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4">
                    <button className="w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-[#E0E0E0]">
                      <Heart className="w-5 h-5 text-[#6C757D] hover:text-[#DC3545]" />
                    </button>
                  </div>
                  
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-[#DC3545] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        {Math.round(discount)}% OFF
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="space-y-6">
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6C757D]">Category:</span>
                    <span className="px-3 py-1 bg-[#FF6B00]/10 text-[#FF6B00] rounded-full text-sm font-medium capitalize border border-[#FF6B00]/20">
                      {categoryName || "General"}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl lg:text-5xl font-bold text-[#1C1C1E] leading-tight">
                    {title}
                  </h1>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-[#FF6B00] fill-current" />
                      ))}
                    </div>
                    <span className="text-[#6C757D]">(4.8 • 127 reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    {discount > 0 ? (
                      <div className="flex items-center gap-4">
                        <span className="text-4xl font-bold text-[#FF6B00]">
                          {formatNumber({ prefix: "PKR " })(price - Math.round((price * discount) / 100))}
                        </span>
                        <span className="text-2xl text-[#6C757D] line-through">
                          {formatNumber({ prefix: "PKR " })(price)}
                        </span>
                        <span className="px-3 py-1 bg-[#28A745]/10 text-[#28A745] rounded-full text-sm font-bold border border-[#28A745]/20">
                          Save {formatNumber({ prefix: "PKR " })(Math.round((price * discount) / 100))}
                        </span>
                      </div>
                    ) : (
                      <span className="text-4xl font-bold text-[#FF6B00]">
                        {formatNumber({ prefix: "PKR " })(price)}
                      </span>
                    )}
                  </div>

                  {/* Stock Display */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#6C757D]">Stock:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${stock > 0 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {stock > 0 ? `${stock} available` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="space-y-3">
                    <label className="text-lg font-semibold text-[#1C1C1E]">Quantity</label>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border-2 border-[#E0E0E0] rounded-xl overflow-hidden bg-[#F8F9FA]">
                        <button
                          onClick={handleDecrement}
                          className="w-12 h-12 bg-white hover:bg-[#EDEDED] text-[#1C1C1E] hover:text-[#FF6B00] flex items-center justify-center transition-colors duration-200 border-r border-[#E0E0E0]"
                        >
                          <span className="text-xl font-bold">−</span>
                        </button>
                        <span className="w-16 text-center text-xl font-semibold text-[#1C1C1E]">
                          {quantity}
                        </span>
                        <button
                          onClick={handleIncrement}
                          className="w-12 h-12 bg-white hover:bg-[#EDEDED] text-[#1C1C1E] hover:text-[#FF6B00] flex items-center justify-center transition-colors duration-200 border-l border-[#E0E0E0]"
                        >
                          <span className="text-xl font-bold">+</span>
                        </button>
                      </div>
                      <span className="text-sm text-[#6C757D]">
                        {quantity} {quantity === 1 ? 'item' : 'items'} selected
                      </span>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-[#FF6B00] hover:bg-[#FF8C42] text-white py-4 px-8 rounded-xl text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                    disabled={stock === 0}
                  >
                    <ShoppingCart className="w-6 h-6" />
                    {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                  </button>

                  {/* Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#E0E0E0]">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#28A745]/20 rounded-full flex items-center justify-center">
                        <Truck className="w-5 h-5 text-[#28A745]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1C1C1E]">Free Shipping</h4>
                        <p className="text-sm text-[#6C757D]">On orders over PKR 1000</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#007BFF]/20 rounded-full flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#007BFF]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#1C1C1E]">Secure Payment</h4>
                        <p className="text-sm text-[#6C757D]">100% secure checkout</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="bg-white rounded-3xl shadow-sm p-8 lg:p-12 border border-[#E0E0E0]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Description */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold text-[#1C1C1E] mb-6 flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#FF6B00]" />
                  Product Description
                </h2>
                <div className="prose prose-lg max-w-none">
                  <p className="text-[#6C757D] leading-relaxed mb-6">
                    {description || sampleDescription}
                  </p>
                  
                  {/* Key Benefits */}
                  <div className="bg-[#F8F9FA] rounded-2xl p-6 mb-6">
                    <h3 className="text-xl font-semibold text-[#1C1C1E] mb-4">Key Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#28A745]" />
                        <span className="text-[#1C1C1E]">Premium Quality Materials</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#28A745]" />
                        <span className="text-[#1C1C1E]">Advanced Technology</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#28A745]" />
                        <span className="text-[#1C1C1E]">Ergonomic Design</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-[#28A745]" />
                        <span className="text-[#1C1C1E]">Eco-Friendly</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Product Highlights */}
              <div className="lg:col-span-1">
                <div className="bg-[#F8F9FA] rounded-2xl p-6 sticky top-8">
                  <h3 className="text-xl font-semibold text-[#1C1C1E] mb-4">Product Highlights</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#FF6B00]/20 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-[#FF6B00]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1C1C1E]">Premium Quality</p>
                        <p className="text-sm text-[#6C757D]">Highest grade materials</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#28A745]/20 rounded-full flex items-center justify-center">
                        <Shield className="w-4 h-4 text-[#28A745]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1C1C1E]">1 Year Warranty</p>
                        <p className="text-sm text-[#6C757D]">Full coverage included</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#007BFF]/20 rounded-full flex items-center justify-center">
                        <Truck className="w-4 h-4 text-[#007BFF]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1C1C1E]">Fast Delivery</p>
                        <p className="text-sm text-[#6C757D]">2-3 business days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#6C757D]/20 rounded-full flex items-center justify-center">
                        <Clock className="w-4 h-4 text-[#6C757D]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#1C1C1E]">Easy Returns</p>
                        <p className="text-sm text-[#6C757D]">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sample Reviews Section */}
        <div className="max-w-7xl mx-auto mt-12">
          <div className="bg-white rounded-3xl shadow-sm p-8 lg:p-12 border border-[#E0E0E0]">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-[#1C1C1E] flex items-center gap-3">
                <Star className="w-8 h-8 text-[#FF6B00]" />
                Customer Reviews
              </h2>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#FF6B00] fill-current" />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-[#1C1C1E]">4.8</span>
                </div>
                <p className="text-[#6C757D]">Based on 127 reviews</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sampleReviews.map((review, index) => (
                <div 
                  key={review.id}
                  className="bg-[#F8F9FA] rounded-2xl p-6 border border-[#E0E0E0] hover:border-[#FF6B00]/30 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-[#1C1C1E]">{review.title}</h4>
                      <p className="text-sm text-[#6C757D]">by {review.user}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < review.rating ? 'text-[#FF6B00] fill-current' : 'text-[#E0E0E0]'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-[#6C757D] mb-4 leading-relaxed">{review.comment}</p>
                  <div className="flex items-center justify-between text-sm text-[#6C757D]">
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-[#28A745]" />
                      {review.helpful} found this helpful
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105">
                View All Reviews
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <ReviewSection productId={productId} />
      </div>
    </div>
  );
}

export default ProductDetails;
