import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatAmount } from "@/utils/formatters";
import { useData } from "@/context/context/DataContext";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import StatusBadge from "@/components/reuseable/StatusBadge";
import ENV from "@/config/env";

interface DealCardProps {
  deal: any;
  onPress: () => void;
}

const resolveImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const mediaBase = ENV.API_BASE_URL.replace("/api", "");
  return `${mediaBase}/${path}`;
};

export default function DealCard({ deal, onPress }: DealCardProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const isActive = Number(deal?.is_active) === 1;
  const imageUri = resolveImageUrl(deal?.image);
  const linkedItems = Array.isArray(deal?.deal) ? deal.deal : [];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm mb-4"
    >
      <View className="flex-row p-3 gap-3">
        {/* Deal Thumbnail Image */}
        <View className="w-20 h-20 rounded-lg bg-base-200 overflow-hidden items-center justify-center relative flex-shrink-0">
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <MaterialIcons name="local-offer" size={24} color="#A3A3A3" />
          )}
        </View>

        {/* Details */}
        <View className="flex-1 justify-between py-0.5 pr-1">
          <View>
            <View className="flex-row justify-between items-start gap-2">
              <Text className="text-sm font-bold text-neutral flex-1" numberOfLines={1}>
                {deal?.name || "Deal Name"}
              </Text>
              <StatusBadge status={isActive ? "active" : "inactive"} />
            </View>
            <Text className="text-xs text-accent mt-1" numberOfLines={1}>
              {deal?.description || "No description provided."}
            </Text>

            {/* Linked Dishes Bullet Items */}
            {linkedItems.length > 0 && (
              <View className="mt-2 gap-y-1">
                <Text className="text-[8px] font-bold text-accent uppercase tracking-wider">Included Options</Text>
                {linkedItems.slice(0, 2).map((item: any, idx: number) => (
                  <View key={item?.id || idx} className="flex-row items-center gap-1">
                    <MaterialIcons name="check-circle" size={10} color="#DC2D2A" />
                    <Text className="text-[10px] text-neutral/85 font-medium flex-1 truncate" numberOfLines={1}>
                      {item?.dish?.name || "Dish Option"}
                    </Text>
                  </View>
                ))}
                {linkedItems.length > 2 && (
                  <Text className="text-[9px] text-primary font-bold italic">
                    +{linkedItems.length - 2} more options...
                  </Text>
                )}
              </View>
            )}
          </View>

          {/* Pricing Row */}
          <View className="flex-row justify-between items-center mt-2 pt-1 border-t border-base-200/50">
            <Text className="text-[9px] font-bold text-accent uppercase tracking-wider">Deal Rate</Text>
            <Text className="text-sm font-black text-primary">
              {formatAmount(deal?.price || 0, currencySymbol)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
