import { authStore } from "@/utils";
import axios from "axios";
import ENV from "./env";

const axiosClient = axios.create({
  baseURL: ENV.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    // Dynamically inject the token using your existing authStore utility
    const token = await authStore.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    // You can handle global response transformations or token refresh logic here
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default axiosClient;
