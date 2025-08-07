import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function ReviewSection({ productId }) {
  // Review form state
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: "",
    images: []
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modern design for review form
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setReviewData((prev) => ({ ...prev, images: files }));
  };

  // Submit review to backend
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("rating", reviewData.rating);
      formData.append("comment", reviewData.comment);
      formData.append("productId", productId);
      reviewData.images.forEach((img) => formData.append("images", img));
      // Use axios for review submission to ensure cookies and headers are sent
      try {
        const axios = (await import('axios')).default;
        const res = await axios.post(
          "http://localhost:8080/api/v1/reviews/review/new",
          formData,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        const data = res.data;
        if (data.success) {
          toast.success("Review submitted!");
          setShowReviewForm(false);
          setReviewData({ rating: 5, comment: "", images: [] });
          fetchReviews();
        } else {
          toast.error(data.message || "Failed to submit review.");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to submit review.");
      }
    } catch {
      toast.error("Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch reviews for this product
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const fetchReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`http://localhost:8080/api/v1/reviews/product/${productId}`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        setReviews([]);
      }
    } catch {
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };
  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [productId]);

  return (
    <div>
      <button
        className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-6 rounded-lg shadow mb-6"
        onClick={() => setShowReviewForm((v) => !v)}
      >
        {showReviewForm ? "Cancel" : "Write a Review"}
      </button>
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="bg-white rounded-xl shadow-lg p-8 max-w-lg mx-auto flex flex-col gap-6 border border-gray-200">
          <h3 className="text-2xl font-bold mb-2 text-gray-900">Write a Review</h3>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`w-10 h-10 rounded-full flex items-center justify-center border transition-colors ${reviewData.rating === r ? 'bg-yellow-400 border-yellow-500 text-white' : 'bg-gray-100 border-gray-300 text-gray-400'}`}
                  onClick={() => setReviewData({ ...reviewData, rating: r })}
                  aria-label={`Rate ${r}`}
                >
                  <span className="text-lg">★</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Comment</label>
            <textarea
              value={reviewData.comment}
              onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
              className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-yellow-400"
              required
              maxLength={1000}
              rows={4}
              placeholder="Share your experience..."
            />
          </div>
          <div>
            <label className="block mb-2 font-medium text-gray-700">Images (optional)</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="border rounded-lg px-3 py-2 w-full"
            />
            {reviewData.images.length > 0 && (
              <div className="flex gap-2 mt-2">
                {reviewData.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-3 rounded-lg shadow transition-all duration-200 disabled:opacity-60"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* Reviews List */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-6 text-gray-900">Customer Reviews</h3>
        {loadingReviews ? (
          <div className="text-center text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white rounded-xl shadow border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-lg text-gray-700">
                    {review.userId?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{review.userId?.name || "Anonymous"}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <div className="ml-auto text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="text-gray-800 mb-2">{review.comment}</div>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img.url} alt="review" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReviewSection;