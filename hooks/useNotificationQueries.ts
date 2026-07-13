import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  getUnreadCount,
  markNotificationAsRead,
  markAllAsRead,
} from "@/apis/notification";

export const useNotificationsQuery = (token: string) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(token),
    enabled: !!token,
  });
};

export const useNotificationUnreadCountQuery = (token: string) => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: () => getUnreadCount(token),
    enabled: !!token,
  });
};

export const useMarkNotificationAsReadMutation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string | number) => markNotificationAsRead(token, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

export const useMarkAllAsReadMutation = (token: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllAsRead(token),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};
