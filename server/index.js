import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import hotelRouter from "./routes/hotelRoutes.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});

app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
