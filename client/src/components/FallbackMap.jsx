import React from "react";
import { assets } from "../assets/assets";

const FallbackMap = ({ height = "250px", title = "", address = "" }) => {
  return (
    <div
      className="w-full rounded-lg overflow-hidden border border-gray-300 bg-gray-100 flex flex-col items-center justify-center"
      style={{ height }}
    >
      <img
        src={assets.locationFilledIcon || "/location-icon.svg"}
        alt="Location"
        className="w-12 h-12 text-gray-400 mb-3 opacity-50"
      />

      {title && <p className="font-medium text-gray-700 mb-1">{title}</p>}
      {address && (
        <p className="text-gray-500 text-sm text-center px-4">{address}</p>
      )}

      <div className="mt-4 px-3 py-1.5 bg-white rounded-full text-xs text-gray-500">
        Map view not available
      </div>
    </div>
  );
};

export default FallbackMap;
