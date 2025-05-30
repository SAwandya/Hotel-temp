import React from "react";
import { assets } from "../../assets/assets";

const DashboardOverview = ({ dashboardData }) => {
  const {
    totalBookings = 0,
    confirmedBookings = 0,
    pendingBookings = 0,
    cancelledBookings = 0,
    totalRevenue = 0,
    paidBookings = 0,
    unpaidBookings = 0,
    roomsCount = 0,
  } = dashboardData || {};

  // Calculate percentages
  const confirmationRate = totalBookings
    ? Math.round((confirmedBookings / totalBookings) * 100)
    : 0;
  const cancellationRate = totalBookings
    ? Math.round((cancelledBookings / totalBookings) * 100)
    : 0;
  const paymentRate = totalBookings
    ? Math.round((paidBookings / totalBookings) * 100)
    : 0;

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      icon: assets.calenderIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      icon: assets.walletIcon || assets.dashboardIcon,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Rooms",
      value: roomsCount,
      icon: assets.homeIcon,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Occupancy Rate",
      value: `${confirmationRate}%`,
      icon: assets.chartIcon || assets.starIcon,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  return (
    <div>
      {/* Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {dashboardCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 text-sm">{card.title}</h3>
              <div className={`p-2 rounded-full ${card.color}`}>
                <img src={card.icon} alt={card.title} className="w-5 h-5" />
              </div>
            </div>
            <p className="text-2xl font-medium">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Booking Status */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="font-medium mb-4">Booking Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Confirmed</p>
                <p className="text-xl font-medium mt-1">{confirmedBookings}</p>
              </div>
              <div className="bg-blue-100 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {confirmationRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-medium mt-1">{pendingBookings}</p>
              </div>
              <div className="bg-yellow-100 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-medium">
                  {totalBookings
                    ? Math.round((pendingBookings / totalBookings) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cancelled</p>
                <p className="text-xl font-medium mt-1">{cancelledBookings}</p>
              </div>
              <div className="bg-red-100 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-medium">
                  {cancellationRate}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="font-medium mb-4">Payment Status</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid</p>
                <p className="text-xl font-medium mt-1">{paidBookings}</p>
              </div>
              <div className="bg-green-100 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-medium">
                  {paymentRate}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unpaid</p>
                <p className="text-xl font-medium mt-1">{unpaidBookings}</p>
              </div>
              <div className="bg-orange-100 h-10 w-10 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-medium">
                  {totalBookings
                    ? Math.round((unpaidBookings / totalBookings) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
