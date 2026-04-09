// hooks/useUpdatePayment.js

import { updatePaymentStatus } from "@/services/api/bookingsApi";
import { useState } from "react";


export const useUpdatePayment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updatePayment = async (bookingId, payload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await updatePaymentStatus(bookingId, payload);

      setSuccess(true);
      return response;

    } catch (err) {
      console.error("Payment update error:", err);
      setError(err.response?.data?.message || "Something went wrong");
      throw err;

    } finally {
      setLoading(false);
    }
  };

  return {
    updatePayment,
    loading,
    error,
    success,
  };
};