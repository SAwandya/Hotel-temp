import React, { useState, useEffect } from "react";
import { assets, cities } from "../assets/assets";
import Title from "../components/Title";
import { useAppContext } from "../context/AppContext";
import HotelCard from "../components/HotelCard";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import PriceRangeSlider from "../components/PriceRangeSlider";

const AllRooms = () => {
  const { axios } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(100);

  const filterRooms = async () => {
    try {
      setLoading(true);
      let url = "/api/rooms?";
      if (city) url += `city=${city}&`;
      if (min > 20) url += `minPrice=${min}&`;
      if (max < 100) url += `maxPrice=${max}&`;

      console.log("Fetching rooms with URL:", url);
      const { data } = await axios.get(url);

      if (data.success) {
        console.log(
          `Rooms data loaded: ${
            data.rooms && data.rooms.length ? data.rooms.length : 0
          } rooms`
        );
        setRooms(data.rooms);
      } else {
        console.error("Failed to load rooms:", data.message);
        toast.error(data.message || "Failed to load rooms");
      }
    } catch (error) {
      console.error("Error loading rooms:", error);
      toast.error("Error loading rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ city });
    filterRooms();
  };

  const handlePriceChange = ([newMin, newMax]) => {
    setMin(newMin);
    setMax(newMax);
  };

  useEffect(() => {
    filterRooms();
  }, []);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="All Rooms"
        align="center"
        font="playfair"
        subTitle="Explore our extensive collection of comfortable, stylish, and unforgettable rooms. 
        Find the perfect place to stay during your trip"
      />

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 mb-7 w-full max-w-4xl mx-auto rounded-lg shadow-sm p-4 mt-12">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-4 md:gap-8"
        >
          <div className="flex flex-grow w-full sm:pr-2 sm:border-r border-gray-300 gap-3 items-center">
            <img
              alt="location-icon"
              src={assets.locationIcon}
              className="h-6 ml-3"
            />
            <select
              className="px-2 py-3 outline-none bg-transparent w-full text-gray-900 rounded-md"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city, index) => (
                <option value={city} key={index}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="ml-auto bg-primary text-white hover:bg-primary-dull transition-all py-3 px-9 rounded-lg font-medium text-base sm:min-w-32"
          >
            Search
          </button>
        </form>
      </div>

      <div className="max-w-6xl mx-auto flex gap-6 mt-8 flex-col md:flex-row">
        {/* Filter Section */}
        <div className="w-full md:w-1/4 p-5 border border-gray-200 rounded-lg h-fit bg-white shadow-sm">
          <h4 className="font-medium text-gray-700 mb-4 text-lg">Filters</h4>

          <div className="mb-6">
            <h5 className="font-medium text-gray-700 mb-2">Price Range</h5>
            <PriceRangeSlider
              defaultValues={[min, max]}
              onChange={handlePriceChange}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <p>${min}</p>
              <p>${max}</p>
            </div>
          </div>

          <button
            className="w-full mt-4 bg-primary text-white py-2.5 rounded-md hover:bg-primary-dull transition-all"
            onClick={() => filterRooms()}
          >
            Apply Filters
          </button>
        </div>

        {/* Room Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-60">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : rooms && rooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room, index) => (
                <div key={room._id} className="h-full">
                  <HotelCard room={room} index={index} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-lg">
              <img
                src={assets.homeIcon}
                alt="No rooms"
                className="w-16 h-16 mx-auto mb-4 opacity-30"
              />
              <p className="text-gray-500 text-lg">
                No rooms found matching your criteria.
              </p>
              <p className="text-gray-400 mt-2">
                Try adjusting your filters or search for a different city.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
