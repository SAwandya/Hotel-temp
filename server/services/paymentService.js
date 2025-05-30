// This is a simple mock payment service. In a real application,
// you would integrate with a payment gateway like Stripe or PayPal.

export const processPayment = async (amount, paymentMethod = "card") => {
  // Simulate payment processing
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate a successful payment 90% of the time
      const isSuccessful = Math.random() < 0.9;

      if (isSuccessful) {
        resolve({
          success: true,
          paymentId: "pay_" + Math.random().toString(36).substr(2, 9),
          amount,
          paymentMethod,
          message: "Payment processed successfully",
        });
      } else {
        resolve({
          success: false,
          message: "Payment processing failed. Please try again.",
        });
      }
    }, 1500); // Simulate network delay
  });
};

export const refundPayment = async (paymentId) => {
  // Simulate refund processing
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        refundId: "re_" + Math.random().toString(36).substr(2, 9),
        message: "Refund processed successfully",
      });
    }, 1000);
  });
};
