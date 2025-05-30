import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets, cities } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import MapPicker from "../../components/MapPicker";

const HotelProfile = () => {
  const { axios, getToken } = useAppContext();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    city: "",
    destination: "",
    location: { lat: 0, lng: 0 },
  });

  const fetchHotelProfile = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/hotels/profile", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setHotel(data.hotel);
        setFormData({
          name: data.hotel.name,
          address: data.hotel.address,
          contact: data.hotel.contact,
          city: data.hotel.city,
          destination: data.hotel.destination || "",
          location: data.hotel.location || { lat: 0, lng: 0 },
        });

        // If hotel has location, show the map by default
        if (
          data.hotel.location &&
          (data.hotel.location.lat !== 0 || data.hotel.location.lng !== 0)
        ) {
          setShowMap(true);
        }
      } else {
        toast.error(data.message || "Failed to fetch hotel profile");
      }
    } catch (error) {
      toast.error("Error loading hotel profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotelProfile();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLocationSelect = (newLocation) => {
    setFormData((prev) => ({
      ...prev,
      location: newLocation,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const { data } = await axios.put("/api/hotels/update", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Hotel profile updated successfully");
        setHotel({
          ...hotel,
          ...formData,
        });
      } else {
        toast.error(data.message || "Failed to update hotel profile");
      }
    } catch (error) {
      toast.error("Error updating hotel profile");
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Hotel Profile"
        subTitle="Manage your hotel's information and keep your details up to date for guests."
      />

      {hotel ? (
        <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Hotel Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Number
              </label>
              <input
                type="text"
                id="contact"
                value={formData.contact}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="destination"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tourist Destination{" "}
                <span className="text-xs text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                id="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g. Near Grand Canyon, Beachfront, etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                This helps guests find your hotel when searching for specific
                attractions or locations
              </p>
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <select
                id="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Map Location */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Hotel Location on Map
              </label>
              <button
                type="button"
                onClick={() => setShowMap(!showMap)}
                className="text-sm text-primary hover:underline focus:outline-none"
              >
                {showMap ? "Hide Map" : "Show Map"}
              </button>
            </div>

            {showMap ? (
              <div className="mt-2">
                <MapPicker
                  initialLocation={formData.location}
                  onLocationSelect={handleLocationSelect}
                />
                <p className="text-xs text-gray-500 mt-1">
                  If the map doesn't load properly, ensure you've set up your
                  Google Maps API key.
                </p>
              </div>
            ) : (
              formData.location &&
              (formData.location.lat !== 0 || formData.location.lng !== 0) && (
                <p className="text-xs text-green-600 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Location has been set. Click "Show Map" to edit.
                </p>
              )
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={updating}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {updating ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center py-10 bg-gray-50 rounded-lg mt-6">
          <p className="text-gray-500">Hotel profile not found</p>
        </div>
      )}
    </div>
  );
};

export default HotelProfile;
