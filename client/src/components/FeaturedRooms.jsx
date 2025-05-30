import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { roomsDummyData } from "../assets/assets";

const FeaturedRooms = ({ rooms = [], loading = false }) => {
  // Use dummy data if no rooms are provided
  const displayRooms = rooms.length > 0 ? rooms : roomsDummyData;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {displayRooms.map((room, index) => (
        <Link
          to={`/rooms/${room._id}`}
          key={room._id || index}
          className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          <div className="relative overflow-hidden h-52">
            <img
              src={room.images?.[0] || assets.roomImg1}
              alt={room.roomType || "Hotel Room"}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
              {room.roomType}
            </div>
            {index === 0 && (
              <div className="absolute top-3 right-3 bg-yellow-500 px-3 py-1 rounded-full text-xs font-medium text-white">
                Best Rated
              </div>
            )}
          </div>

          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-800">
                {room.hotel?.name || "Luxury Hotel"}
              </h3>
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm text-gray-700 ml-1">4.8</span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
              <img
                src={assets.locationIcon}
                alt="location-icon"
                className="w-4 h-4"
              />
              <span className="truncate">
                {room.hotel?.address || "123 Main St, City"}
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <p className="text-primary font-medium">
                ${room.pricePerNight}
                <span className="text-gray-500 text-sm"> /night</span>
              </p>
              <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                {room.amenities?.[0] || "Free Wifi"}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default FeaturedRooms;
