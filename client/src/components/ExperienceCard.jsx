import React from "react";
import { assets } from "../assets/assets";

const ExperienceCard = ({ experience }) => {
  const {
    id,
    title,
    location,
    duration,
    rating,
    reviews,
    price,
    image,
    category,
  } = experience;

  // Map categories to tailwind classes for badge colors
  const categoryColors = {
    adventure: "bg-orange-100 text-orange-800",
    culture: "bg-purple-100 text-purple-800",
    food: "bg-green-100 text-green-800",
    wellness: "bg-blue-100 text-blue-800",
    family: "bg-pink-100 text-pink-800",
  };

  // Map categories to readable names
  const categoryNames = {
    adventure: "Adventure",
    culture: "Cultural",
    food: "Food & Dining",
    wellness: "Wellness",
    family: "Family Friendly",
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div
          className={`absolute top-3 left-3 ${
            categoryColors[category] || "bg-gray-100 text-gray-800"
          } px-2 py-1 rounded-full text-xs font-medium`}
        >
          {categoryNames[category] || "Experience"}
        </div>
        <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full opacity-80 hover:opacity-100">
          <img src={assets.heartIcon} alt="favorite" className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-lg line-clamp-2">{title}</h3>
          <div className="bg-primary/10 text-primary font-medium px-2 py-1 rounded text-sm shrink-0 ml-2">
            ${price}
          </div>
        </div>

        <div className="flex items-center mt-2 text-sm text-gray-500">
          <img
            src={assets.locationIcon}
            alt="location"
            className="w-4 h-4 mr-1"
          />
          <span>{location}</span>
        </div>

        <div className="flex items-center mt-2 text-sm">
          <img
            src={assets.calenderIcon}
            alt="duration"
            className="w-4 h-4 mr-1"
          />
          <span className="text-gray-500">{duration}</span>
          <div className="mx-2 h-1 w-1 bg-gray-300 rounded-full"></div>
          <div className="flex items-center">
            <img
              src={assets.starIconFilled}
              alt="rating"
              className="w-4 h-4 mr-1"
            />
            <span className="font-medium">{rating}</span>
            <span className="text-gray-500 ml-1">({reviews})</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="text-xs text-gray-500">Available year-round</div>
          <button className="text-primary text-sm font-medium hover:underline flex items-center">
            View Details
            <img
              src={assets.arrowIcon}
              alt="arrow"
              className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
