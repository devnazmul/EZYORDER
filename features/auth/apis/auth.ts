import axios from "axios";
import ENV from "@/config/env";

const API_BASE_URL = ENV.API_BASE_URL;

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/auth`,
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      validateStatus: () => true,
    }
  );

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw response;
  }
};

export const forgotPassword = async (email: string) => {
  const response = await axios.post(
    `${API_BASE_URL}/v1.0/forget-password`,
    {
      email,
      client_site: "dashboard",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      validateStatus: () => true,
    }
  );

  if (response.status >= 200 && response.status < 300) {
    return response.data;
  } else {
    throw response;
  }
};
