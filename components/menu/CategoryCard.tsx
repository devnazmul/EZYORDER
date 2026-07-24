import StatusBadge from "@/components/reuseable/StatusBadge";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
      className="bg-base-300 border border-base-200 rounded-lg p-4 shadow-sm"
    >
      {/* Top Row: Name, time-based badge */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center flex-1 pr-2 gap-2">
          <Text className="text-md font-black text-neutral shrink" numberOfLines={1}>
            {item?.name}
          </Text>
          {isTimeBased && (
            <View className="flex-row items-center bg-amber-100 px-2 py-0.5 rounded-full gap-1">
              <MaterialIcons name="schedule" size={10} color="#92400e" />
              <Text className="text-[9px] font-bold text-amber-800 ml-0.5">Time-Based</Text>
            </View>
          )}
        </View>
      </View>

      {/* Details Row: Description, Status, Dishes count */}
      <View className="flex-row border-t border-base-200/50 border-dashed pt-3 justify-between">
        {/* Description */}
        <View className="flex-1 pr-2">
          <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">Description</Text>
          <Text className="text-xs text-accent/80 font-medium mt-0.5" numberOfLines={1}>
            {item?.description || "No description"}
          </Text>
        </View>

        {/* Status */}
        <View className="items-center px-2">
          <Text className="text-[9px] font-bold text-accent uppercase tracking-wider mb-0.5">Status</Text>
          <StatusBadge status={isActive ? "active" : "inactive"} />
        </View>

        {/* Dishes count */}
        <View className="items-end pl-2">
          <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">Dishes</Text>
          <Text className="text-md font-black text-neutral mt-0.5">{dishCount}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
