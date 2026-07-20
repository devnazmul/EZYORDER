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
    queryFn: async () => {
      const data = await getNotifications(token);
      return data?.notifications?.data || [];
    },
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
    mutationFn: async () => {
      const notifications = queryClient.getQueryData<any[]>(["notifications"]) || [];
      const unreadIds = notifications
        .filter((item: any) => (item.status || "").toLowerCase().trim() === "unread")
        .map((item: any) => item.id);
      
      if (unreadIds.length > 0) {
        return markAllAsRead(token, unreadIds);
      }
      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    },
  });
};

