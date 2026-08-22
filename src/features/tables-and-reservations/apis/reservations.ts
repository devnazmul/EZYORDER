import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

// GET ALL RESERVATIONS
export const getReservations = async (token: string, params: Record<string, any> = {}) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/reservations`, {
    headers: getHeaders(token),
    params: {
      order_by: "reservation_date",
      sort_order: "desc",
      ...params,
    },
    validateStatus: () => true,
  });
  console.log(response);
  return response.status === 200 && response.data?.success ? response.data : null;
};

// GET SINGLE RESERVATION
export const getSingleReservation = async (token: string, id: number | string) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/reservations/single/${id}`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });
  return response.status === 200 && response.data?.success ? response.data.data : null;
};
