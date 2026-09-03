import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface UserCardProps {
  user: {
    id: number | string;
    first_Name?: string;
    last_Name?: string;
    email: string;
    phone?: string;
    type?: string;
    image?: string;
    is_active?: boolean | number;
    last_login_at?: string;
    updated_at?: string;
  };
  onPress: () => void;
}

export default function UserCard({ user, onPress }: UserCardProps) {
  const fullName = `${user.first_Name || ""} ${user.last_Name || ""}`.trim() || "Staff Member";
  
  const initials = useMemo(() => {
    const first = user.first_Name ? user.first_Name[0] : "";
    const last = user.last_Name ? user.last_Name[0] : "";
    return `${first}${last}`.toUpperCase() || "SM";
  }, [user]);

  // Determine active status (fallback to true/1 if not specified)
  const isActive = user.is_active !== undefined ? !!user.is_active : true;

  // Formatting role badge colors
  const roleStyles = useMemo(() => {
    const type = (user.type || "").toLowerCase();
    switch (type) {
      case "admin":
      case "business_admin":
        return {
          bg: "bg-primary/10",
          text: "text-primary",
          label: "Admin",
        };
      case "waiter":
        return {
          bg: "bg-secondary/10",
          text: "text-secondary",
          label: "Waiter",
        };
      case "driver":
        return {
          bg: "bg-accent/10",
          text: "text-accent",
          label: "Driver",
        };
      default:
        return {
          bg: "bg-base-200",
          text: "text-accent",
          label: user.type ? user.type.charAt(0).toUpperCase() + user.type.slice(1) : "Staff",
        };
    }
  }, [user.type]);

  // Relative last active time fallback
  const lastActiveText = useMemo(() => {
    const timeStr = user.last_login_at || user.updated_at;
    if (!timeStr) return "Recently";
    try {
      const date = new Date(timeStr);
      if (isNaN(date.getTime())) return "Recently";
      const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
      if (seconds < 0) return "Recently";
      const minutes = Math.floor(seconds / 60);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days === 1) return "Yesterday";
      return `${days}d ago`;
    } catch {
      return "Recently";
    }
  }, [user.last_login_at, user.updated_at]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm flex-row items-center justify-between mb-3"
    >
      <View className="flex-row items-center gap-3 flex-1 mr-2">
        {/* Avatar Container */}
        <View className="w-12 h-12 rounded-full bg-base-200 items-center justify-center border border-base-100 overflow-hidden">
          {user.image ? (
            <Image source={{ uri: user.image }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-sm font-bold text-primary">{initials}</Text>
          )}
        </View>

        {/* User Info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-sm font-bold text-neutral" numberOfLines={1}>
              {fullName}
            </Text>
            {/* Status dot */}
            <View
              className={`w-2 h-2 rounded-full ${
                isActive ? "bg-green-500 shadow-lg shadow-green-500" : "bg-neutral/40"
              }`}
            />
          </View>
          <Text className="text-xs text-accent mt-0.5" numberOfLines={1}>
            {user.email}
          </Text>

          {/* Badge and Active Time Row */}
          <View className="flex-row items-center gap-2 mt-2">
            <View className={`px-2 py-[2px] rounded-full ${roleStyles.bg}`}>
              <Text className={`text-[10px] font-bold uppercase ${roleStyles.text}`}>
                {roleStyles.label}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="schedule" size={11} color="#6E6E6E" />
              <Text className="text-[10px] text-accent font-semibold">{lastActiveText}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Right chevron indicator */}
      <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
    </TouchableOpacity>
  );
}
