import React, { useState, useEffect } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import PaymentModal from "../components/PaymentModal";
import MapModal from "../components/MapModal";
import { format } from "date-fns";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { axios, getToken, user } = useAppContext();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [mapBooking, setMapBooking] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        // Filter out any null or incomplete booking objects
        const validBookings = data.bookings.filter(
          (booking) =>
            booking &&
            booking._id &&
            booking.checkInDate &&
            booking.checkOutDate
        );
        setBookings(validBookings);
      } else {
        toast.error(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      toast.error("Error loading bookings");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  const handlePayNow = (booking) => {
    setSelectedBooking(booking);
  };

  const handleViewMap = (booking) => {
    console.log("View map for booking:", booking); // Debug - check booking data
    console.log("Location data:", booking.hotel.location); // Debug - check location data
    setMapBooking(booking);
  };

  // Format date nicer
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  // Add this helper function to safely access nested properties
  const getRoomImage = (booking) => {
    if (booking?.room?.images && booking.room.images.length > 0) {
      return booking.room.images[0];
    }
    // Return a placeholder image if the room image is not available
    return "https://via.placeholder.com/100x100?text=No+Image";
  };

  const getRoomType = (booking) => {
    return booking?.room?.roomType || "Unknown Room Type";
  };

  const getHotelName = (booking) => {
    return booking?.hotel?.name || "Unknown Hotel";
  };

  const getHotelAddress = (booking) => {
    return booking?.hotel?.address || "Address not available";
  };

  const getRoomId = (booking) => {
    return booking?.room?._id;
  };

  const getBookingStatus = (booking) => {
    if (!booking || !booking.status) return "pending";
    return booking.status;
  };

  const getIsPaid = (booking) => {
    return booking?.isPaid || false;
  };

  const getGuests = (booking) => {
    return booking?.guests || 1;
  };

  const getPrice = (booking) => {
    return booking?.totalPrice || 0;
  };

  const getCreatedAt = (booking) => {
    return booking?.createdAt;
  };

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Easily manage your past, current, and upcoming hotel reservations in one place.
      Plan your trips seamlessly with just a few clicks"
        align="left"
      />

      {/* Bookings Filter Options - Can be expanded later */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="px-4 py-1.5 bg-primary text-white rounded-full text-sm">
          All Bookings
        </button>
        <button className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
          Upcoming
        </button>
        <button className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm hover:bg-gray-50">
          Past
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : bookings && bookings.length > 0 ? (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-shadow hover:shadow-md"
            >
              <div className="md:flex">
                {/* Left Side - Hotel Image */}
                <div className="md:w-1/4 h-60 md:h-auto relative">
                  <img
                    src={getRoomImage(booking)}
                    alt={getRoomType(booking)}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
                    {booking?.room?.roomType}
                  </div>
                </div>

                {/* Right Side - Booking Details */}
                <div className="p-5 md:w-3/4 flex flex-col md:flex-row">
                  {/* Hotel Info */}
                  <div className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-playfair text-xl md:text-2xl font-medium text-gray-800">
                          {getHotelName(booking)}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                          <img
                            src={assets.locationIcon}
                            alt="location-icon"
                            className="w-4 h-4"
                          />
                          <span>{getHotelAddress(booking)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md">
                        <div
                          className={`h-3 w-3 rounded-full ${
                            booking.isPaid ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        <p
                          className={`text-sm ${
                            booking.isPaid ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {booking.isPaid ? "Paid" : "Unpaid"}
                        </p>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="mt-4 flex flex-wrap gap-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Check-in</span>
                        <span className="font-medium">
                          {formatDate(booking.checkInDate)}
                        </span>
                      </div>

                      <div className="flex items-center px-2">
                        <svg
                          width="20"
                          height="8"
                          viewBox="0 0 20 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M19.3536 4.35355C19.5488 4.15829 19.5488 3.84171 19.3536 3.64645L16.1716 0.464466C15.9763 0.269204 15.6597 0.269204 15.4645 0.464466C15.2692 0.659728 15.2692 0.976311 15.4645 1.17157L18.2929 4L15.4645 6.82843C15.2692 7.02369 15.2692 7.34027 15.4645 7.53553C15.6597 7.7308 15.9763 7.7308 16.1716 7.53553L19.3536 4.35355ZM0 4.5H19V3.5H0V4.5Z"
                            fill="#CBD5E1"
                          />
                        </svg>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Check-out</span>
                        <span className="font-medium">
                          {formatDate(booking.checkOutDate)}
                        </span>
                      </div>

                      <div className="flex flex-col ml-auto">
                        <span className="text-sm text-gray-500">Guests</span>
                        <span className="font-medium">
                          {booking.guests}{" "}
                          {booking.guests === 1 ? "Guest" : "Guests"}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-sm text-gray-500">Status</span>
                        <span className="font-medium">{booking.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer section with price and actions */}
              <div className="bg-gray-50 p-4 md:px-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
                <div className="flex items-center">
                  <span className="text-gray-700 mr-1">Total:</span>
                  <span className="text-xl font-medium text-gray-900">
                    {booking.currency || "$"}
                    {booking.totalPrice}
                  </span>
                </div>

                <div className="flex gap-3">
                  {!booking.isPaid && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
                    >
                      Pay Now
                    </button>
                  )}

                  {/* Always show View Map button now to help debug */}
                  <button
                    onClick={() => handleViewMap(booking)}
                    className="px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-all flex items-center gap-2"
                  >
                    <img
                      src={assets.locationIcon}
                      alt="location"
                      className="w-4 h-4"
                    />
                    View Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 bg-gray-50 rounded-lg border border-gray-100 mt-6">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No bookings found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't made any hotel bookings yet.
          </p>
          <a
            href="/rooms"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-all"
          >
            Browse Hotels
            <svg
              className="w-4 h-4 ml-2"
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
      )}

      {selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onSuccess={fetchBookings}
        />
      )}

      {/* Map Modal */}
      {mapBooking && (
        <MapModal booking={mapBooking} onClose={() => setMapBooking(null)} />
      )}
    </div>
  );
};

export default MyBookings;
