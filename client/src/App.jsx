import React from "react";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import AllRooms from "./pages/AllRooms";
import RoomDetails from "./pages/RoomDetails";
import MyBookings from "./pages/MyBookings";
import MyReviews from "./pages/MyReviews";
import Experience from "./pages/Experience"; // Add this import
import HotelReg from "./components/HotelReg";
import Layout from "./pages/hotelOwner/Layout";
import Dashboard from "./pages/hotelOwner/Dashboard";
import AddRoom from "./pages/hotelOwner/AddRoom";
import ListRoom from "./pages/hotelOwner/ListRoom";
import BookingManagement from "./pages/hotelOwner/BookingManagement";
import HotelProfile from "./pages/hotelOwner/HotelProfile";
import HotelReviews from "./pages/hotelOwner/HotelReviews";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";
import About from "./pages/About"; // Add this import
import EditRoom from "./pages/hotelOwner/EditRoom"; // Import the EditRoom component

const App = () => {
  const isOwnerPath = useLocation().pathname.includes("owner");
  const { showHotelReg } = useAppContext();

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      {!isOwnerPath && <Navbar />}
      {showHotelReg && <HotelReg />}
      <div className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<AllRooms />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/about" element={<About />} /> {/* Add this route */}
          <Route path="/owner" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<HotelProfile />} />
            <Route path="add-room" element={<AddRoom />} />
            <Route path="list-room" element={<ListRoom />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="reviews" element={<HotelReviews />} />
            <Route path="edit-room/:id" element={<EditRoom />} />{" "}
            {/* Add this route */}
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;
