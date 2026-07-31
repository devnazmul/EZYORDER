import StatusBadge from "@/components/reuseable/StatusBadge";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Badge from "../reuseable/Badge";

interface CategoryCardProps {
  item: any;
  onPress: () => void;
}

export default function CategoryCard({ item, onPress }: CategoryCardProps) {
  const isActive = item?.show_in_customer === 1 || item?.show_in_customer === "1";
  const isTimeBased = item?.is_time_based === 1 || item?.is_time_based === "1";
  const dishCount = Array.isArray(item?.dishes) ? item.dishes.length : 0;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={{ padding: WP("3%") }}
      className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
    >
      {/* Top Row: Name, time-based badge */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1 pr-2 gap-2">
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="font-bold text-neutral shrink"
            numberOfLines={2}
          >
            {item?.name}
          </Text>
          {isTimeBased && (
            <Badge
              icon={<MaterialIcons name="schedule" size={WP("3.5%")} color="#B45309" />}
              text="Time Based"
              containerClassName="bg-amber-500/10 border border-amber-500/20 rounded-full"
              textClassName="text-amber-700"
              textStyle={{ fontSize: getResponsiveFontSize("xs") - 1 }}
            />
          )}
        </View>
      </View>

      {/* Details Row: Description, Status, Dishes count */}
      <View className="flex-row border-t border-base-200/50 border-dashed pt-3 justify-between">
        {/* Description */}
        <View className="flex-1 pr-2">
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
            className="font-bold text-accent capitalize tracking-wide"
          >
            Description
          </Text>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent/80 font-medium mt-0.5 truncate"
            numberOfLines={2}
          >
            {item?.description || "No description"}
          </Text>
        </View>

        {/* Status */}
        <View className="items-start px-2">
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
            className="font-bold text-accent capitalize tracking-wider mb-0.5"
          >
            Status
          </Text>
          <StatusBadge status={isActive ? "active" : "inactive"} />
        </View>

        {/* Dishes count */}
        <View className="items-start pl-2">
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
            className="font-bold text-accent capitalize tracking-wider"
          >
            Dishes
          </Text>
          <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral mt-0.5">
            {dishCount}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
