import COLORS from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
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

  const avatarSize = WP("10%");

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
            <MaterialIcons name="arrow-back" size={WP("6%")} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-primary">
          {restaurantName}
        </Text>
      </View>

      {/* Right side: Notification Button & Profile Avatar Dropdown */}
      <View className="flex-row items-center gap-4">
        {/* Profile Avatar Button */}
        <TouchableOpacity
          onPress={() => setShowDropdown(!showDropdown)}
          activeOpacity={0.8}
          style={{ width: avatarSize, height: avatarSize }}
          className="rounded-full bg-primary items-center justify-center shadow-sm overflow-hidden border border-base-200"
        >
          {user?.image ? (
            <Image
              source={{ uri: user.image }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          ) : (
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="text-white font-bold">
              {initials}
            </Text>
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
            <MaterialIcons name="exit-to-app" size={WP("4.5%")} color={COLORS.primary} />
            <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
