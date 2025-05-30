import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { assets } from "../assets/assets";

// Fix Leaflet's icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const MapPicker = ({ initialLocation, onLocationSelect, height = "400px" }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const [error, setError] = useState(null);

  // Default to a central location if none provided
  const defaultLocation = { lat: 40.7128, lng: -74.006 }; // New York City
  const location = initialLocation?.lat ? initialLocation : defaultLocation;

  // Initialize map on component mount
  useEffect(() => {
    // Don't create map if element isn't ready
    if (!mapRef.current) return;

    // Don't initialize map again if it's already created
    if (mapInstance.current) return;

    try {
      // Create map
      const map = L.map(mapRef.current).setView(
        [location.lat, location.lng],
        13
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Add marker
      const marker = L.marker([location.lat, location.lng], {
        draggable: true,
      }).addTo(map);

      // Handle map click events
      map.on("click", (e) => {
        const newLocation = { lat: e.latlng.lat, lng: e.latlng.lng };
        marker.setLatLng(newLocation);

        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      });

      // Handle marker dragend events
      marker.on("dragend", () => {
        const latlng = marker.getLatLng();
        const newLocation = { lat: latlng.lat, lng: latlng.lng };

        if (onLocationSelect) {
          onLocationSelect(newLocation);
        }
      });

      // Store instances in refs
      mapInstance.current = map;
      markerInstance.current = marker;

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
          markerInstance.current = null;
        }
      };
    } catch (err) {
      console.error("Error initializing map:", err);
      setError("Failed to initialize map");
    }
  }, []);

  // Update marker when initialLocation changes
  useEffect(() => {
    if (
      !markerInstance.current ||
      !initialLocation?.lat ||
      !initialLocation?.lng
    )
      return;

    const currentPosition = markerInstance.current.getLatLng();

    // Only update if position actually changed
    if (
      currentPosition.lat !== initialLocation.lat ||
      currentPosition.lng !== initialLocation.lng
    ) {
      markerInstance.current.setLatLng([
        initialLocation.lat,
        initialLocation.lng,
      ]);

      // Pan map to new location
      if (mapInstance.current) {
        mapInstance.current.panTo([initialLocation.lat, initialLocation.lng]);
      }
    }
  }, [initialLocation]);

  if (error) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-md p-4 text-center text-red-500">
        {error}
        <p className="text-sm mt-2">
          There was a problem loading the map. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        ref={mapRef}
        className="w-full rounded-lg overflow-hidden border border-gray-300"
        style={{ height }}
      />
      <p className="text-xs text-gray-500 mt-1">
        Click on the map or drag the marker to set your hotel's location.
      </p>
    </div>
  );
};

export default MapPicker;
