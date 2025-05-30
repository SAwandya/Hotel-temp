import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import FallbackMap from "./FallbackMap";

const MapModal = ({ booking, onClose }) => {
  const [mapError, setMapError] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (booking && booking.hotel) {
      console.log("MapModal - Hotel Data:", booking.hotel); // Debug

      // Try to get location from hotel data
      let locationData = null;

      if (booking.hotel.location) {
        console.log("Raw location data:", booking.hotel.location); // Debug

        // Handle different potential formats of location data
        if (typeof booking.hotel.location === "string") {
          try {
            locationData = JSON.parse(booking.hotel.location);
          } catch (e) {
            console.error("Failed to parse location string:", e);
          }
        } else if (typeof booking.hotel.location === "object") {
          locationData = booking.hotel.location;
        }
      }

      // Create a default fallback if needed
      if (!locationData || (!locationData.lat && !locationData.lng)) {
        // Default to a central location based on the city if available
        locationData = { lat: 40.7128, lng: -74.006 }; // New York as fallback
      }

      console.log("Final location data to use:", locationData); // Debug
      setLocation(locationData);
    }
  }, [booking]);

  if (!booking || !booking.hotel) return null;

  console.log("Rendering MapModal with location:", location); // Debug

  // Calculate nights of stay
  const getNights = () => {
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    const diffTime = Math.abs(checkOut - checkIn);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const nights = getNights();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 animate-fadeIn">
      <div
        className="bg-white rounded-lg w-full max-w-3xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-medium text-gray-800 flex items-center">
            <svg
              className="h-5 w-5 text-primary mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {booking.hotel.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-4">
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-500 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{booking.hotel.address}</span>
            </div>

            {booking.hotel.destination && (
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 text-primary mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-primary font-medium">
                  {booking.hotel.destination}
                </span>
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-wrap gap-4 justify-between">
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">
                {new Date(booking.checkInDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-out</p>
              <p className="font-medium">
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Stay</p>
              <p className="font-medium">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Room Type</p>
              <p className="font-medium">{booking.room.roomType}</p>
            </div>
          </div>

          <div className="h-72 md:h-80">
            {mapError || !location ? (
              <FallbackMap
                title={booking.hotel.name}
                address={booking.hotel.address}
                height="100%"
              />
            ) : (
              <MapView
                key={`map-${booking._id}`} // Add key to force re-render
                location={location}
                title={booking.hotel.name}
                height="100%"
                onError={() => setMapError(true)}
              />
            )}
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapModal;
