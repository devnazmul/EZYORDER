import Badge from "@/components/reuseable/Badge";
import StatusBadge from "@/components/reuseable/StatusBadge";
import ENV from "@/config/env";
import COLORS from "@/constants/colors";
import { useData } from "@/src/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
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
      style={{ padding: WP("3%") }}
      className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm"
    >
      <View className="flex-row gap-3">
        {/* Left Side: Dish Thumbnail Image */}
        <View
          style={{ width: WP("20%"), height: WP("20%") }}
          className="rounded-lg bg-base-200 overflow-hidden items-center justify-center relative flex-shrink-0"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <MaterialIcons name="restaurant" size={WP("6%")} color={COLORS.accent} />
          )}
          {isTimeBased && (
            <View className="absolute top-1 left-1 bg-amber-500 rounded px-1 py-0.5 shadow-sm">
              <MaterialIcons name="schedule" size={WP("2.5%")} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Right Side: Details */}
        <View className="flex-1 justify-between py-0.5 pr-1">
          <View>
            <View className="flex-row justify-between items-start gap-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="font-bold text-neutral flex-1"
                numberOfLines={1}
              >
                {dish?.name || "Dish Name"}
              </Text>
              <StatusBadge status={isActive ? "active" : "inactive"} />
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent font-medium mt-1"
              numberOfLines={2}
            >
              {dish?.description || "No description provided."}
            </Text>
            {Array.isArray(dish?.dish_variations) && dish.dish_variations.length > 0 && (
              <View className="mt-1.5 self-start">
                <Badge
                  icon={<MaterialIcons name="tune" size={WP("3%")} color={COLORS.primary} />}
                  text={`${dish.dish_variations.length} ${dish.dish_variations.length === 1 ? "option" : "options"}`}
                  containerClassName="bg-primary/10 border border-primary/20 "
                  textClassName="text-primary capitalize"
                  textStyle={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                />
              </View>
            )}
          </View>

          {/* Pricing Row */}
          <View style={{ marginTop: HP("1%") }} className="flex-col justify-start items-end ">
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-primary">
              {formatAmount(dish?.price || 0, currencySymbol)}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize tracking-wider"
            >
              Eat In Rate
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
