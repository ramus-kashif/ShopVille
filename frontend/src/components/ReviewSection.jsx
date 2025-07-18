import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Star, ThumbsUp, MessageCircle, User, Calendar, Camera, X } from "lucide-react";

function ReviewSection({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalReviews, setTotalReviews] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  
  const user = useSelector((state) => state.auth.user);
  
  // Review form state
  const [reviewData, setReviewData] = useState({
    rating: 5,
    title: "",
    comment: "",
    images: []
  });

  useEffect(() => {
    fetchReviews();
  }, [productId, currentPage]);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/reviews/product/${productId}?page=${currentPage}&limit=5`
      );
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setTotalPages(data.totalPages);
        setTotalReviews(data.totalReviews);
        
        // Calculate average rating
        if (data.reviews.length > 0) {
          const avg = data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length;
          setAverageRating(Math.round(avg * 10) / 10);
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to write a review");
      return;
    }

    if (!reviewData.title.trim() || !reviewData.comment.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("rating", reviewData.rating);
      formData.append("title", reviewData.title);
      formData.append("comment", reviewData.comment);
      formData.append("productId", productId);

      // Add images if any
      reviewData.images.forEach((image, index) => {
        formData.append("images", image);
      });

      const response = await fetch("http://localhost:8080/api/v1/reviews/review/new", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Review submitted successfully!");
        setShowReviewForm(false);
        setReviewData({ rating: 5, title: "", comment: "", images: [] });
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + reviewData.images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setReviewData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setReviewData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleHelpful = async (reviewId) => {
    if (!user) {
      toast.error("Please login to mark reviews as helpful");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/reviews/review/${reviewId}/helpful`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchReviews(); // Refresh reviews to update helpful count
      }
    } catch (error) {
      console.error("Error marking helpful:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="mt-12">
      {/* Review Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Customer Reviews</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(averageRating) ? 'text-[#FF6B00] fill-current' : 'text-gray-400'}`}
                  />
                ))}
              </div>
              <span className="text-white font-semibold">{averageRating}</span>
            </div>
            <span className="text-gray-300">•</span>
            <span className="text-gray-300">{totalReviews} reviews</span>
          </div>
        </div>
        
        {user && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Write a Review</h3>
              <button
                onClick={() => setShowReviewForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-white font-semibold mb-3">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewData(prev => ({ ...prev, rating: star }))}
                      className="transition-all duration-200 hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= reviewData.rating
                            ? "text-[#FF6B00] fill-current"
                            : "text-gray-400"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white font-semibold mb-2">Review Title</label>
                <input
                  type="text"
                  value={reviewData.title}
                  onChange={(e) => setReviewData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold-400"
                  placeholder="Summarize your experience"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-white font-semibold mb-2">Review</label>
                <textarea
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-gold-400 resize-none"
                  rows={4}
                  placeholder="Share your detailed experience with this product..."
                  maxLength={1000}
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-white font-semibold mb-2">Add Photos (Optional)</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {reviewData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Review ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  
                  {reviewData.images.length < 5 && (
                    <label className="w-full h-24 border-2 border-dashed border-white/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-gold-400 transition-colors">
                      <div className="text-center">
                        <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                        <span className="text-sm text-gray-300">Add Photo</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        multiple
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 disabled:opacity-50 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                >
                  {submitting ? "Submitting..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-400 mx-auto"></div>
            <p className="text-gray-300 mt-2">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review._id} className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 mb-4">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-gold-500 to-yellow-500 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {review.userId?.name || "Anonymous"}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? "text-[#FF6B00] fill-current"
                                : "text-gray-400"
                            }`}
                          />
                        ))}
                      </div>
                      <span>•</span>
                      <span>{formatDate(review.createdAt)}</span>
                      {review.verified && (
                        <>
                          <span>•</span>
                          <span className="text-green-400">Verified Purchase</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Title */}
              <h5 className="text-lg font-semibold text-white mb-2">{review.title}</h5>

              {/* Review Content */}
              <p className="text-gray-300 leading-relaxed mb-4">{review.comment}</p>

              {/* Review Images */}
              {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {review.images.map((image, index) => (
                    <img
                      key={index}
                      src={image.url}
                      alt={`Review ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Admin Reply */}
              {review.adminReply && review.adminReply.text && (
                <div className="mt-4 ml-6 pl-4 border-l-4 border-blue-400 bg-blue-50/10 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-400">Admin Reply</span>
                    <span className="text-xs text-gray-400 ml-2">{formatDate(review.adminReply.date)}</span>
                  </div>
                  <div className="text-blue-200">{review.adminReply.text}</div>
                </div>
              )}

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => handleHelpful(review._id)}
                  className="flex items-center gap-2 text-gray-400 hover:text-gold-400 transition-colors"
                >
                  <ThumbsUp className="w-4 h-4" />
                  <span>Helpful ({review.helpful?.length || 0})</span>
                </button>
                
                <div className="flex items-center gap-2 text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span>Reply</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-r from-gold-500/20 to-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-12 h-12 text-gold-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-300 mb-6">Be the first to share your experience with this product!</p>
            {user && (
              <button
                onClick={() => setShowReviewForm(true)}
                className="bg-gradient-to-r from-gold-500 to-yellow-500 hover:from-gold-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Write the First Review
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === index + 1
                  ? "bg-gradient-to-r from-gold-500 to-yellow-500 text-white"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewSection; 