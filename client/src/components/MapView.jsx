import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapView = ({ location, title, height = "250px", onError }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [error, setError] = useState(null);

  // Default to a central location if none provided
  const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York City

  // Convert location to proper format
  const getValidLocation = () => {
    if (!location) return defaultLocation;

    // Convert string types to numbers if needed
    const lat =
      typeof location.lat === "string"
        ? parseFloat(location.lat)
        : location.lat;
    const lng =
      typeof location.lng === "string"
        ? parseFloat(location.lng)
        : location.lng;

    // Validate that we have real numbers
    if (isNaN(lat) || isNaN(lng)) return defaultLocation;

    return { lat, lng };
  };

  const mapLocation = getValidLocation();

  console.log("MapView - Using location:", mapLocation); // Debug

  useEffect(() => {
    // Clean up previous map instance if it exists
    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    // Don't create map if element isn't ready
    if (!mapRef.current) return;

    try {
      console.log("Creating map with location:", mapLocation); // Debug

      // Create map
      const map = L.map(mapRef.current).setView(
        [mapLocation.lat, mapLocation.lng],
        14
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker with popup
      const marker = L.marker([mapLocation.lat, mapLocation.lng]).addTo(map);

      // Add popup with title if provided
      if (title) {
        marker.bindPopup(`<strong>${title}</strong>`).openPopup();
      }

      // Store map instance in ref
      mapInstance.current = map;

      // Ensure map size is correct (fixes initial display issues)
      setTimeout(() => {
        if (mapInstance.current) {
          mapInstance.current.invalidateSize();
        }
      }, 100);

      // Return cleanup function
      return () => {
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing map view:", err);
      const errorMsg = "Failed to initialize map view";
      setError(errorMsg);
      if (onError) onError(errorMsg);
    }
  }, [mapLocation.lat, mapLocation.lng, title, onError]);

  if (error) {
    return (
      <div className="border border-gray-200 bg-gray-50 rounded-md p-3 text-center text-gray-500 text-sm">
        <p>Unable to load map</p>
        <p className="mt-1">Please check your internet connection</p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-300">
      <div ref={mapRef} className="w-full" style={{ height }} />
    </div>
  );
};

export default MapView;
