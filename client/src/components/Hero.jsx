import React, { useState } from "react";
import { assets, cities } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Hero = () => {
  const navigate = useNavigate();
  const { axios, getToken, user } = useAppContext();

  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setSearchData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      // Validate dates
      const checkIn = new Date(searchData.checkIn);
      const checkOut = new Date(searchData.checkOut);

      if (checkIn >= checkOut) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      if (checkIn < new Date().setHours(0, 0, 0, 0)) {
        toast.error("Check-in date cannot be in the past");
        return;
      }

      // Save search to user's recent searches
      if (user && searchData.destination) {
        await axios.post(
          "/api/user/recent-search",
          { city: searchData.destination },
          { headers: { Authorization: `Bearer ${await getToken()}` } }
        );
      }

      // Navigate to search results with query params
      navigate(
        `/rooms?destination=${searchData.destination}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center
    h-screen'
    >
      <p className="bg-[#49b9ff]/50 px-3.5 py-1 rounded-full mt-20]">
        Experience Unmatched Luxury and Personalized Hospitality at Every Step
        of Your Stay
      </p>
      <h1 className="font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:fontfair-extrabold max-w-xl mt-4">
        Your Dream Getaway Starts Here
      </h1>
      <p className="max-w-130 mt-2 text-sm md:text-base">
        Escape to a place where comfort meets charm, and every moment is crafted
        for relaxation and discovery. Whether you're seeking a romantic retreat,
        a family adventure, or a serene solo escape, our hotel is your perfect
        getaway destination. Let us turn your stay into something truly
        unforgettable.
      </p>

      <form
        onSubmit={handleSearch}
        className="bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto"
      >
        <div>
          <div className="flex items-center gap-2">
            <img src={assets.locationIcon} alt="" className="h-4" />
            <label htmlFor="destination">Destination</label>
          </div>
          <input
            list="destinations"
            id="destination"
            type="text"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            placeholder="Type here"
            value={searchData.destination}
            onChange={handleInputChange}
            required
          />
          <datalist id="destinations">
            {cities.map((city, index) => (
              <option value={city} key={index} />
            ))}
          </datalist>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkIn">Check in</label>
          </div>
          <input
            id="checkIn"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            value={searchData.checkIn}
            onChange={handleInputChange}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <img src={assets.calenderIcon} alt="" className="h-4" />
            <label htmlFor="checkOut">Check out</label>
          </div>
          <input
            id="checkOut"
            type="date"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
            value={searchData.checkOut}
            onChange={handleInputChange}
            min={searchData.checkIn || new Date().toISOString().split("T")[0]}
            required
          />
        </div>

        <div className="flex md:flex-col max-md:gap-2 max-md:items-center">
          <label htmlFor="guests">Guests</label>
          <input
            min={1}
            max={10}
            id="guests"
            type="number"
            className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16"
            placeholder="1"
            value={searchData.guests}
            onChange={handleInputChange}
            required
          />
        </div>

        <button
          type="submit"
          className="flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1"
        >
          <img src={assets.searchIcon} alt="searchIcon" className="h-7" />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
};

export default Hero;
