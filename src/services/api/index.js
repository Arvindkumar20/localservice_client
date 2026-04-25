import axios from "axios";

const API = axios.create({
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

// APIs
export const createAccount = (userCredentials) =>
  API.post("/auth/register", userCredentials);

export const loginUser = (userCredentials) =>
  API.post("/auth/login", userCredentials);

export const createProfessionalService = (data) =>
  API.post("/auth/register-profetionals", data);

export const getAllProfessionals = () => API.get("/professional");

export const getProfessionalById = (id) => API.get(`/professional/${id}`);

export const updateProfileApi = (formData) =>
  API.put("/user/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export default API;
