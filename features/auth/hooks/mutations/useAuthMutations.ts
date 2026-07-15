import { useMutation } from "@tanstack/react-query";
import { loginUser, forgotPassword } from "../../apis/auth";

export const useLoginMutation = (onSuccess: (response: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn: ({ email, password }: any) => loginUser(email, password),
    onSuccess,
    onError,
  });
};

export const useForgotPasswordMutation = (onSuccess: (response: any) => void, onError: (error: any) => void) => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
    onSuccess,
    onError,
  });
};
