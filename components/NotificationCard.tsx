import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface NotificationItem {
  id: string | number;
  title?: string;
  message?: string;
  notification_title?: string;
  notification_description?: string;
  notification_link?: string | null;
  status?: string; // "read" or "unRead"
  sender_type?: string;
  created_at?: string;
  activity_time?: string;
}

interface NotificationCardProps {
  notification: NotificationItem;
  onPress: () => void;
}

export default function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const statusStr = (notification.status || "").toLowerCase().trim();
  const isUnread = statusStr === "unread";
  const type = (notification.sender_type || "").toLowerCase().trim();

  // Color mappings
  let borderStyle = "border-l-4 border-accent";
  let iconName: keyof typeof MaterialIcons.glyphMap = "notifications";
  let iconColor = "#6E6E6E";
  let iconBg = "bg-accent/10";

  if (type === "system") {
    borderStyle = "border-l-4 border-primary";
    iconName = "warning";
    iconColor = "#DC2D2A";
    iconBg = "bg-primary/10";
  } else if (type === "driver") {
    borderStyle = "border-l-4 border-secondary";
    iconName = "local-shipping";
    iconColor = "#00677F";
    iconBg = "bg-secondary/10";
  }

  // Safe date parsing helper for DD-MM-YYYY formats
  const parseDate = (dateStr: string) => {
    if (!dateStr) return null;
    const parts = dateStr.split(" ");
    if (parts.length >= 1) {
      const dateParts = parts[0].split("-");
      if (dateParts.length === 3) {
        const day = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const year = parseInt(dateParts[2], 10);

        let hour = 0;
        let minute = 0;
        let second = 0;

        if (parts[1]) {
          const timeParts = parts[1].split(":");
          if (timeParts.length >= 2) {
            hour = parseInt(timeParts[0], 10);
            minute = parseInt(timeParts[1], 10);
            if (timeParts[2]) {
              second = parseInt(timeParts[2], 10);
            }
          }
        }
        return new Date(year, month, day, hour, minute, second);
      }
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  };

  // Formatting Date label
  const parsedDate = parseDate(notification.created_at || "");
  const timeLabel =
    notification.activity_time ||
    (parsedDate ? parsedDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "");

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className={`rounded-xl p-4 flex-row items-start gap-x-3 mb-3 border ${
        isUnread
          ? `${borderStyle} bg-base-300 border-base-200 shadow-sm`
          : "bg-base-300/70 border-transparent opacity-70"
      }`}
    >
      {/* Icon Container */}
      <View className={`w-10 h-10 rounded-full ${iconBg} items-center justify-center shrink-0`}>
        <MaterialIcons name={iconName} size={20} color={iconColor} />
      </View>

      {/* Content wrapper */}
      <View className="flex-1 min-w-0">
        <View className="flex-row justify-between items-start">
          <Text
            numberOfLines={1}
            className={`text-sm shrink mr-2 text-neutral ${isUnread ? "font-bold" : "font-medium"}`}
          >
            {notification.notification_title || notification.title || "Alert"}
          </Text>
          <Text className="text-[10px] text-accent font-semibold">{timeLabel}</Text>
        </View>
        <Text numberOfLines={2} className="text-xs text-accent mt-1 leading-4">
          {notification.notification_description || notification.message || ""}
        </Text>
      </View>

      {/* Unread Dot status */}
      {isUnread && <View className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
    </TouchableOpacity>
  );
}
