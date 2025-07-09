import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/features/cart/cartSlice";
import { toast } from "react-toastify";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import formatNumber from "format-number";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { _id, title, price, picture, category, discount, averageRating, numOfReviews } = product;
  const pictureUrl = picture?.secure_url || "";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: _id,
        title,
        price,
        pictureUrl,
        quantity: 1,
      })
    );
    toast.success("Product added to cart successfully!", { autoClose: 1500 });
  };

  const discountedPrice = discount > 0 ? price - Math.round((price * discount) / 100) : price;

  return (
    <Link to={`/product/${_id}`} className="group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#E0E0E0] hover:border-[#FF6B00]/30 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F8F9FA]">
          <img
            src={pictureUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-4 left-4">
              <div className="bg-[#DC3545] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                {Math.round(discount)}% OFF
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-[#E0E0E0]">
              <Heart className="w-5 h-5 text-[#6C757D] hover:text-[#DC3545]" />
            </button>
            <button className="w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-[#E0E0E0]">
              <Eye className="w-5 h-5 text-[#6C757D] hover:text-[#FF6B00]" />
            </button>
          </div>
          
          {/* Add to Cart Button */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="w-full bg-[#FF6B00] hover:bg-[#FF8C42] text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category */}
          <div className="mb-2">
            <span className="text-sm text-[#6C757D] capitalize">
              {category?.name || "General"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-[#1C1C1E] mb-3 line-clamp-2 group-hover:text-[#FF6B00] transition-colors duration-200 flex-grow">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(averageRating || 0) ? 'text-[#FF6B00] fill-current' : 'text-[#E0E0E0]'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-[#6C757D]">
              ({numOfReviews || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-3">
              {discount > 0 ? (
                <>
                  <span className="text-2xl font-bold text-[#FF6B00]">
                    {formatNumber({ prefix: "PKR " })(discountedPrice)}
                  </span>
                  <span className="text-lg text-[#6C757D] line-through">
                    {formatNumber({ prefix: "PKR " })(price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#FF6B00]">
                  {formatNumber({ prefix: "PKR " })(price)}
                </span>
              )}
            </div>
            
            {/* Savings Badge */}
            {discount > 0 && (
              <div className="bg-[#28A745]/10 text-[#28A745] px-3 py-1 rounded-full text-sm font-semibold border border-[#28A745]/20 whitespace-nowrap">
                Save {formatNumber({ prefix: "PKR " })(Math.round((price * discount) / 100))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
