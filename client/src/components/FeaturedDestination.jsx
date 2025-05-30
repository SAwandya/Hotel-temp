import React, { useState, useEffect } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const FeaturedDestination = () => {
  const navigate = useNavigate();
  const { axios } = useAppContext();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms?featured=true&limit=4");

        if (response.data.success) {
          setRooms(response.data.rooms);
        } else {
          console.error("Failed to fetch featured rooms");
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRooms();
  }, []);

  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Featured Destination"
        subTitle="Travel the world through our exclusive portfolio of hotels, each promising remarkable stays and timeless memories."
      />

      {loading ? (
        <div className="flex justify-center items-center h-40 w-full mt-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {rooms.length > 0 ? (
            rooms.map((room, index) => (
              <HotelCard key={room._id} room={room} index={index} />
            ))
          ) : (
            <p className="text-gray-500">No featured rooms available</p>
          )}
        </div>
      )}

      <button
        onClick={() => {
          navigate("/rooms");
          scrollTo(0, 0);
        }}
        className="my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer"
      >
        Browse Every Destination
      </button>
    </div>
  );
};

export default FeaturedDestination;
