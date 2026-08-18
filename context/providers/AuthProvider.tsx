import { unregisterDeviceToken } from "@/features/owner/notifications/apis/notification";
import { authStore, UserData } from "@/utils";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from AsyncStorage on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const storedToken = await authStore.getToken();
        const storedUser = await authStore.getUser();
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(storedUser);
        }
      } catch (error) {
        console.error("Error restoring session inside AuthProvider:", error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (newToken: string, userData: UserData) => {
    try {
      await authStore.saveSession(newToken, userData);
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error("Error during Context login:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        try {
          if (Device.isDevice) {
            const tokenData = await Notifications.getDevicePushTokenAsync();
            const deviceToken = tokenData.data;
            if (deviceToken) {
              await unregisterDeviceToken(token, deviceToken);
              console.log(
                "Device token unregistered successfully during logout.",
              );
            }
          }
        } catch (err) {
          console.error("Failed to unregister device token on logout:", err);
        }
      }

      await authStore.clearSession();
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error("Error during Context logout:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
