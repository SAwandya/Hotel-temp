import React from "react";
import { Link } from "react-router-dom";
import { assets } from "../../assets/assets";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between px-6 border-b border-gray-200 py-3 bg-white transition-all duration-300 shadow-sm">
      <Link to="/owner" className="flex items-center gap-2">
        <img src={assets.logo} alt="logo" className="h-8 invert opacity-80" />
        <span className="font-medium text-gray-800 hidden sm:block">
          Hotel Management
        </span>
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-600 hover:text-primary">
          View Website
        </Link>

        <div className="h-4 border-r border-gray-300"></div>

        <div className="relative">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
