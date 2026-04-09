// services/professional.service.js

import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const professionalService = {
  // Create professional profile with services
  createProfessionalProfile: async (data) => {
    const response = await API.post("/professionals/profile", data);
    console.log(response);
    return response.data;
  },

  // Add new service to existing professional
  addService: async (professionalId, data) => {
    const response = await API.post(
      `/professionals/${professionalId}/services`,
      data,
    );
    return response.data;
  },
    getProfessionalProfile: async () => {
    const response = await API.get(
      `/professionals/profile`,
  
    );
    console.log(response)
    return response.data;
  },

  // Update service
  updateService: async (serviceId, data) => {
    const response = await API.put(
      `/professionals/services/${serviceId}`,
      data,
    );
    return response.data;
  },

  // Add availability to service
  addAvailability: async (serviceId, data) => {
    const response = await API.post(
      `/professionals/services/${serviceId}/availability`,
      data,
    );
    return response.data;
  },

  // Update professional profile
  updateProfessionalProfile: async (professionalId, data) => {
    const response = await API.put(
      `/professionals/profile/${professionalId}`,
      data,
    );
    return response.data;
  },
};

export const getServices = async () => {
  const response = await API.get(`/professionals/services`);
  return response.data;
};

export const // Get professional profile
  getProfessionalProfile = async () => {
    const response = await API.get(`/professionals/profile}`);
    return response.data;
  };

// Delete service
export const deleteService = async (serviceId) => {
  const response = await API.delete(`/professionals/services/${serviceId}`);
  return response.data;
};
