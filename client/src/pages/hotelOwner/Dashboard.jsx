import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import Title from "../../components/Title";
import DashboardOverview from "../../components/hotelOwner/DashboardOverview";
import { assets } from "../../assets/assets";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { axios, getToken, user } = useAppContext();
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    paidBookings: 0,
    unpaidBookings: 0,
    roomsCount: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await axios.get("/api/hotels/dashboard", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setDashboardData({
          totalBookings: data.totalBookings || 0,
          confirmedBookings: data.confirmedBookings || 0,
          pendingBookings: data.pendingBookings || 0,
          cancelledBookings: data.cancelledBookings || 0,
          totalRevenue: data.totalRevenue || 0,
          paidBookings: data.paidBookings || 0,
          unpaidBookings: data.unpaidBookings || 0,
          roomsCount: data.roomsCount || 0,
        });

        // Get the most recent 5 bookings
        const sortedBookings = (data.bookings || []).slice(0, 5);

        setRecentBookings(sortedBookings);
      } else {
        setError(data.message || "Failed to load dashboard data");
        toast.error(data.message || "Failed to load dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Error connecting to server. Please try again later.");
      toast.error(
        "Error loading dashboard data. Please check your connection."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <Title
        align="left"
        font="outfit"
        title="Dashboard Overview"
        subTitle="Monitor your hotel performance, bookings, and revenue at a glance"
      />

      {loading ? (
        <div className="flex justify-center items-center h-80">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center p-10 bg-red-50 rounded-lg my-6">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dull transition-all"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <DashboardOverview dashboardData={dashboardData} />

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Recent Bookings</h3>
              <Link
                to="/owner/bookings"
                className="text-primary text-sm hover:underline"
              >
                View All
              </Link>
            </div>

            {recentBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="py-3 px-4 text-gray-600 font-medium text-sm">
                        Guest
                      </th>
                      <th className="py-3 px-4 text-gray-600 font-medium text-sm">
                        Room
                      </th>
                      <th className="py-3 px-4 text-gray-600 font-medium text-sm">
                        Dates
                      </th>
                      <th className="py-3 px-4 text-gray-600 font-medium text-sm">
                        Amount
                      </th>
                      <th className="py-3 px-4 text-gray-600 font-medium text-sm">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4 text-sm">
                          {booking.user?.username || "Guest"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {booking.room?.roomType || "Standard Room"}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          {formatDate(booking.checkInDate)} -{" "}
                          {formatDate(booking.checkOutDate)}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          ${booking.totalPrice}
                          <span className="ml-1 text-xs">
                            {booking.isPaid ? (
                              <span className="text-green-500">(Paid)</span>
                            ) : (
                              <span className="text-red-500">(Unpaid)</span>
                            )}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full ${
                              booking.status === "confirmed"
                                ? "bg-green-100 text-green-800"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <img
                  src={assets.calenderIcon}
                  alt="No bookings"
                  className="w-12 h-12 mx-auto mb-3 opacity-30"
                />
                <p className="text-gray-500">No recent bookings found</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <Link
              to="/owner/add-room"
              className="bg-blue-50 p-5 rounded-lg flex flex-col items-center hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <img src={assets.addIcon} alt="Add Room" className="w-6 h-6" />
              </div>
              <h3 className="font-medium text-blue-800">Add Room</h3>
              <p className="text-xs text-center text-blue-600 mt-1">
                List a new room for booking
              </p>
            </Link>

            <Link
              to="/owner/list-room"
              className="bg-green-50 p-5 rounded-lg flex flex-col items-center hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <img
                  src={assets.listIcon}
                  alt="Manage Rooms"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="font-medium text-green-800">Manage Rooms</h3>
              <p className="text-xs text-center text-green-600 mt-1">
                Update room details and availability
              </p>
            </Link>

            <Link
              to="/owner/profile"
              className="bg-purple-50 p-5 rounded-lg flex flex-col items-center hover:shadow-md transition-all cursor-pointer"
            >
              <div className="bg-purple-100 p-3 rounded-full mb-3">
                <img
                  src={assets.homeIcon}
                  alt="Hotel Profile"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="font-medium text-purple-800">Hotel Profile</h3>
              <p className="text-xs text-center text-purple-600 mt-1">
                Update your hotel information
              </p>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
