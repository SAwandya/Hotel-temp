import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";

const ReviewList = ({ reviews = [], stats = null }) => {
  const { user } = useAppContext();
  const [expandedReview, setExpandedReview] = useState(null);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();

    // If less than 24 hours ago, show relative time
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${
          diffMinutes !== 1 ? "s" : ""
        } ago`.replace("1 minutes", "a minute");
      }
      return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`.replace(
        "1 hours",
        "an hour"
      );
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`.replace(
        "1 days",
        "a day"
      );
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleExpandReview = (reviewId) => {
    if (expandedReview === reviewId) {
      setExpandedReview(null);
    } else {
      setExpandedReview(reviewId);
    }
  };

  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center shadow-sm">
        <svg
          className="w-16 h-16 mx-auto text-gray-300 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          ></path>
        </svg>
        <p className="text-gray-600 font-medium">No reviews yet</p>
        <p className="text-gray-500 mt-1">Be the first to leave a review!</p>
      </div>
    );
  }

  // Generate stars for rating
  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
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
    <div className="mb-8">
      {stats && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-bold text-gray-800">
                {stats.averageRating.toFixed(1)}
                <span className="text-lg text-gray-500 font-normal"> / 5</span>
              </h3>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(stats.averageRating)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="ml-2 text-gray-600 font-medium">
                  {stats.totalReviews}{" "}
                  {stats.totalReviews === 1 ? "review" : "reviews"}
                </span>
              </div>
            </div>

            {stats.ratingCounts && (
              <div className="flex-1 max-w-xs">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = stats.ratingCounts[rating] || 0;
                  const percentage =
                    stats.totalReviews > 0
                      ? Math.round((count / stats.totalReviews) * 100)
                      : 0;

                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2">
                      <div className="flex items-center min-w-12">
                        <span className="text-sm font-medium">{rating}</span>
                        <svg
                          className="w-4 h-4 text-yellow-400 ml-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            rating >= 4
                              ? "bg-green-400"
                              : rating === 3
                              ? "bg-yellow-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium text-gray-500 min-w-12">
                        {count} {count === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* List of reviews */}
      <div className="space-y-5">
        {reviews.map((review) => {
          const isExpanded = expandedReview === review._id;
          const isLongComment = review.comment.length > 200;

          return (
            <div
              key={review._id}
              className="bg-white rounded-lg shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={review.user?.image || "https://via.placeholder.com/40"}
                    alt={review.user?.username || "Anonymous"}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-800">
                      {review.user?.username || "Anonymous"}
                      {user && review.user?._id === user.sub && (
                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-gray-50 py-1 px-3 rounded-full flex items-center">
                    <span className="font-medium text-gray-700 mr-1.5">
                      {review.rating}
                    </span>
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>

              <div className="mt-3 text-gray-700 relative">
                {isLongComment && !isExpanded ? (
                  <>
                    <p>{review.comment.substring(0, 200)}...</p>
                    <button
                      onClick={() => toggleExpandReview(review._id)}
                      className="text-primary hover:underline text-sm font-medium mt-1"
                    >
                      Read more
                    </button>
                  </>
                ) : (
                  <p className="whitespace-pre-line">{review.comment}</p>
                )}

                {isLongComment && isExpanded && (
                  <button
                    onClick={() => toggleExpandReview(review._id)}
                    className="text-primary hover:underline text-sm font-medium mt-1"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewList;
