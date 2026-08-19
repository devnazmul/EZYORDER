import axiosClient from "@/config/axiosClient";
import { ILoginFormData } from "../schema";

export interface ILoginResponse {
  token?: string;
  [key: string]: any;
}

export interface IForgotPasswordResponse {
  message?: string;
  [key: string]: any;
}

export const loginUser = async (
  payload: ILoginFormData,
): Promise<ILoginResponse> => {
  const response = await axiosClient.post("/auth", payload);
  return response.data;
};

export const forgotPassword = async (
  email: string,
): Promise<IForgotPasswordResponse> => {
  const response = await axiosClient.post("/v1.0/forget-password", {
    email,
    client_site: "dashboard",
  });
  return response.data;
};
