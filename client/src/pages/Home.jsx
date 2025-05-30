import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import Hero from "../components/Hero";
import Title from "../components/Title";
import toast from "react-hot-toast";

// Additional components
import FeaturedRooms from "../components/FeaturedRooms";
import FeaturedTestimonials from "../components/FeaturedTestimonials";

const Home = () => {
  const { axios } = useAppContext();
  const [topRatedRooms, setTopRatedRooms] = useState([]);
  const [featuredReviews, setFeaturedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  // Fetch top-rated rooms
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch top-rated rooms
        const roomsResponse = await axios.get("/api/rooms?sort=rating&limit=4");

        if (roomsResponse.data.success) {
          setTopRatedRooms(roomsResponse.data.rooms);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data:", error);
        toast.error("Error loading content");
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Fetch featured reviews
  useEffect(() => {
    const fetchFeaturedReviews = async () => {
      try {
        setReviewsLoading(true);

        // Fetch top-rated reviews
        const reviewsResponse = await axios.get("/api/reviews/featured");

        if (reviewsResponse.data.success) {
          setFeaturedReviews(reviewsResponse.data.reviews);
        }

        setReviewsLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        // Don't show toast for reviews to avoid too many notifications
        setReviewsLoading(false);
      }
    };

    fetchFeaturedReviews();
  }, []);

  return (
    <div>
      <Hero />

      {/* Featured Rooms Section */}
      <div className="py-20 px-4 md:px-16 lg:px-24 xl:px-32">
        <Title
          title="Featured Rooms"
          subTitle="Discover our selection of the finest accommodations tailored for your comfort"
          align="center"
        />

        <FeaturedRooms rooms={topRatedRooms} loading={loading} />
      </div>

      {/* Guest Reviews Section */}
      <div className="py-20 px-4 md:px-16 lg:px-24 xl:px-32 bg-gray-50">
        <Title
          title="What Our Guests Say"
          subTitle="Discover the experiences of travelers who have stayed with us"
          align="center"
        />

        <FeaturedTestimonials
          reviews={featuredReviews}
          loading={reviewsLoading}
        />
      </div>

      {/* Add more home page sections as needed */}
    </div>
  );
};

export default Home;
