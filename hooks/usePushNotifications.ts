import { registerDeviceToken } from "@/apis/notification";
import { useAuth } from "@/context/AuthContext";
import { logApiResponse } from "@/utils/logApiResponse";
import { useQueryClient } from "@tanstack/react-query";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

// Configure how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { token: userToken } = useAuth();

  const [deviceToken, setDeviceToken] = useState<string | null>(null);
  const registeredTokenRef = useRef<string | null>(null);

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);
  const tokenListener = useRef<any>(null);

  useEffect(() => {
    const registerForPushNotifications = async () => {
      if (!Device.isDevice) {
        return;
      }

      try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();

          if (status !== "granted") {
            console.warn("Failed to get push token for push notification (permissions not granted).");
            return;
          }

          finalStatus = status;
        }

        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        const tokenData = await Notifications.getDevicePushTokenAsync();
        const fcmToken = tokenData.data;
        logApiResponse("DEVICE PUSH NOTIFICATION TOKEN", { token: fcmToken });
        setDeviceToken(fcmToken);
      } catch (error) {
        console.error("Error setting up push notifications:", error);
      }
    };

    registerForPushNotifications();

    // Listen for push token updates/refreshes (onTokenRefresh equivalents)
    tokenListener.current = Notifications.addPushTokenListener((tokenData) => {
      if (tokenData?.data) {
        setDeviceToken(tokenData.data);
      }
    });

    // Listener for notifications received when the app is in the foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      console.log("Notification received in foreground:", notification);
      // Invalidate queries to update in-app list and unread badge count immediately
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread-count"] });
    });

    // Listener for notifications clicked/tapped by the user
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("Notification clicked:", data);

      if (data?.orderId) {
        router.push(`/orders/all-orders?search=${data.orderId}`);
      } else if (data?.route) {
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
      if (tokenListener.current) {
        tokenListener.current.remove();
      }
    };
  }, []);

  // Synchronize Device Token with Backend when authenticated
  useEffect(() => {
    const syncToken = async () => {
      if (!userToken || !deviceToken) {
        return;
      }

      // Avoid redundant calls
      const cacheKey = `${userToken}_${deviceToken}`;
      if (registeredTokenRef.current === cacheKey) {
        return;
      }

      try {
        const success = await registerDeviceToken(userToken, deviceToken);
        if (success) {
          registeredTokenRef.current = cacheKey;
          console.log("Device token registered successfully on backend.");
        }
      } catch (error) {
        console.error("Error registering device token on backend:", error);
      }
    };

    syncToken();
  }, [userToken, deviceToken]);

  return { deviceToken };
};

export const triggerLocalNotificationMock = async (title: string, body: string, data?: any) => {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: data || {},
    },
    trigger: null,
  });
};
