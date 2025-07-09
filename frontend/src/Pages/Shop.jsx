import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/store/features/products/productSlice";
import { getAllCategories, setSelectedCategory } from "@/store/features/categories/categoriesSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package, Filter, Search, Camera, Star, Shield, Truck, CreditCard } from "lucide-react";
import { toast } from "react-toastify";

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
  const [isImageSearch, setIsImageSearch] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageSearchLoading, setImageSearchLoading] = useState(false);
  const pageSize = 8;
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedImage(file);
      performEnhancedImageSearch(file);
    }
  };

  const performEnhancedImageSearch = async (file) => {
    setImageSearchLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('http://localhost:8080/api/v1/search', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        dispatch(searchProducts({ 
          search: "", 
          page: 1, 
          limit: pageSize, 
          category: selectedCategory,
          imageSearchResults: data.products 
        }));
        setIsImageSearch(true);
        toast.success(`Found ${data.products.length} similar products!`);
      } else {
        toast.error("Image search failed. Please try again.");
      }
    } catch (error) {
      console.error("Enhanced image search error:", error);
      toast.error("Image search error. Please try again.");
    } finally {
      setImageSearchLoading(false);
    }
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
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-[#1C1C1E] mb-4">
            Discover Amazing <span className="text-[#FF6B00]">Products</span>
          </h1>
          <p className="text-xl text-[#6C757D] max-w-3xl mx-auto leading-relaxed">
            Find the perfect products for your lifestyle - from electronics to fashion and everything in between
          </p>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center mb-12">
          <form className="relative w-full max-w-3xl" onSubmit={handleSearchSubmit}>
            <div className="relative flex items-center bg-white border-2 border-[#E0E0E0] rounded-xl shadow-sm px-6 py-4 focus-within:border-[#FF6B00] transition-all duration-300">
              <button
                type="submit"
                className="flex items-center justify-center bg-[#FF6B00] hover:bg-[#FF8C42] text-white rounded-lg w-14 h-14 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#FF6B00]/20 mr-4"
                aria-label="Search"
              >
                <Search className="w-6 h-6" />
              </button>
              <input
                type="text"
                placeholder="Search for amazing products..."
                value={search}
                onChange={handleSearch}
                className="flex-1 border-none bg-transparent px-4 py-3 focus:outline-none text-lg placeholder-[#6C757D] text-[#1C1C1E]"
                style={{ fontSize: '1.1rem' }}
              />
              
              {/* Enhanced Image Search Button */}
              <label className="ml-4 flex items-center justify-center bg-[#F8F9FA] hover:bg-[#EDEDED] rounded-lg w-14 h-14 transition-all duration-200 focus:outline-none cursor-pointer border border-[#E0E0E0] hover:border-[#FF6B00]">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {imageSearchLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#FF6B00]"></div>
                ) : (
                  <Camera className="w-6 h-6 text-[#6C757D] hover:text-[#FF6B00]" />
                )}
              </label>
              
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`ml-4 flex items-center justify-center bg-[#F8F9FA] hover:bg-[#EDEDED] rounded-lg w-14 h-14 transition-all duration-200 focus:outline-none border border-[#E0E0E0] hover:border-[#FF6B00] ${isListening ? 'text-[#DC3545] animate-pulse' : 'text-[#6C757D] hover:text-[#FF6B00]'}`}
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
          </form>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-16 max-w-7xl mx-auto">
          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden shadow-lg">
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
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute bottom-16 left-16 right-16 text-white">
                  <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Discover Amazing Products
                  </h2>
                  <p className="text-2xl lg:text-3xl opacity-90 max-w-3xl mb-8">
                    Find the perfect items for your lifestyle with our curated collection
                  </p>
                  <div className="flex gap-4">
                    <Link 
                      to="/shop" 
                      className="inline-flex items-center gap-3 bg-[#FF6B00] hover:bg-[#FF8C42] text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Shop Now
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                    <Link 
                      to="/shop" 
                      className="inline-flex items-center gap-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border border-white/30 hover:border-white/50"
                    >
                      View Categories
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Modern Carousel Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === currentSlide 
                      ? 'bg-[#FF6B00] scale-125 shadow-lg' 
                      : 'bg-white/50 hover:bg-white/75 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Image Search Results Indicator */}
        {isImageSearch && (
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-[#FF6B00]/10 text-[#FF6B00] px-6 py-3 rounded-full border border-[#FF6B00]/20">
              <Camera className="w-5 h-5" />
              <span className="font-semibold">Showing image search results</span>
              <button
                onClick={() => {
                  setIsImageSearch(false);
                  dispatch(searchProducts({ search: "", page: 1, limit: pageSize, category: selectedCategory }));
                }}
                className="ml-3 text-[#FF6B00] hover:text-[#FF8C42] transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Premium Quality</h3>
            <p className="text-[#6C757D]">Curated selection of high-end products</p>
          </div>
          <div className="text-center p-8 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Fast Delivery</h3>
            <p className="text-[#6C757D]">Express shipping to your doorstep</p>
          </div>
          <div className="text-center p-8 bg-[#F8F9FA] rounded-2xl border border-[#E0E0E0]">
            <div className="w-16 h-16 bg-[#FF6B00] rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1E] mb-2">Secure Payment</h3>
            <p className="text-[#6C757D]">Multiple secure payment options</p>
          </div>
        </div>

        {/* Products Section */}
        <div className="w-full">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-[#6C757D]">
              Showing {isImageSearch 
                ? (products?.imageSearchResults?.length || 0) 
                : (products?.products?.length || 0)
              } of {isImageSearch 
                ? (products?.imageSearchResults?.length || 0) 
                : total
              } products
              {selectedCategory && !isImageSearch && (
                <span className="ml-3 text-[#FF6B00] font-semibold">
                  • Filtered by category
                </span>
              )}
              {isImageSearch && (
                <span className="ml-3 text-[#FF6B00] font-semibold">
                  • Image search results
                </span>
              )}
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(isImageSearch && products?.imageSearchResults) ? (
              // Show image search results
              Array.isArray(products.imageSearchResults) &&
              products.imageSearchResults.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              // Show regular products
              products &&
              Array.isArray(products.products) &&
              products.products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>

          {/* No Products Message */}
          {((!isImageSearch && (!products?.products || products.products.length === 0)) || 
            (isImageSearch && (!products?.imageSearchResults || products.imageSearchResults.length === 0))) && (
            <div className="text-center py-16">
              <div className="w-32 h-32 bg-[#F8F9FA] rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-16 h-16 text-[#6C757D]" />
              </div>
              <h3 className="text-2xl font-bold text-[#1C1C1E] mb-3">
                {isImageSearch ? "No Similar Products Found" : "No Products Found"}
              </h3>
              <p className="text-[#6C757D] mb-6">
                {isImageSearch 
                  ? "Try uploading a different image or search with keywords" 
                  : "Try adjusting your search or category filter"
                }
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setIsImageSearch(false);
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
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`px-6 py-3 rounded-xl transition-all duration-200 ${
                    page === idx + 1
                      ? "bg-[#FF6B00] text-white shadow-lg"
                      : "bg-[#F8F9FA] hover:bg-[#EDEDED] text-[#1C1C1E] border border-[#E0E0E0] hover:border-[#FF6B00]"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-6 py-3 rounded-xl bg-[#F8F9FA] hover:bg-[#EDEDED] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-[#1C1C1E] border border-[#E0E0E0] hover:border-[#FF6B00]"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;
