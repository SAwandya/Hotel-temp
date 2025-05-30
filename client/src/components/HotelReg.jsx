import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import MapPicker from "./MapPicker";

const HotelReg = () => {
  const { setShowHotelReg, axios, getToken, setIsOwner } = useAppContext();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [destination, setDestination] = useState("");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [showMap, setShowMap] = useState(false);

  const onSubmitHandler = async (event) => {
    try {
      event.preventDefault();
      const { data } = await axios.post(
        `/api/hotels/`,
        {
          name,
          contact,
          address,
          city,
          destination,
          location,
        },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsOwner(true);
        setShowHotelReg(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleLocationSelect = (newLocation) => {
    setLocation(newLocation);
  };

  return (
    <div
      onClick={() => setShowHotelReg(false)}
      className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center justify-center bg-black/70"
    >
      <form
        onSubmit={onSubmitHandler}
        onClick={(e) => e.stopPropagation()}
        className="flex bg-white rounded-xl max-w-4xl max-md:mx-2 max-h-[90vh] overflow-y-auto"
      >
        <div className="w-1/2 rounded-xl hidden md:block">
          <img
            src={assets.regImage}
            alt="reg-image"
            className="h-full object-cover rounded-l-xl"
          />
        </div>

        <div className="relative flex flex-col items-center md:w-1/2 p-8 md:p-10">
          <img
            src={assets.closeIcon}
            alt="close-icon"
            className="absolute top-4 right-4 h-4 w-4 cursor-pointer"
            onClick={() => setShowHotelReg(false)}
          />
          <p className="text-2xl font-semibold mt-6">Register Your Hotel</p>

          {/* hotel name */}
          <div className="w-full mt-4">
            <label htmlFor="name" className="font-medium text-gray-500">
              Hotel Name
            </label>
            <input
              id="name"
              onChange={(e) => setName(e.target.value)}
              value={name}
              type="text"
              placeholder="Type here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* phone */}
          <div className="w-full mt-4">
            <label htmlFor="contact" className="font-medium text-gray-500">
              Phone
            </label>
            <input
              id="contact"
              onChange={(e) => setContact(e.target.value)}
              value={contact}
              type="tel"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* Address */}
          <div className="w-full mt-4">
            <label htmlFor="address" className="font-medium text-gray-500">
              Address
            </label>
            <input
              id="address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              type="text"
              placeholder="Type Here"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
              required
            />
          </div>

          {/* Destination */}
          <div className="w-full mt-4">
            <label htmlFor="destination" className="font-medium text-gray-500">
              Tourist Destination{" "}
              <span className="text-xs text-gray-400">(optional)</span>
            </label>
            <input
              id="destination"
              onChange={(e) => setDestination(e.target.value)}
              value={destination}
              type="text"
              placeholder="e.g. Near Grand Canyon, Beachfront, etc."
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
            />
          </div>

          {/* Select City Drop Down */}
          <div className="w-full mt-4 max-w-600 mr-auto">
            <label htmlFor="city" className="font-medium text-gray-500">
              City
            </label>
            <select
              onChange={(e) => setCity(e.target.value)}
              value={city}
              id="city"
              className="border border-gray-200 rounded w-full px-3 py-2.5 mt-1 outline-indigo-500 font-light"
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

          {/* Location Map */}
          <div className="w-full mt-4">
            <button
              type="button"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center text-primary hover:underline mb-2"
            >
              <img
                src={assets.locationFilledIcon}
                alt="location"
                className="w-4 h-4 mr-1"
              />
              {showMap ? "Hide Map" : "Set Hotel Location on Map"}
            </button>

            {showMap && (
              <MapPicker
                initialLocation={location}
                onLocationSelect={handleLocationSelect}
                height="300px"
              />
            )}
          </div>

          <button className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white mr-auto px-6 py-2 rounded cursor-pointer mt-6">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelReg;
