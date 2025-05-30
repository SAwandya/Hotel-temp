import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const ReviewForm = ({ roomId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { axios, getToken, user } = useAppContext();
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please log in to leave a review");
      return;
    }

    if (rating < 1 || comment.trim() === "") {
      toast.error("Please provide both a rating and comment");
      return;
    }

    try {
      setSubmitting(true);
      const { data } = await axios.post(
        "/api/reviews",
        {
          roomId,
          rating,
          comment,
          stayDate: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success("Review submitted successfully!");
        setRating(5);
        setComment("");
        if (onReviewSubmitted) onReviewSubmitted();
      } else {
        toast.error(data.message || "Failed to submit review");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg text-center shadow-sm my-8">
        <h3 className="text-xl font-medium mb-2 text-gray-800">
          Share Your Experience
        </h3>
        <p className="text-gray-600 mb-4">
          Sign in to leave a review for this room
        </p>
        <button
          onClick={() => toast.error("Please login to leave a review")}
          className="bg-primary text-white py-2.5 px-6 rounded-md hover:bg-primary-dull transition-all"
        >
          Login to Review
        </button>
      </div>
    );
  }

  const starLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-sm my-8"
    >
      <h3 className="text-xl font-medium mb-4 text-gray-800">
        Write Your Review
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-3 text-gray-700">
          How would you rate your experience?
        </label>
        <div className="flex flex-col items-center">
          <div className="flex mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="focus:outline-none w-10 h-10 mx-1"
              >
                <svg
                  className={`w-10 h-10 transition-all duration-150 ${
                    star <= (hoverRating || rating)
                      ? "text-yellow-400 transform scale-110"
                      : "text-gray-300"
                  } cursor-pointer hover:scale-110`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <span className="text-center text-sm font-medium text-gray-700">
            {hoverRating ? starLabels[hoverRating - 1] : starLabels[rating - 1]}
          </span>
        </div>
      </div>

      <div className="mb-5">
        <label
          htmlFor="comment"
          className="block text-sm font-medium mb-2 text-gray-700"
        >
          Your Review
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
          placeholder="Tell us about your stay experience, the room condition, service quality, etc."
          required
        ></textarea>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={submitting}
          className="bg-primary text-white py-2.5 px-8 rounded-md hover:bg-primary-dull transition-all disabled:bg-gray-400 shadow-sm"
        >
          {submitting ? (
            <div className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </div>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;
