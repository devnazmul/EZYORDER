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
  try {
    const response = await axios.get(`${API_BASE_URL}/notification`, {
      headers: getHeaders(token),
      validateStatus: () => true,
    });
    if (response.status === 200 && Array.isArray(response.data?.content)) {
      const unread = response.data.content.filter((item: any) => item.status !== "read");
      return { count: unread.length };
    }
  } catch (error) {
    console.error("Error fetching unread count:", error);
  }

  return { count: 10 };
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
