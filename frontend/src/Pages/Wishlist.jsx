import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '@/store/features/wishlist/wishlistSlice';
import ProductCard from '@/components/ProductCard';

function Wishlist() {
  const dispatch = useDispatch();
  const { wishlist, status } = useSelector(state => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-4xl font-bold text-[#1C1C1E] mb-8">My Wishlist</h1>
        {status === 'loading' ? (
          <div className="text-center py-16">Loading...</div>
        ) : safeWishlist.length === 0 ? (
          <div className="text-center py-16 text-gray-500 text-lg">Your wishlist is empty.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {safeWishlist.map(product => (
              <ProductCard key={product?._id || Math.random()} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist; 