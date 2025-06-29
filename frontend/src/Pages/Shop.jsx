import ProductCard from "@/components/ProductCard";
import { searchProducts } from "@/store/features/products/productSlice";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Shop() {
  const products = useSelector((state) => state.products.products);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);
  const dispatch = useDispatch();

  // Search and pagination state
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);

  // Fetch all products on mount
  useEffect(() => {
    dispatch(searchProducts({ search: "", page: 1, limit: pageSize }));
  }, [dispatch]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    dispatch(searchProducts({ search, page: 1, limit: pageSize }));
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    dispatch(searchProducts({ search, page: newPage, limit: pageSize }));
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
        dispatch(searchProducts({ search: transcript, page: 1, limit: pageSize }));
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
      <div className="flex justify-center items-center h-full">
        <p>Loading Products</p>
      </div>
    );
  }
  if (error === "error") {
    return (
      <div className="flex justify-center items-center h-full">
        <p>Error while fetching Products...</p>
      </div>
    );
  }
  return (
    <div className="container py-5">
      <h1 className="text-3xl font-semi-bold text-center py-7">
        Latest <span className="text-orange-400">Mobiles</span>
      </h1>
      <form className="flex justify-center mb-6" onSubmit={handleSearchSubmit}>
        <div className="relative w-full max-w-md flex items-center bg-white border border-gray-200 rounded-full shadow-sm px-2 py-1 focus-within:ring-2 focus-within:ring-orange-400 transition-all">
          <button
            type="submit"
            className="flex items-center justify-center bg-orange-400 hover:bg-orange-500 text-white rounded-full w-10 h-10 shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-400 mr-2"
            aria-label="Search"
            style={{ minWidth: 40, minHeight: 40 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeLinecap="round" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
            className="flex-1 border-none bg-transparent px-2 py-2 focus:outline-none text-lg placeholder-gray-400"
            style={{ fontSize: '1.1rem' }}
          />
          <button
            type="button"
            onClick={handleVoiceSearch}
            className={`ml-2 flex items-center justify-center bg-gray-100 hover:bg-orange-100 rounded-full w-10 h-10 transition-colors duration-200 focus:outline-none ${isListening ? 'text-red-500' : 'text-gray-400 hover:text-orange-400'}`}
            tabIndex={-1}
            aria-label="Voice search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15c1.654 0 3-1.346 3-3V6c0-1.654-1.346-3-3-3s-3 1.346-3 3v6c0 1.654 1.346 3 3 3zm5-3c0 2.757-2.243 5-5 5s-5-2.243-5-5H5c0 3.519 2.613 6.432 6 6.92V22h2v-2.08c3.387-.488 6-3.401 6-6.92h-2z"/>
            </svg>
          </button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        {products &&
          Array.isArray(products.products) &&
          products.products.map((product) => {
            return (
              <div key={product._id}>
                <Link to={`/product/${product._id}`}>
                  <ProductCard product={product} />
                </Link>
              </div>
            );
          })}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx + 1)}
              className={`px-3 py-1 rounded ${
                page === idx + 1
                  ? "bg-orange-400 text-white"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {idx + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Shop;
