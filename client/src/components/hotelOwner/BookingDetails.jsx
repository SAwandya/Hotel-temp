import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { format } from "date-fns";

const BookingDetails = ({ booking, onUpdate }) => {
  const { axios, getToken } = useAppContext();
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const { data } = await axios.post(
        "/api/bookings/update-status",
        {
          bookingId: booking._id,
          status: newStatus,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Booking status updated");
        if (onUpdate) onUpdate();
      } else {
        toast.error(data.message || "Failed to update booking");
      }
    } catch (error) {
      toast.error("Error updating booking");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handlePaymentStatusChange = async () => {
    try {
      setUpdating(true);
      const { data } = await axios.post(
        "/api/bookings/update-status",
        {
          bookingId: booking._id,
          isPaid: !booking.isPaid,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Payment status updated");
        if (onUpdate) onUpdate();
      } else {
        toast.error(data.message || "Failed to update payment status");
      }
    } catch (error) {
      toast.error("Error updating payment status");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  // Format dates nicely
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section with basic info */}
      <div
        className="p-4 border-b border-gray-200 flex justify-between items-center cursor-pointer hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h3 className="text-lg font-medium">
            {booking.user?.username || "Guest"}
          </h3>
          <div className="flex items-center">
            <span className="text-sm text-gray-500 mx-2 hidden sm:block">
              •
            </span>
            <span className="text-sm text-gray-500">
              {formatDate(booking.checkInDate)} -{" "}
              {formatDate(booking.checkOutDate)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-sm px-3 py-1 rounded-full ${
              booking.status === "confirmed"
                ? "bg-green-100 text-green-800"
                : booking.status === "cancelled"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>

          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${
              expanded ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="p-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Room info */}
            <div className="flex items-start gap-3">
              {booking.room?.images && booking.room.images[0] && (
                <img
                  src={booking.room.images[0]}
                  alt="Room"
                  className="w-20 h-20 rounded-md object-cover"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {booking.room?.roomType || "Standard Room"}
                </p>
                <p className="text-gray-600 text-sm">
                  {booking.guests} {booking.guests > 1 ? "guests" : "guest"} • $
                  {booking.totalPrice}
                </p>
              </div>
            </div>

            {/* Dates & Payment */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
                <p>
                  Check-in:{" "}
                  <span className="font-medium">
                    {formatDate(booking.checkInDate)}
                  </span>
                </p>
              </div>
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
                <p>
                  Check-out:{" "}
                  <span className="font-medium">
                    {formatDate(booking.checkOutDate)}
                  </span>
                </p>
              </div>
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-2 ${
                    booking.isPaid ? "bg-green-500" : "bg-orange-500"
                  }`}
                ></div>
                <p>
                  Payment:{" "}
                  <span className="font-medium">
                    {booking.isPaid ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 items-center justify-end">
              <button
                onClick={() => handleStatusChange("confirmed")}
                disabled={booking.status === "confirmed" || updating}
                className={`px-4 py-2 text-sm rounded-md ${
                  booking.status === "confirmed"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-green-100 text-green-800 hover:bg-green-200"
                }`}
              >
                Confirm
              </button>

              <button
                onClick={() => handleStatusChange("cancelled")}
                disabled={booking.status === "cancelled" || updating}
                className={`px-4 py-2 text-sm rounded-md ${
                  booking.status === "cancelled"
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }`}
              >
                Cancel
              </button>

              <button
                onClick={handlePaymentStatusChange}
                disabled={updating}
                className={`px-4 py-2 text-sm rounded-md ${
                  booking.isPaid
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Mark as {booking.isPaid ? "Unpaid" : "Paid"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetails;
