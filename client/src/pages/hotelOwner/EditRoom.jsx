import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useParams, useNavigate } from "react-router-dom";

const EditRoom = () => {
  const { axios, getToken } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [room, setRoom] = useState(null);

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Free Breakfast": false,
      "Room Service": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  // Fetch room data
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/rooms/${id}`);

        if (data.success) {
          setRoom(data.room);
          setExistingImages(data.room.images || []);

          // Set form inputs
          setInputs({
            roomType: data.room.roomType,
            pricePerNight: data.room.pricePerNight,
            amenities: {
              "Free Wifi": data.room.amenities.includes("Free Wifi"),
              "Free Breakfast": data.room.amenities.includes("Free Breakfast"),
              "Room Service": data.room.amenities.includes("Room Service"),
              "Mountain View": data.room.amenities.includes("Mountain View"),
              "Pool Access": data.room.amenities.includes("Pool Access"),
            },
          });
        } else {
          toast.error(data.message || "Failed to load room");
          navigate("/owner/list-room");
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        toast.error("Error loading room data");
        navigate("/owner/list-room");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoom();
    }
  }, [id, axios, navigate]);

  const handleImageChange = (e, key) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image size should be less than 2MB");
        return;
      }

      // Validate file type
      if (!file.type.match("image.*")) {
        toast.error("Please select an image file");
        return;
      }

      setNewImages({ ...newImages, [key]: file });
    }
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!inputs.roomType || !inputs.pricePerNight) {
      toast.error("Please fill in all the required details");
      return;
    }

    // Make sure there's at least one image (either existing or new)
    if (
      existingImages.length === 0 &&
      !Object.values(newImages).some((img) => img)
    ) {
      toast.error("Room must have at least one image");
      return;
    }

    setUpdating(true);

    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);

      // Convert amenities to array & keep only enabled amenities
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));

      // Add existing images
      formData.append("existingImages", JSON.stringify(existingImages));

      // Add any new images
      Object.keys(newImages).forEach((key) => {
        newImages[key] && formData.append("images", newImages[key]);
      });

      const { data } = await axios.put(`/api/rooms/${id}`, formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success(data.message || "Room updated successfully");
        navigate("/owner/list-room");
      } else {
        toast.error(data.message || "Failed to update room");
      }
    } catch (error) {
      console.error("Error updating room:", error);
      toast.error("Error updating room");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmitHandler}
      className="bg-white rounded-lg shadow-sm p-6"
    >
      <Title
        align="left"
        font="outfit"
        title="Edit Room"
        subTitle="Update your room details to improve guest experience and maximize bookings."
      />

      {/* Display Existing Images */}
      <div className="mt-8">
        <p className="text-gray-800 font-medium mb-2">Current Room Images</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-2">
          {existingImages.map((image, index) => (
            <div
              key={`existing-${index}`}
              className="relative border-2 border-gray-200 rounded-lg overflow-hidden aspect-square"
            >
              <img
                src={image}
                alt={`Room ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removeExistingImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upload New Images */}
      <div className="mt-6">
        <p className="text-gray-800 font-medium mb-2">Add New Images</p>
        <p className="text-sm text-gray-500 mb-3">
          Upload additional images or replacements
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-2">
          {Object.keys(newImages).map((key) => (
            <div
              key={`new-${key}`}
              className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden aspect-square flex flex-col items-center justify-center transition-all hover:border-primary cursor-pointer bg-gray-50"
            >
              <input
                type="file"
                accept="image/*"
                id={`roomImages${key}`}
                className="hidden"
                onChange={(e) => handleImageChange(e, key)}
              />
              <label
                htmlFor={`roomImages${key}`}
                className="w-full h-full cursor-pointer flex flex-col items-center justify-center"
              >
                {newImages[key] ? (
                  <>
                    <img
                      src={URL.createObjectURL(newImages[key])}
                      alt={`New room image ${key}`}
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setNewImages({ ...newImages, [key]: null });
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-4">
                    <img
                      src={assets.uploadArea}
                      alt="Upload"
                      className="w-10 h-10 mb-2 opacity-50"
                    />
                    <p className="text-xs text-center text-gray-500">
                      Click to upload
                    </p>
                  </div>
                )}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div>
          <p className="text-gray-800 font-medium mb-2">Room Type</p>
          <select
            value={inputs.roomType}
            onChange={(e) => setInputs({ ...inputs, roomType: e.target.value })}
            className="border border-gray-300 rounded p-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Room">Family Room</option>
          </select>
        </div>

        <div>
          <p className="text-gray-800 font-medium mb-2">
            Price <span className="text-sm text-gray-500">/Night</span>
          </p>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              $
            </span>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 rounded p-2.5 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={inputs.pricePerNight}
              min="0"
              onChange={(e) =>
                setInputs({ ...inputs, pricePerNight: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <p className="text-gray-800 font-medium mb-2">Amenities</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
          {Object.keys(inputs.amenities).map((amenity, index) => (
            <div
              key={index}
              className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                inputs.amenities[amenity]
                  ? "bg-primary/5 border-primary"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() =>
                setInputs({
                  ...inputs,
                  amenities: {
                    ...inputs.amenities,
                    [amenity]: !inputs.amenities[amenity],
                  },
                })
              }
            >
              <input
                type="checkbox"
                id={`amenities${index + 1}`}
                checked={inputs.amenities[amenity]}
                className="w-4 h-4 accent-primary"
                onChange={() => {}} // Handle in parent div onClick
              />
              <label
                htmlFor={`amenities${index + 1}`}
                className={`cursor-pointer ${
                  inputs.amenities[amenity]
                    ? "font-medium text-primary"
                    : "text-gray-600"
                }`}
              >
                {amenity}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 mt-8">
        <button
          type="button"
          onClick={() => navigate("/owner/list-room")}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="flex-1 bg-primary text-white px-8 py-3 rounded-lg cursor-pointer hover:bg-primary-dull transition-all duration-300 flex items-center justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
          disabled={updating}
        >
          {updating ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Updating Room...
            </>
          ) : (
            "Update Room"
          )}
        </button>
      </div>
    </form>
  );
};

export default EditRoom;
