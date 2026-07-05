import ENV from "@/config/env";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getNotifications = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/notification`, {
    headers: getHeaders(token),
    validateStatus: () => true,
  });

  return (response.status === 200 && response.data.content) || [];
};

export const getUnreadCount = async (token: string) => {
  //  FIX: Temporarily commented to test out unread counterEvent. Will be updated once the backend is set
  // const response = await axios.get(`${API_BASE_URL}/notification/unread-count`, {
  //   headers: getHeaders(token),
  //   validateStatus: () => true,
  // });
  // return response.data;

  return { count: 20 };
};

export const markNotificationAsRead = async (token: string, notificationId: string | number) => {
  const response = await axios.patch(
    `${API_BASE_URL}/notification/${notificationId}`,
    { status: "read", message: "read" },
    {
      headers: getHeaders(token),
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data?.success;
};

export const markAllAsRead = async (token: string) => {
  const response = await axios.patch(
    `${API_BASE_URL}/notification/read-all`,
    {},
    {
      headers: getHeaders(token),
      validateStatus: () => true,
    },
  );
  return response.status === 200 && response.data?.success;
};
