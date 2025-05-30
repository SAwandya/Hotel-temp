import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import BookingDetails from "../../components/hotelOwner/BookingDetails";
import { assets } from "../../assets/assets";

const BookingManagement = () => {
  const { axios, getToken, user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'pending', 'confirmed', 'cancelled'

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        // Make sure we're setting bookings from the correct property in the response
        // And ensure it's an array
        setBookings(data.bookings || []);
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

  // Filter bookings based on active tab
  // Use a safe default empty array if bookings is undefined
  const filteredBookings = (bookings || []).filter((booking) => {
    if (activeTab === "all") return true;
    if (activeTab === "pending") return booking.status === "pending";
    if (activeTab === "confirmed") return booking.status === "confirmed";
    if (activeTab === "cancelled") return booking.status === "cancelled";
    return true;
  });

  // Calculate booking counts safely
  const pendingCount = (bookings || []).filter(
    (b) => b.status === "pending"
  ).length;
  const confirmedCount = (bookings || []).filter(
    (b) => b.status === "confirmed"
  ).length;
  const cancelledCount = (bookings || []).filter(
    (b) => b.status === "cancelled"
  ).length;

  const tabStyle = (tabName) =>
    `mr-1 py-3 px-6 text-sm font-medium rounded-t-lg transition-all ${
      activeTab === tabName
        ? "bg-white text-primary border-t border-l border-r border-gray-200"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <Title
        align="left"
        font="outfit"
        title="Booking Management"
        subTitle="Manage all your hotel bookings in one place. View details, confirm or cancel reservations, and update payment statuses."
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Total Bookings</p>
            <div className="bg-blue-100 p-2 rounded-full">
              <img
                src={assets.calenderIcon}
                alt="calendar"
                className="w-5 h-5"
              />
            </div>
          </div>
          <p className="text-2xl font-medium mt-2">{bookings?.length || 0}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Pending</p>
            <div className="bg-yellow-100 p-2 rounded-full">
              <img
                src={assets.calenderIcon}
                alt="calendar"
                className="w-5 h-5"
              />
            </div>
          </div>
          <p className="text-2xl font-medium mt-2">{pendingCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Confirmed</p>
            <div className="bg-green-100 p-2 rounded-full">
              <img
                src={assets.calenderIcon}
                alt="calendar"
                className="w-5 h-5"
              />
            </div>
          </div>
          <p className="text-2xl font-medium mt-2">{confirmedCount}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-gray-500 text-sm">Cancelled</p>
            <div className="bg-red-100 p-2 rounded-full">
              <img
                src={assets.calenderIcon}
                alt="calendar"
                className="w-5 h-5"
              />
            </div>
          </div>
          <p className="text-2xl font-medium mt-2">{cancelledCount}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap border-b border-gray-200 mb-6">
        <button className={tabStyle("all")} onClick={() => setActiveTab("all")}>
          All
          <span className="ml-2 bg-gray-100 text-gray-700 text-xs rounded-full px-2 py-0.5">
            {bookings?.length || 0}
          </span>
        </button>

        <button
          className={tabStyle("pending")}
          onClick={() => setActiveTab("pending")}
        >
          Pending
          <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs rounded-full px-2 py-0.5">
            {pendingCount}
          </span>
        </button>

        <button
          className={tabStyle("confirmed")}
          onClick={() => setActiveTab("confirmed")}
        >
          Confirmed
          <span className="ml-2 bg-green-100 text-green-700 text-xs rounded-full px-2 py-0.5">
            {confirmedCount}
          </span>
        </button>

        <button
          className={tabStyle("cancelled")}
          onClick={() => setActiveTab("cancelled")}
        >
          Cancelled
          <span className="ml-2 bg-red-100 text-red-700 text-xs rounded-full px-2 py-0.5">
            {cancelledCount}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center bg-white rounded-lg shadow-sm p-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="space-y-4 bg-white rounded-lg shadow-sm p-6">
          {filteredBookings.map((booking) => (
            <BookingDetails
              key={booking._id}
              booking={booking}
              onUpdate={fetchBookings}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <img
            src={assets.calenderIcon}
            alt="No bookings"
            className="w-16 h-16 mx-auto mb-4 opacity-30"
          />
          <p className="text-gray-500 text-lg">
            No {activeTab !== "all" ? activeTab : ""} bookings found
          </p>
          <p className="text-gray-400 mt-2">
            {activeTab === "all"
              ? "You don't have any bookings yet."
              : `You don't have any ${activeTab} bookings.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
