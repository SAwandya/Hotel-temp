import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { assets, facilityIcons, roomCommonData } from "../assets/assets";
import StarRating from "../components/StarRating";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import MapView from "../components/MapView";
import FallbackMap from "../components/FallbackMap"; // Add this import

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();
  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    checkInDate: "",
    checkOutDate: "",
    guests: 1,
  });
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Fetch room data
  const fetchRoom = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/rooms/${id}`);
      if (response.data.success) {
        setRoom(response.data.room);
        setMainImage(response.data.room.images[0]);
      } else {
        toast.error("Failed to load room details");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error loading room details");
    } finally {
      setLoading(false);
    }
  };

  // Add this function to fetch reviews
  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const { data } = await axios.get(`/api/reviews/room/${id}`);

      if (data.success) {
        setReviews(data.reviews);
        setReviewStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRoom();
      fetchReviews(); // Add this line to fetch reviews on page load
    }
  }, [id]);

  // Handle booking form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to book a room");
      return;
    }

    // Validate dates
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);

    if (checkIn >= checkOut) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    if (checkIn < new Date()) {
      toast.error("Check-in date cannot be in the past");
      return;
    }

    // First check availability
    setCheckingAvailability(true);
    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
      });

      setIsAvailable(data.isAvailable);

      if (!data.isAvailable) {
        toast.error("Room is not available for the selected dates");
        return;
      }

      // If available, proceed with booking
      setBookingInProgress(true);
      const bookResponse = await axios.post(
        "/api/bookings/book",
        {
          room: id,
          checkInDate: bookingData.checkInDate,
          checkOutDate: bookingData.checkOutDate,
          guests: bookingData.guests,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (bookResponse.data.success) {
        toast.success("Booking successful!");
        navigate("/my-bookings");
      } else {
        toast.error(bookResponse.data.message || "Failed to book room");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error processing your booking");
    } finally {
      setCheckingAvailability(false);
      setBookingInProgress(false);
    }
  };

  // Handle input change for booking form
  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.id]: e.target.value,
    });
    // Reset availability check when dates change
    setIsAvailable(null);
  };

  if (loading) {
    return (
      <div className="py-28 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    room && (
      <div className="py-28 mg:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Room Details*/}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20% OFF
          </p>
        </div>
        {/* Room Rating */}
        <div className="flex items-center gap-1 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* Room Address */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* Display destination if available */}
        {room.hotel.destination && (
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <img
              src={assets.locationFilledIcon}
              alt="destination-icon"
              className="w-4 h-4"
            />
            <span className="text-primary font-medium text-sm">
              {room.hotel.destination}
            </span>
          </div>
        )}

        {/* Room Images */}
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Room-Image"
              className="w-full h-96 rounded-xl shadow-lg object-cover"
            />{" "}
            {/* Main Image */}
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {" "}
            {/* Other Images */}
            {room?.images.length > 1 &&
              room.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Room Image"
                  className={`w-full h-44 rounded-xl shadow-md object-cover 
                cursor-pointer ${
                  mainImage === image
                    ? "outline outline-3 outline-orange-500"
                    : ""
                }`}
                />
              ))}
          </div>
        </div>

        {/* Room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Discover a whole new level of luxury
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item] || assets.homeIcon}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-s">{item}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Room Price */}
          <p className="text-2xl font-medium">${room.pricePerNight}/Night</p>
        </div>

        {/* Hotel Location Map */}
        {room.hotel.location &&
          (room.hotel.location.lat !== 0 || room.hotel.location.lng !== 0) && (
            <div className="my-8">
              <h2 className="text-xl font-medium mb-3 flex items-center">
                <img
                  src={assets.locationIcon}
                  alt="location"
                  className="w-5 h-5 mr-2"
                />
                Hotel Location
              </h2>

              <div className="mb-2">
                <p className="text-gray-600">{room.hotel.address}</p>
                {room.hotel.destination && (
                  <p className="text-primary text-sm">
                    {room.hotel.destination}
                  </p>
                )}
              </div>

              <React.Suspense
                fallback={
                  <FallbackMap
                    title={room.hotel.name}
                    address={room.hotel.address}
                  />
                }
              >
                <MapView
                  location={room.hotel.location}
                  title={room.hotel.name}
                  height="300px"
                />
              </React.Suspense>
            </div>
          )}

        {/* Check CheckOut Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white 
        shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div className="flex flex-col gap-4 flex-wrap md:flex-row items-start md:items-center md:gap-10 text-gray-500">
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                placeholder="Check-In"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                value={bookingData.checkInDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]} // Set min to today
              />
            </div>
            <div className="w-px h-15 bg-gray-300 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                placeholder="Check-Out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                value={bookingData.checkOutDate}
                onChange={handleInputChange}
                min={
                  bookingData.checkInDate ||
                  new Date().toISOString().split("T")[0]
                } // Set min to check-in date or today
              />
            </div>
            <div className="w-px h-15 bg-gray-300 max-md:hidden"></div>
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                type="number"
                id="guests"
                placeholder="1"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
                min="1"
                max="10"
                value={bookingData.guests}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <button
            type="submit"
            className={`bg-primary hover:bg-primary-dull active:scale-95 transition-all text-white
            rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer
            ${
              checkingAvailability || bookingInProgress
                ? "opacity-70 cursor-not-allowed"
                : ""
            }`}
            disabled={checkingAvailability || bookingInProgress}
          >
            {checkingAvailability
              ? "Checking..."
              : bookingInProgress
              ? "Booking..."
              : "Book Now"}
          </button>
        </form>

        {isAvailable === false && (
          <div className="mt-4 text-red-500 text-center">
            Room is not available for selected dates. Please try different
            dates.
          </div>
        )}

        {/* Common Specification */}
        <div className="mt-25 space-y-4 pt-10">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable two bedroom apartment has a true
            city feeling. The price quoted is for {bookingData.guests || "two"}{" "}
            guest(s), at the guest slot please mark the number of guests to get
            the exact price for groups. The Guests will be allocated ground
            floor according to availability. You get a comfortable two bedroom
            apartment has a true city feeling.
          </p>
        </div>

        {/* Hosted by*/}
        <div className="flex flex-col items-start gap-4 ">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner?.image || "https://via.placeholder.com/60"}
              alt="Host"
              className="h-14 w-14 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Host by {room.hotel.name}</p>
              <div className="flex items-center mt-1">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
          <button className="px-6 py-2.5 mt-4 rounded text-white bg-primary hover:bg-primary-dull transition-all cursor-pointer">
            Contact Now
          </button>
        </div>

        {/* Add review section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-playfair mb-6 flex items-center">
            <svg
              className="w-6 h-6 mr-2 text-primary"
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
            Guest Reviews
          </h2>

          {loadingReviews ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <ReviewList reviews={reviews} stats={reviewStats} />
              <ReviewForm roomId={id} onReviewSubmitted={fetchReviews} />
            </>
          )}
        </div>
      </div>
    )
  );
};

export default RoomDetails;
