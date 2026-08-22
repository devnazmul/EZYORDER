import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL USERS
export const getUsers = async (token: string, params: Record<string, any> = {}) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/users`, {
    headers: getHeaders(token),
    params,
    validateStatus: () => true,
  });
  console.log("Users data", response.data);
  return response.status === 200 && response.data?.success ? response.data : [];
};

// GET SINGLE OWNER PROFILE
export const getOwnerProfile = async (token: string, id: string | number) => {
  const response = await axios.get(`${API_BASE_URL}/owner/${id}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  console.log("Owner profile data", response.data);
  return response.status === 200 && response.data ? response.data : null;
};
