import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/context/AuthContext";
import {
  getNotifications,
  markAllAsRead,
  markNotificationAsRead,
} from "../../apis/notification";

export const useNotificationsQuery = () => {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const data = await getNotifications(token!);
      return {
        list: data?.notifications?.data || [],
        unreadCount: Number(
          data?.total_unread_count ?? data?.unread_count ?? 0,
        ),
      };
    },
    enabled: !!token,
  });
};

export const useMarkNotificationAsReadMutation = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string | number) =>
      markNotificationAsRead(token!, notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useMarkAllAsReadMutation = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const notificationData = queryClient.getQueryData<any>(["notifications"]);
      const notifications = notificationData?.list || [];
      const unreadIds = notifications
        .filter(
          (item: any) => (item.status || "").toLowerCase().trim() === "unread",
        )
        .map((item: any) => item.id);

      if (unreadIds.length > 0) {
        return markAllAsRead(token!, unreadIds);
      }
      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
