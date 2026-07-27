import ENV from "@/config/env";
import { logApiResponse } from "@/utils/logApiResponse";
import axios from "axios";

const API_BASE_URL = ENV.API_BASE_URL;

const getHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const registerDeviceToken = async (token: string, deviceToken: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/v1.0/register-device-token`,
    { device_token: deviceToken },
    {
      headers: getHeaders(token),
      validateStatus: () => true,
    },
  );

  logApiResponse("REGISTER DEVICE TOKEN RESPONSE: ", response.data);

  return response.status === 200 && response.data?.success;
};

export const unregisterDeviceToken = async (token: string, deviceToken: string) => {
  const response = await axios.delete(`${API_BASE_URL}/v1.0/register-device-token`, {
    headers: getHeaders(token),
    data: { device_token: deviceToken },
    validateStatus: () => true,
  });

  logApiResponse("UNREGISTER DEVICE TOKEN RESPONSE: ", response.data);

  return response.status === 200 && response.data?.success;
};

export const getNotifications = async (
  token: string,
  page: number = 1,
  perPage: number = 50,
  status?: string,
) => {
  const response = await axios.get(`${API_BASE_URL}/v1.0/notifications`, {
    headers: getHeaders(token),
    params: {
      page,
      per_page: perPage,
      order_by: "desc",
      ...(status ? { status } : {}),
    },
    validateStatus: () => true,
  });

  logApiResponse("GET NOTIFICATIONS RESPONSE: ", response.data);

  if (response.status === 200 && response.data?.success) {
    return response.data.data;
  }
  return null;
};

export const changeNotificationStatus = async (token: string, notificationIds: (string | number)[]) => {
  const response = await axios.put(
    `${API_BASE_URL}/v1.0/notifications/change-status`,
    { notification_ids: notificationIds },
    {
      headers: getHeaders(token),
      validateStatus: () => true,
    },
  );

  logApiResponse("CHANGE NOTIFICATION STATUS RESPONSE: ", response.data);

  return response.status === 200 && response.data?.success;
};

export const markNotificationAsRead = async (token: string, notificationId: string | number) => {
  return changeNotificationStatus(token, [notificationId]);
};

export const markAllAsRead = async (token: string, notificationIds: (string | number)[]) => {
  return changeNotificationStatus(token, notificationIds);
};
