import React, { useState, useEffect } from "react";
import Rating from "../common/Rating";
import Button from "../common/Button";
import { productService } from "../../services/productService";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "react-toastify";

const ProductReviews = ({ productId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    productService.getReviews(productId)
      .then(({ data }) => setReviews(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await productService.createReview({ product_id: productId, ...form });
      setReviews([{ ...data.data, user_name: user.name }, ...reviews]);
      setForm({ rating: 5, comment: "" });
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
    setSubmitting(false);
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>

      {user && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-8">
          <h3 className="font-semibold mb-4">Write a Review</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Rating</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: parseInt(e.target.value) })}
              className="border rounded-lg px-3 py-2">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Star{r !== 1 ? "s" : ""}</option>)}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 h-24" placeholder="Share your experience..." />
          </div>
          <Button type="submit" loading={submitting}>Submit Review</Button>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="font-medium">{review.user_name}</span>
                <Rating value={review.rating} size={14} />
              </div>
              {review.comment && <p className="text-gray-600">{review.comment}</p>}
              <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
