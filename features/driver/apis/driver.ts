import ENV from "@/config/env";
import { logApiResponse } from "@/utils/logApiResponse";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET DRIVER DASHBOARD STATS
export const getDriverDashboardStats = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/driver/dashboard-stats`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });

  return response.status === 200 && response.data?.success ? response.data.data : null;
};

// GET ACTIVE ASSIGNED ORDERS
export const getDriverActiveAssignedOrders = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/driver/active-assigned-orders`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  logApiResponse("Driver Active Orders", response.data);
  return response.status === 200 && response.data?.success ? response.data.data : [];
};

// UPDATE DRIVER ONLINE/OFFLINE AVAILABILITY STATUS
export const updateDriverStatus = async (token: string, status: "available" | "offline") => {
  const response = await axios.post(
    `${API_BASE_URL}/v1.0/driver/status`,
    { status },
    {
      headers: {
        ...getHeaders(token),
        "Content-Type": "application/json",
      },
      validateStatus: () => true,
    },
  );
  if (response.status === 200 && response.data?.success) {
    return response.data;
  } else {
    throw response;
  }
};

// UPDATE DRIVER ORDER LIFECYCLE STATUS (e.g. accepted, picked_up, on_route, arrived, delivered)
export const updateDriverOrderStatus = async (
  token: string,
  orderId: string | number,
  formData: FormData,
) => {
  const response = await axios.post(`${API_BASE_URL}/v1.0/driver/order/status/${orderId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      // Note: Do NOT set Content-Type header; axios sets the multipart boundary automatically
    },
    validateStatus: () => true,
  });
  if (response.status === 200 && response.data?.success) {
    return response.data;
  } else {
    throw response;
  }
};
