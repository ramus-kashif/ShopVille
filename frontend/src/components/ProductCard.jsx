import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, addToCartWithBackendSync } from "@/store/features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from '@/store/features/wishlist/wishlistSlice';
import { toast } from "react-toastify";
import { ShoppingCart, Star, Heart, Eye } from "lucide-react";
import formatNumber from "format-number";

function ProductCard({ product }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const { _id, title, price, picture, category, discount, averageRating, numOfReviews, stock } = product;
  const wishlist = useSelector((state) => state.wishlist.wishlist) || [];
  const isInWishlist = wishlist.some(item => item._id === _id);
  const pictureUrl = picture?.secure_url || "";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (user?.user?._id) {
      dispatch(addToCartWithBackendSync({ 
        item: {
          productId: _id,
          title,
          price,
          pictureUrl,
          quantity: 1,
        },
        userId: user.user._id 
      }));
    } else {
      dispatch(
        addToCart({
          item: {
            productId: _id,
            title,
            price,
            pictureUrl,
            quantity: 1,
          },
          userId: null,
        })
      );
    }
    toast.success("Product added to cart successfully!", { autoClose: 2000 });
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToWishlist(_id));
    toast.success("Product added to wishlist!", { autoClose: 2000 });
  };
  const handleRemoveFromWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeFromWishlist(_id));
    toast.info("Product removed from wishlist!", { autoClose: 2000 });
  };

  const discountedPrice = discount > 0 ? price - Math.round((price * discount) / 100) : price;

  return (
    <Link to={`/product/${_id}`} className="group">
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#E0E0E0] hover:border-[#FF6B00]/30 transform hover:-translate-y-1 h-full flex flex-col">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-[#F8F9FA] rounded-t-lg">
          <img
            src={pictureUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => { e.target.onerror = null; e.target.src = '/placeholder.png'; }}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3">
              <div className="bg-[#DC3545] text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg">
                {Math.round(discount)}% OFF
              </div>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <button className="w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-[#E0E0E0]">
              <Heart className="w-4 h-4 text-[#FF6B00] hover:text-[#DC3545] transition-colors" />
            </button>
            <button className="w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 border border-[#E0E0E0]">
              <Eye className="w-4 h-4 text-[#FF6B00] hover:text-[#FF6B00] transition-colors" />
            </button>
          </div>
          
          {/* Add to Cart or Wishlist Button */}
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            {stock === 0 ? (
              isInWishlist ? (
                <button
                  onClick={handleRemoveFromWishlist}
                  className="w-full bg-[#DC3545] hover:bg-[#A71D2A] text-white py-2 px-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-1 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Remove
                </button>
              ) : (
                <button
                  onClick={handleAddToWishlist}
                  className="w-full bg-[#6C757D] hover:bg-[#343A40] text-white py-2 px-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-1 text-sm"
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
              )
            ) : (
              <button
                onClick={handleAddToCart}
                className="w-full bg-[#FF6B00] hover:bg-[#FF8C42] text-white py-2 px-3 rounded-lg font-semibold transition-all duration-200 shadow-lg flex items-center justify-center gap-1 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={stock === 0}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 flex flex-col flex-grow">
          {/* Category */}
          <div className="mb-1">
            <span className="text-xs text-[#6C757D] capitalize">
              {category?.name || "General"}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-bold text-[#1C1C1E] mb-2 line-clamp-2 group-hover:text-[#FF6B00] transition-colors duration-200 flex-grow">
            {title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(averageRating || 0) ? 'text-[#FF6B00] fill-current' : 'text-[#E0E0E0]'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-[#6C757D]">
              ({numOfReviews || 0})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2">
              {discount > 0 ? (
                <>
                  <span className="text-lg font-bold text-[#FF6B00]">
                    {formatNumber({ prefix: "PKR " })(discountedPrice)}
                  </span>
                  <span className="text-sm text-[#6C757D] line-through">
                    {formatNumber({ prefix: "PKR " })(price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-[#FF6B00]">
                  {formatNumber({ prefix: "PKR " })(price)}
                </span>
              )}
            </div>
            
            {/* Savings Badge */}
            {discount > 0 && (
              <div className="bg-[#28A745]/10 text-[#28A745] px-2 py-1 rounded-full text-xs font-semibold border border-[#28A745]/20 whitespace-nowrap">
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
