import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const HotelReviews = () => {
  const { axios, getToken } = useAppContext();
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, 5, 4, 3, 2, 1

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/reviews/hotel", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setReviews(data.reviews);
        setStats(data.stats);
      } else {
        toast.error(data.message || "Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Error fetching hotel reviews:", error);
      toast.error("Error loading reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews based on rating
  const filteredReviews = reviews.filter((review) => {
    if (filter === "all") return true;
    return review.rating === parseInt(filter);
  });

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Render star rating component
  const renderStars = (rating) => {
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Title
        align="left"
        font="outfit"
        title="Hotel Reviews"
        subTitle="View feedback and ratings from guests who have stayed at your hotel"
      />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Summary */}
          {stats && (
            <div className="bg-gray-50 rounded-lg p-6 mt-8">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <div className="flex items-end gap-2">
                    <h3 className="text-3xl font-bold">
                      {stats.averageRating.toFixed(1)}
                    </h3>
                    <p className="text-gray-500 mb-1">out of 5</p>
                  </div>
                  <div className="flex items-center mt-1">
                    {renderStars(Math.round(stats.averageRating))}
                    <p className="ml-2 text-sm text-gray-600">
                      {stats.totalReviews}{" "}
                      {stats.totalReviews === 1 ? "review" : "reviews"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      className={`px-4 py-2 rounded-md text-center ${
                        filter === rating.toString()
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      onClick={() =>
                        setFilter((prev) =>
                          prev === rating.toString() ? "all" : rating.toString()
                        )
                      }
                    >
                      {rating} ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Filter indicators */}
          {filter !== "all" && (
            <div className="flex items-center mt-4">
              <p className="text-sm text-gray-600">
                Showing {filteredReviews.length} reviews with {filter} stars
              </p>
              <button
                onClick={() => setFilter("all")}
                className="ml-2 text-primary text-sm hover:underline"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Reviews List */}
          {filteredReviews.length > 0 ? (
            <div className="mt-6 space-y-6">
              {filteredReviews.map((review) => (
                <div
                  key={review._id}
                  className="border-b border-gray-200 last:border-0 pb-6"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <img
                        src={
                          review.user?.image || "https://via.placeholder.com/40"
                        }
                        alt="User Avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center">
                          <h4 className="font-medium">
                            {review.user?.username || "Anonymous"}
                          </h4>
                          <span className="mx-2 text-gray-400">•</span>
                          <p className="text-sm text-gray-500">
                            Room: {review.room?.roomType || "Unknown"}
                          </p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div>{renderStars(review.rating)}</div>
                  </div>
                  <p className="mt-3 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg mt-6">
              <h3 className="text-lg font-medium text-gray-700">
                No {filter !== "all" ? filter + "-star " : ""}reviews found
              </h3>
              <p className="text-gray-500 mt-2">
                {filter !== "all"
                  ? "Try selecting a different rating filter"
                  : "Your hotel hasn't received any reviews yet"}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HotelReviews;
