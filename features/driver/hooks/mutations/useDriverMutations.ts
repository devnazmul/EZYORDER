import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDriverStatus, updateDriverOrderStatus } from "../../apis/driver";

export const useUpdateDriverStatusMutation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "available" | "offline") => updateDriverStatus(token, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverDashboardStats"] });
    },
  });
};

export const useUpdateDriverOrderStatusMutation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, formData }: { orderId: string | number; formData: FormData }) =>
      updateDriverOrderStatus(token, orderId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["driverActiveAssignedOrders"] });
      queryClient.invalidateQueries({ queryKey: ["driverDashboardStats"] });
    },
  });
};
