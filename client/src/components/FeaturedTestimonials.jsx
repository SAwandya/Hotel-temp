import React from "react";
import { testimonials } from "../assets/assets";
import { formatReviewDate } from "../utils/formatters";

const FeaturedTestimonials = ({ reviews = [], loading = false }) => {
  // If no reviews are passed or still loading, use dummy testimonials data
  const displayReviews =
    !loading && reviews.length > 0 ? reviews : testimonials;

  // Function to truncate long reviews
  const truncateReview = (review, maxLength = 150) => {
    if (review.length <= maxLength) return review;
    return `${review.substring(0, maxLength).trim()}...`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {displayReviews.map((review, index) => (
          <div
            key={review._id || review.id}
            className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            <div className="flex items-center mb-4">
              <img
                src={
                  review.user?.image ||
                  review.image ||
                  "https://via.placeholder.com/60"
                }
                alt={review.user?.username || review.name || "Guest"}
                className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-primary"
              />
              <div>
                <h3 className="font-medium text-gray-800">
                  {review.user?.username || review.name || "Guest"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {review.hotel?.name || review.address || "Hotel Guest"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {review.createdAt ? formatReviewDate(review.createdAt) : ""}
                </p>
              </div>
            </div>

            <div className="mb-4 flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < (review.rating || 5)
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

            <p className="text-gray-700 flex-grow italic">
              &ldquo;{truncateReview(review.comment || review.review)}&rdquo;
            </p>

            <div className="mt-4 text-right">
              <svg
                className="w-8 h-8 text-gray-200 ml-auto"
                fill="currentColor"
                viewBox="0 0 32 32"
              >
                <path d="M10 8c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4zm12 0c-2.2 0-4 1.8-4 4v10h10V12h-6c0-1.1 0.9-2 2-2h2V8h-4z" />
              </svg>
            </div>

            {review.room && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <a
                  href={`/rooms/${review.room._id}`}
                  className="text-xs text-primary hover:underline flex items-center"
                >
                  {review.room.roomType}
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="/rooms"
          className="inline-flex items-center bg-primary text-white px-6 py-2.5 rounded-md hover:bg-primary-dull transition-all"
        >
          <span>View All Rooms</span>
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </a>
      </div>
    </div>
  );
};

export default FeaturedTestimonials;
