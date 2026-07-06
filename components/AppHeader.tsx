import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  showBackButton?: boolean;
}

export default function AppHeader({ showBackButton = false }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const insets = useSafeAreaInsets();

  // Compute initials fallback
  const getInitials = () => {
    if (user?.first_Name || user?.last_Name) {
      return ((user.first_Name?.[0] || "") + (user.last_Name?.[0] || "")).toUpperCase();
    }
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return "FD";
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const restaurantName = user?.restaurant?.[0]?.Name || user?.restaurant?.[0]?.name || "EZYORDER";
  const initials = getInitials();

  return (
    <View
      style={{ paddingTop: insets.top + 12 }}
      className="flex-row justify-between items-center pb-3 px-4 bg-base-300 border-b border-base-200 z-50 relative"
    >
      {/* Left side: Back Button & Restaurant Name */}
      <View className="flex-row items-center gap-2">
        {showBackButton && (
          <TouchableOpacity
            onPress={() => router.back()}
            className="p-1.5 hover:bg-base-200 rounded-full mr-1"
          >
            <MaterialIcons name="arrow-back" size={24} color="#DC2D2A" />
          </TouchableOpacity>
        )}
        <Text className="text-md font-bold text-primary">{restaurantName}</Text>
      </View>

      {/* Right side: Notification Button & Profile Avatar Dropdown */}
      <View className="flex-row items-center gap-4">
        {/* Notification Bell */}
        {/* <TouchableOpacity className="relative p-2 rounded-full hover:bg-base-200">
          <MaterialIcons name="notifications-none" size={24} color="#DC2D2A" />
          <View className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full border-2 border-base-300" />
        </TouchableOpacity> */}

        {/* Profile Avatar Button */}
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-sm overflow-hidden border border-base-200"
        >
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text className="text-white font-bold text-sm">{initials}</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Dropdown Logout Menu overlay */}
      {showDropdown && (
        <View
          style={{ top: insets.top + 56 }}
          className="absolute right-4 bg-base-300 border border-base-200 rounded-xl shadow-lg p-2 z-50 min-w-[130px]"
        >
          <TouchableOpacity
            onPress={handleLogout}
            className="flex-row items-center gap-2 p-2 hover:bg-base-200 rounded-lg w-full"
          >
            <MaterialIcons name="exit-to-app" size={18} color="#DC2D2A" />
            <Text className="text-xs font-bold text-neutral">Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
