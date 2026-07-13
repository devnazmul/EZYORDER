import StatusBadge from "@/components/reuseable/StatusBadge";
import ENV from "@/config/env";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface DishCardProps {
  dish: any;
  onPress: () => void;
}

const resolveImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const mediaBase = ENV.API_BASE_URL.replace("/api", "");
  return `${mediaBase}/${path}`;
};

export default function DishCard({ dish, onPress }: DishCardProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const isActive = Number(dish?.is_active) === 1;
  const isTimeBased = Number(dish?.is_time_based) === 1;
  const imageUri = resolveImageUrl(dish?.image);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm mb-4"
    >
      <View className="flex-row p-3 gap-3">
        {/* Left Side: Dish Thumbnail Image */}
        <View className="w-20 h-20 rounded-lg bg-base-200 overflow-hidden items-center justify-center relative flex-shrink-0">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <MaterialIcons name="restaurant" size={24} color="#A3A3A3" />
          )}
          {isTimeBased && (
            <View className="absolute top-1 left-1 bg-amber-500 rounded px-1 py-0.5 shadow-sm">
              <MaterialIcons name="schedule" size={8} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Right Side: Details */}
        <View className="flex-1 justify-between py-0.5 pr-1">
          <View>
            <View className="flex-row justify-between items-start gap-2">
              <Text className="text-sm font-bold text-neutral flex-1" numberOfLines={1}>
                {dish?.name || "Dish Name"}
              </Text>
              <StatusBadge status={isActive ? "active" : "inactive"} />
            </View>
            <Text className="text-xs text-accent mt-1" numberOfLines={2}>
              {dish?.description || "No description provided."}
            </Text>
            {Array.isArray(dish?.dish_variations) && dish.dish_variations.length > 0 && (
              <View className="flex-row items-center gap-1 mt-1.5 bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md self-start">
                <MaterialIcons name="tune" size={10} color="#DC2D2A" />
                <Text className="text-[9px] font-black text-primary uppercase">
                  {dish.dish_variations.length} {dish.dish_variations.length === 1 ? "option" : "options"}
                </Text>
              </View>
            )}
          </View>

          {/* Pricing Row */}
          <View className="flex-row justify-between items-center mt-2 pt-1 border-t border-base-200/50">
            <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">Eat In Rate</Text>
            <Text className="text-sm font-black text-primary">
              {formatAmount(dish?.price || 0, currencySymbol)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
