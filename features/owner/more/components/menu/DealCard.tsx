import Badge from "@/components/reuseable/Badge";
import StatusBadge from "@/components/reuseable/StatusBadge";
import ENV from "@/config/env";
import COLORS from "@/constants/colors";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
      style={{ padding: WP("3%") }}
      className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm"
    >
      <View className="flex-row gap-3" style={{ gap: WP("3%") }}>
        {/* Deal Thumbnail Image */}
        <View
          style={{ width: WP("20%"), height: WP("20%") }}
          className="rounded-lg bg-base-200 overflow-hidden items-center justify-center relative flex-shrink-0"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <MaterialIcons name="local-offer" size={WP("6%")} color={COLORS.accent} />
          )}
        </View>

        {/* Details */}
        <View className="flex-1 justify-between py-0.5 pr-1">
          <View>
            <View className="flex-row justify-between items-start gap-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="font-bold text-neutral flex-1"
                numberOfLines={1}
              >
                {deal?.name || "Deal Name"}
              </Text>
              <StatusBadge status={isActive ? "active" : "inactive"} />
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent/80 font-medium mt-0.5"
              numberOfLines={1}
            >
              {deal?.description || "No description provided."}
            </Text>

            {/* Linked Dishes Bullet Items */}
            {linkedItems.length > 0 && (
              <View className="mt-3 gap-3">
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-semibold text-accent capitalize tracking-wide"
                >
                  Included Options
                </Text>
                <View className="flex-row flex-wrap gap-3">
                  {linkedItems.slice(0, 3).map((item: any, idx: number) => (
                    <Badge
                      key={item?.id || idx}

                      text={item?.dish?.name || "Dish Option"}
                      containerClassName="bg-primary/10 border border-primary/20 "
                      textClassName="text-primary capitalize"
                      textStyle={{ fontSize: getResponsiveFontSize("xs") }}
                    />
                  ))}
                  {linkedItems.length > 3 && (
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="text-primary font-bold italic self-center"
                    >
                      +{linkedItems.length - 3} More
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>

          {/* Pricing Row */}
          <View
            style={{ marginTop: WP("2%"), paddingTop: WP("1%") }}
            className="flex-col justify-start items-end"
          >
            <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-primary">
              {formatAmount(deal?.price || 0, currencySymbol)}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize tracking-wider"
            >
              Deal Rate
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
