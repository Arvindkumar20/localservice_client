// services/professional.service.js

import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL,
});

// Request Interceptor

// Response Interceptor

export const loadAllServices = async () => {
  const response = await API.get(`/customer/all-services`);
  return response.data;
};
export const getAllProfessionals = async (params) => {
  const res = await API.get("/customer/professionals", { params });
  return res.data;
};
export const getAllServicesCategories = async () => {
  const res = await API.get("/customer/services-categories");
  return res.data;
};
