const axios = require('axios');
const dotenv = require("dotenv").config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// Verify Payment Function
const verifyPayment = async (reference) => {
  try {
    const res = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      },
      timeout: 5000 // 5 seconds timeout
    });

    const { status, data } = res.data || {};

    if (status && data && data.status === "success") {
      return data;
    } else {
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error("Paystack API error:", error.response.data);
      throw new Error(`Payment verification failed: ${error.response.data.message}`);
    } else if (error.request) {
      console.error("No response received from Paystack:", error.request);
      throw new Error("Payment verification failed: No response from Paystack");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error("Payment verification failed");
    }
  }
};

module.exports = { verifyPayment };
