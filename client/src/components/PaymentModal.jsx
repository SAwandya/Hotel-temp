import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const { axios, getToken } = useAppContext();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/bookings/process-payment",
        {
          bookingId: booking._id,
          paymentMethod,
        },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success("Payment successful!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(data.message || "Payment failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during payment processing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Payment</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">Room: {booking.room.roomType}</p>
            <p className="text-gray-600 mb-2">Hotel: {booking.hotel.name}</p>
            <p className="text-gray-600 mb-2">
              Dates: {new Date(booking.checkInDate).toLocaleDateString()} -{" "}
              {new Date(booking.checkOutDate).toLocaleDateString()}
            </p>
            <p className="text-xl font-bold mt-4">
              Total: ${booking.totalPrice}
            </p>
          </div>

          <form onSubmit={handlePayment}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2 font-medium">
                Select Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                    className="mr-2"
                  />
                  <span>Credit/Debit Card</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                    className="mr-2"
                  />
                  <span>PayPal</span>
                </label>
              </div>
            </div>

            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-gray-700 mb-1 text-sm">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm">
                      CVC
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:bg-gray-400"
              >
                {loading ? "Processing..." : `Pay $${booking.totalPrice}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
