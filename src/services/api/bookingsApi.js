// services/api.js

import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
  // if you're using cookies
});

// 🔐 Request Interceptor (Attach Token)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ⚠️ Response Interceptor (Handle errors globally)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.log("Unauthorized - Redirect to login");
      // Optional: redirect or logout user
    }

    return Promise.reject(error);
  },
);

// ✅ Create Booking
export const createBooking = async (data) => {
  const res = await API.post("/booking", data);
  return res.data;
};

// ✅ Get Logged-in User Bookings
export const getUserBookings = async () => {
  const res = await API.get("/booking/bookings");
  return res.data;
};

// ✅ Get Booking by ID
export const getBookingById = async (id) => {
  const res = await API.get(`/bookings/${id}`);
  return res.data;
};

// ✅ Cancel Booking
export const cancelBooking = async (id) => {
  const res = await API.put(`/bookings/${id}/cancel`);
  return res.data;
};

// ✅ Update Payment Status

// ✅ Get Available Time Slots
export const getAvailableTimeSlots = async (params) => {
  const res = await API.get("/booking/available-slots", { params });
  return res.data;
};

// services/adminBooking.service.js

// ✅ Get All Bookings (Admin)
export const getAllBookings = async () => {
  const res = await API.get("/booking/admin/bookings");
  return res.data;
};

// ✅ Update Booking Status (Admin)
export const updateBookingStatus = async (id, data) => {
  const res = await API.put(`/booking/admin/bookings/${id}/status`, data);
  return res.data;
};

export const updatePaymentStatus = async (id, data) => {
  const res = await API.put(`/booking/bookings/${id}/payment`, data);
  return res.data;
};
