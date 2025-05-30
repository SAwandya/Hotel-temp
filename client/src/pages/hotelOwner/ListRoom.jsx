import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { axios, getToken, user } = useAppContext();

  // Fetch rooms of the hotel owner
  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching rooms for hotel owner");
      const { data } = await axios.get("/api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        console.log(`Successfully loaded ${data.rooms.length} rooms`);
        setRooms(data.rooms);
      } else {
        console.error("Failed to fetch rooms:", data.message);
        setError(data.message || "Failed to fetch rooms");
        toast.error(data.message || "Failed to fetch rooms");
      }
    } catch (error) {
      console.error("Error fetching rooms:", error);
      setError("Error connecting to server");
      toast.error(error.message || "Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  // Toggle Availability of the Room
  const toggleAvailability = async (roomId) => {
    try {
      const { data } = await axios.post(
        "/api/rooms/toggle-availability",
        { roomId },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message || "Failed to toggle availability");
      }
    } catch (error) {
      console.error("Error toggling availability:", error);
      toast.error(error.message || "Error updating room");
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <Title
        align="left"
        font="outfit"
        title="Room Listing"
        subTitle="View, edit, or manage all listed rooms. Keep the information up to date
      to provide the best experience for users."
      />

      <div className="flex justify-between items-center mt-8 mb-4">
        <p className="text-gray-700 font-medium">All Rooms ({rooms.length})</p>
        <Link
          to="/owner/add-room"
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dull transition-all text-sm"
        >
          + Add New Room
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-red-50 rounded-lg mt-3">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={fetchRooms}
            className="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull"
          >
            Try Again
          </button>
        </div>
      ) : rooms.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room Type
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider max-sm:hidden">
                  Amenities
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price / Night
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-3 px-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {rooms.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.roomType}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
                    {item.amenities && item.amenities.length > 0
                      ? item.amenities.slice(0, 2).join(", ") +
                        (item.amenities.length > 2 ? "..." : "")
                      : "No amenities listed"}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
                    ${item.pricePerNight}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center text-sm">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isAvailable ? "Available" : "Not Available"}
                    </span>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center text-sm">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        onChange={() => toggleAvailability(item._id)}
                        type="checkbox"
                        className="sr-only peer"
                        checked={item.isAvailable}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full 
                        peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                        after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 
                        after:transition-all peer-checked:bg-primary"
                      ></div>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-900">
            No rooms found
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first room.
          </p>
          <div className="mt-6">
            <Link
              to="/owner/add-room"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dull focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Add New Room
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListRoom;
