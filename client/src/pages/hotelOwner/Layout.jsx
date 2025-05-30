import React from "react";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";
import { Outlet } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useEffect } from "react";

const Layout = () => {
  const { isOwner, navigate } = useAppContext();

  useEffect(() => {
    if (!isOwner) {
      navigate("/");
    }
  }, [isOwner]);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Navbar />
      <div className="flex h-full overflow-hidden">
        <Sidebar />
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
