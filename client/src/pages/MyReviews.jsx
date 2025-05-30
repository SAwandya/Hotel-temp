import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const MyReviews = () => {
  const { axios, getToken, user } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({
    rating: 5,
    comment: "",
  });

  // Fetch user's reviews
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/reviews/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setReviews(data.reviews);
      } else {
        toast.error(data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Error loading your reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  // Start editing a review
  const handleEditStart = (review) => {
    setEditingReview(review._id);
    setEditForm({
      rating: review.rating,
      comment: review.comment,
    });
  };

  // Cancel editing
  const handleEditCancel = () => {
    setEditingReview(null);
    setEditForm({ rating: 5, comment: "" });
  };

  // Submit edited review
  const handleEditSubmit = async (reviewId) => {
    try {
      const { data } = await axios.put(`/api/reviews/${reviewId}`, editForm, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Review updated successfully");
        fetchReviews();
        setEditingReview(null);
      } else {
        toast.error(data.message || "Failed to update review");
      }
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error("Error updating your review");
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }

    try {
      const { data } = await axios.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Review deleted successfully");
        fetchReviews();
      } else {
        toast.error(data.message || "Failed to delete review");
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error("Error deleting your review");
    }
  };

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Render star rating
  const renderStars = (rating, editable = false) => {
    if (editable) {
      return (
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setEditForm({ ...editForm, rating: star })}
              className="focus:outline-none"
            >
              <svg
                className={`w-6 h-6 ${
                  star <= editForm.rating ? "text-yellow-400" : "text-gray-300"
                } cursor-pointer`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400" : "text-gray-300"
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Reviews"
        subTitle="View and manage all the reviews you've left for your hotel stays"
        align="left"
      />

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : reviews.length > 0 ? (
        <div className="max-w-4xl">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="mb-8 p-6 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium">
                    {review.room?.roomType}
                  </h3>
                  <p className="text-gray-600 text-sm">{review.hotel?.name}</p>
                </div>
                <div className="flex flex-col items-end">
                  {renderStars(review.rating)}
                  <span className="text-sm text-gray-500 mt-1">
                    {formatDate(review.createdAt)}
                  </span>
                </div>
              </div>

              {review._id === editingReview ? (
                <div className="mt-4">
                  <div className="mb-3">
                    {renderStars(editForm.rating, true)}
                  </div>
                  <textarea
                    value={editForm.comment}
                    onChange={(e) =>
                      setEditForm({ ...editForm, comment: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  ></textarea>
                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => handleEditSubmit(review._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 mb-4">{review.comment}</p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => handleEditStart(review)}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg max-w-4xl">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            You haven't written any reviews yet
          </h3>
          <p className="text-gray-500">
            After staying at a hotel, you can share your experience by leaving a
            review
          </p>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
