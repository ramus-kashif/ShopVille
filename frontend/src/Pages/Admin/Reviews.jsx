import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, Star, User } from "lucide-react";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:8080/api/v1/reviews/admin/reviews", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      toast.error("Error fetching reviews");
    } finally {
      setLoading(false);
    }
  };

  const handleReply = (reviewId, currentText) => {
    setReplyingId(reviewId);
    setReplyText(currentText || "");
  };

  const submitReply = async (reviewId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8080/api/v1/reviews/admin/review/${reviewId}/reply`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText }),
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Reply saved");
        setReplyingId(null);
        setReplyText("");
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to save reply");
      }
    } catch (error) {
      toast.error("Error saving reply");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Product Reviews (Admin)</h1>
      {loading ? (
        <div>Loading reviews...</div>
      ) : (
        <div className="space-y-6">
          {reviews.length === 0 && <div>No reviews found.</div>}
          {reviews.map((review) => (
            <Card key={review._id} className="bg-white/5 border border-gray-200 rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-500" />
                  <span>{review.userId?.name || "Anonymous"}</span>
                  <span className="ml-4 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`} />
                    ))}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2 font-semibold">{review.title}</div>
                <div className="mb-2 text-gray-700">{review.comment}</div>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mb-2">
                    {review.images.map((img, idx) => (
                      <img key={idx} src={img.url} alt="review" className="w-16 h-16 object-cover rounded" />
                    ))}
                  </div>
                )}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-4 h-4 text-blue-400" />
                    <span className="font-semibold text-blue-400">Admin Reply</span>
                  </div>
                  {replyingId === review._id ? (
                    <div className="flex gap-2 items-center">
                      <Input
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1"
                      />
                      <Button onClick={() => submitReply(review._id)} className="bg-blue-500 hover:bg-blue-600 text-white">Save</Button>
                      <Button variant="outline" onClick={() => setReplyingId(null)}>Cancel</Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-700">{review.adminReply?.text || <span className="italic text-gray-400">No reply yet</span>}</span>
                      <Button size="sm" variant="outline" onClick={() => handleReply(review._id, review.adminReply?.text)}>
                        {review.adminReply?.text ? "Edit" : "Reply"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminReviews; 