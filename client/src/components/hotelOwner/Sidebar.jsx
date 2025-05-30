import React, { useState } from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Hotel Profile", path: "/owner/profile", icon: assets.homeIcon },
    { name: "Add Room", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Room", path: "/owner/list-room", icon: assets.listIcon },
    { name: "Bookings", path: "/owner/bookings", icon: assets.calenderIcon },
    { name: "Reviews", path: "/owner/reviews", icon: assets.starIconFilled },
  ];

  return (
    <div
      className={`${
        expanded ? "md:w-64" : "md:w-20"
      } w-20 border-r h-full bg-white text-base border-gray-200 pt-4 flex flex-col transition-all duration-300 relative`}
    >
      {/* Toggle expand button (visible only on md screens and up) */}
      <button
        className="hidden md:flex absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50"
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            expanded ? "rotate-0" : "rotate-180"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          ></path>
        </svg>
      </button>

      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end={item.path === "/owner"}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 md:px-6 gap-3 mb-1 mx-2 rounded-lg transition-all
            ${
              isActive
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
        >
          <div className="min-h-6 min-w-6 flex items-center justify-center">
            <img src={item.icon} alt={item.name} className="h-5 w-5" />
          </div>
          {expanded && (
            <p className="md:block hidden whitespace-nowrap overflow-hidden transition-all">
              {item.name}
            </p>
          )}

          {/* For mobile: show tooltip on hover */}
          {!expanded && (
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded hidden group-hover:block whitespace-nowrap">
              {item.name}
            </div>
          )}
        </NavLink>
      ))}

      <div className="mt-auto p-4 border-t border-gray-200">
        {expanded && (
          <div className="text-xs text-gray-500 mb-2 md:block hidden">
            Hotel Management System
          </div>
        )}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center font-medium">
            {expanded ? "HM" : "H"}
          </div>
          {expanded && (
            <p className="text-sm font-medium md:block hidden">Hotel Manager</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
