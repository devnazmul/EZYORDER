import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  forgotPassword,
  IForgotPasswordResponse,
  ILoginResponse,
  loginUser,
} from "../../apis";
import { ILoginFormData } from "../../schema";

export const useLoginMutation = (
  onSuccess: (response: ILoginResponse) => void,
  onError: (error: AxiosError | Error) => void,
) => {
  return useMutation({
    mutationFn: (payload: ILoginFormData) => loginUser(payload),
    onSuccess,
    onError,
  });
};

export const useForgotPasswordMutation = (
  onSuccess: (response: IForgotPasswordResponse) => void,
  onError: (error: AxiosError | Error) => void,
) => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess,
    onError,
  });
};
