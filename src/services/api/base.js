// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  withCredentials: true, // if you're using cookies
});

// 🔐 Request Interceptor (Attach Token)
API.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

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
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    
    if (error.response?.status === 403) {
      console.log("Forbidden - Insufficient permissions");
    //   toast.error("You don't have permission to perform this action");
    }

    return Promise.reject(error);
  },
);

export default API;