import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/store/features/products/productSlice";
import { getAllCategories, setSelectedCategory } from "@/store/features/categories/categoriesSlice";
import { updateCartPrices } from "@/store/features/cart/cartSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package, Filter, Search, Star, Shield, Truck, CreditCard, Sparkles } from "lucide-react";
import { toast } from "react-toastify";
import Chatbot from "@/components/Chatbot";
import Navbar from "@/components/Navbar";

function Shop() {
  const products = useSelector((state) => state.products.products);
  const categories = useSelector((state) => state.categories.categories);
  const selectedCategory = useSelector((state) => state.categories.selectedCategory);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const dispatch = useDispatch();

  // Search and pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showCategories, setShowCategories] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const pageSize = 8;
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef();
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const [imageSearchMessage, setImageSearchMessage] = useState("");
  const [imageSearchFallback, setImageSearchFallback] = useState(false);

  // Carousel state - will be fetched from backend
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselImages, setCarouselImages] = useState([
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80",
  ]);

  // Fetch all products and categories on mount
  useEffect(() => {
    dispatch(searchProducts({ search: "", page: 1, limit: pageSize }));
    dispatch(getAllCategories());
    fetchCarouselImages();
  }, [dispatch]);

  // Update cart prices when products are loaded
  useEffect(() => {
    if (products && products.products && Array.isArray(products.products)) {
      dispatch(updateCartPrices({ products: products.products }));
    }
  }, [products, dispatch]);

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Real-time search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search.trim()) {
        performSearch();
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const fetchCarouselImages = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/carousel/images");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.images.length > 0) {
          setCarouselImages(data.images.map(img => img.imageUrl));
        }
      }
    } catch (error) {
      console.error("Error fetching carousel images:", error);
    }
  };

  const performSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/products/search?search=${search}&page=1&limit=5`);
      const data = await response.json();
      if (data.success) {
        setSearchResults(data.products || []);
        setShowSearchResults(true);
      }
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    setShowSearchResults(false);
    dispatch(searchProducts({ search, page: 1, limit: pageSize, category: selectedCategory }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    dispatch(searchProducts({ search, page: newPage, limit: pageSize, category: selectedCategory }));
  };

  const handleCategorySelect = (categoryId) => {
    const newCategory = categoryId === selectedCategory ? "" : categoryId;
    dispatch(setSelectedCategory(newCategory));
    setPage(1);
    setShowSearchResults(false);
    dispatch(searchProducts({ 
      search, 
      page: 1, 
      limit: pageSize, 
      category: newCategory 
    }));
  };

  // Voice search logic
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearch(transcript);
        setPage(1);
        dispatch(searchProducts({ search: transcript, page: 1, limit: pageSize, category: selectedCategory }));
        setIsListening(false);
      };
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    setIsListening(true);
    recognitionRef.current.start();
  };

  const handleImageIconClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleImageSearch = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageSearchLoading(true);
    setShowSearchResults(false);
    setSearchResults([]);
    setSearch("");
    setImageSearchMessage("");
    setImageSearchFallback(false);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/api/v1/image-search", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setSearchResults(data.products || []);
        setShowSearchResults(true);
        setImageSearchMessage(data.message || "Image search complete.");
        setImageSearchFallback(data.fallbackUsed || false);
        toast.success(data.message || "Image search complete");
      } else {
        toast.error(data.message || "Image search failed");
      }
    } catch (err) {
      toast.error("Image search failed. Please try again.");
    } finally {
      setImageSearchLoading(false);
    }
  };

  // Pagination controls
  const total = products?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF6B00] mx-auto mb-4"></div>
          <p className="text-xl text-[#1C1C1E] font-semibold">Loading Products...</p>
        </div>
      </div>
    );
  }
  
  if (error === "error") {
    return (
      <div className="min-h-screen bg-white flex justify-center items-center">
        <div className="text-center">
          <p className="text-xl text-[#DC3545] font-semibold">Error while fetching Products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20 relative">
      {/* Overlay Navbar at the top of the carousel */}
      <Navbar />
      {/* Image Carousel */}
      <div className="relative mb-8 w-full">
        <div className="relative h-[300px] lg:h-[400px] w-full overflow-hidden shadow-lg">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
              }`}
            >
              <img
                src={image}
                alt={`Carousel slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
                style={{ minWidth: '100%', maxWidth: '100%' }}
              />

            </div>
          ))}
          {/* Modern Carousel Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-4 h-4 rounded-full border-2 border-white transition-all duration-300 ${
                  index === currentSlide ? 'bg-[#FF6B00] border-[#FF6B00] scale-110 shadow-lg' : 'bg-white/40 border-white/60'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Main Content with top padding to prevent overlap */}
      <div className="pt-8">
        {/* Search Bar */}
        <div className="flex justify-center mb-8">
          <form className="relative w-full max-w-3xl" onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center bg-white border-2 border-[#E0E0E0] rounded-2xl shadow-sm px-4 py-3 focus-within:border-[#FF6B00] transition-all duration-300">
              <button
                type="submit"
                className="flex items-center justify-center bg-[#FF6B00] hover:bg-[#FF8C42] text-white rounded-xl w-10 h-10 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 mr-3"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={search}
                onChange={handleSearch}
                className="flex-1 border-none bg-transparent px-3 py-2 focus:outline-none text-base placeholder-[#6C757D] text-[#1C1C1E]"
              />
              
              {/* AI Image Search Icon */}
              <button
                type="button"
                onClick={handleImageIconClick}
                className="ml-3 flex items-center justify-center bg-[#F8F9FA] hover:bg-[#EDEDED] rounded-xl w-10 h-10 transition-all duration-200 focus:outline-none border border-[#E0E0E0] hover:border-[#FF6B00] text-[#6C757D] hover:text-[#FF6B00]"
                tabIndex={-1}
                aria-label="AI Image Search"
                title="Search by Image (AI)"
              >
                <Sparkles className="w-5 h-5" />
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageSearch}
              />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`ml-3 flex items-center justify-center bg-[#F8F9FA] hover:bg-[#EDEDED] rounded-xl w-10 h-10 transition-all duration-200 focus:outline-none border border-[#E0E0E0] hover:border-[#FF6B00] ${isListening ? 'text-[#DC3545] animate-pulse' : 'text-[#6C757D] hover:text-[#FF6B00]'}`}
                tabIndex={-1}
                aria-label="Voice search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15c1.654 0 3-1.346 3-3V6c0-1.654-1.346-3-3-3s-3 1.346-3 3v6c0 1.654 1.346 3 3 3zm5-3c0 2.757-2.243 5-5 5s-5-2.243-5-5H5c0 3.519 2.613 6.432 6 6.92V22h2v-2.08c3.387-.488 6-3.401 6-6.92h-2z"/>
                </svg>
              </button>
            </div>
            
            {/* Real-time Search Results */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#E0E0E0] rounded-xl shadow-lg z-50 mt-4 max-h-96 overflow-y-auto">
                {searchResults.map((product) => (
                  <Link
                    key={product._id}
                    to={`/product/${product._id}`}
                    className="flex items-center p-4 hover:bg-[#F8F9FA] transition-colors duration-200 border-b border-[#E0E0E0] last:border-b-0"
                    onClick={() => setShowSearchResults(false)}
                  >
                    <img
                      src={product.picture?.secure_url || "/placeholder.png"}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-lg mr-4 shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#1C1C1E]">{product.title}</h3>
                      <p className="text-sm text-[#6C757D]">{product.category?.name}</p>
                    </div>
                    <div className="text-[#FF6B00] font-bold text-lg">
                      PKR {product.price}
                    </div>
                  </Link>
                ))}
              </div>
            )}
            {/* AI Image Search Loading */}
            {imageSearchLoading && (
              <div className="absolute top-full left-0 right-0 bg-white border border-[#E0E0E0] rounded-xl shadow-lg z-50 mt-4 p-6 text-center text-[#FF6B00] font-semibold">
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6B00]"></div>
                  Searching by image...
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Products Section - moved up for better accessibility */}
        <div className="w-full mb-8">

          {/* Hide the rest of the product grid/info when image search is active */}
          {!imageSearchMessage && (
            <>
          {/* Results Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-[#6C757D]">
              Showing {products?.products?.length || 0} of {total} products
              {selectedCategory && (
                <span className="ml-3 text-[#FF6B00] font-semibold">
                  • Filtered by category
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          {(showSearchResults || imageSearchMessage) ? null : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products &&
              Array.isArray(products.products) &&
              products.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
          )}

          {/* No Products Message */}
          {(!products?.products || products.products.length === 0) && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-16 h-16 text-[#6C757D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1C1E] mb-3">
                No Products Found
              </h3>
              <p className="text-[#6C757D] mb-6">
                Try adjusting your search or category filter
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  dispatch(setSelectedCategory(""));
                  dispatch(searchProducts({ search: "", page: 1, limit: pageSize }));
                }}
                className="bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16 gap-3">
              <button
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-6 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#EDEDED] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[#1C1C1E] border border-[#E0E0E0] hover:border-[#FF6B00]"
              >
                Previous
              </button>
                  <span className="px-4 py-3 text-[#6C757D] font-semibold">
                    Page {page} of {totalPages}
                  </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#EDEDED] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[#1C1C1E] border border-[#E0E0E0] hover:border-[#FF6B00]"
              >
                Next
              </button>
            </div>
          )}
            </>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#1C1C1E] mb-2">Premium Quality</h3>
            <p className="text-xs text-[#6C757D]">Curated selection of high-end products</p>
          </div>
          <div className="text-center p-6 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#1C1C1E] mb-2">Fast Delivery</h3>
            <p className="text-xs text-[#6C757D]">Express shipping to your doorstep</p>
          </div>
          <div className="text-center p-6 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-10 h-10 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-sm font-bold text-[#1C1C1E] mb-2">Secure Payment</h3>
            <p className="text-xs text-[#6C757D]">Multiple secure payment options</p>
          </div>
        </div>
      </div>

      {/* Vill-E Chatbot Floating Button and Panel */}
      <Chatbot />
    </div>
  );
}

export default Shop;
