import { AUTH_ROUTES } from "@/constants";
import { authStore } from "@/utils";
import axios from "axios";
import { router } from "expo-router";
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
    // Dynamically inject the token using authStore utility
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
  async (response) => {
    // Check if the backend auto-refreshed the token and sent a new one
    const newAccessToken = response.headers["x-access-token"];

    if (newAccessToken) {
      // Automatically update stored token with the new access token
      await authStore.setToken(newAccessToken);
    }

    return response;
  },
  async (error) => {
    // 401 means BOTH access token AND refresh token are expired or invalid
    if (error.response?.status === 401) {
      await authStore.clearSession();

      // Redirect to login screen
      try {
        router.replace(AUTH_ROUTES.LOGIN);
      } catch (navError) {
        console.warn("Failed to redirect to login on 401:", navError);
      }
    }

    throw error;
  },
);

export default axiosClient;
