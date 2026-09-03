import { formatDateTime } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, View } from "react-native";

interface CampaignCardProps {
  campaign: {
    id: number | string;
    name: string;
    type: string;
    campaign_start_date?: string;
    campaign_start_time?: string;
    campaign_end_date?: string;
    campaign_end_time?: string;
    is_active?: number | boolean;
    description?: string;
  };
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const isActive = campaign.is_active !== undefined ? !!campaign.is_active : true;

  // Format type badges
  const typeDetails = useMemo(() => {
    const rawType = (campaign.type || "").toLowerCase();
    switch (rawType) {
      case "buy_one_get_one_same":
        return {
          label: "BOGO Free",
          icon: "card-giftcard" as const,
          bg: "bg-primary/10",
          text: "text-primary",
        };
      case "buy_one_get_one_other":
        return {
          label: "Bundle Offer",
          icon: "view-carousel" as const,
          bg: "bg-secondary/10",
          text: "text-secondary",
        };
      case "spend_certain_amount":
        return {
          label: "Spend & Save",
          icon: "shopping-bag" as const,
          bg: "bg-accent/10",
          text: "text-accent",
        };
      case "menu_discount":
        return {
          label: "Store Discount",
          icon: "percent" as const,
          bg: "bg-purple-500/10",
          text: "text-purple-600",
        };
      case "time_based_discount":
        return {
          label: "Happy Hour",
          icon: "schedule" as const,
          bg: "bg-amber-500/10",
          text: "text-amber-600",
        };
      default:
        return {
          label: campaign.type
            ? campaign.type
                .replace(/_/g, " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            : "Promotion",
          icon: "sell" as const,
          bg: "bg-base-200",
          text: "text-accent",
        };
    }
  }, [campaign.type]);

  // Format start and end date ranges nicely
  const scheduleStr = useMemo(() => {
    const parseTime = (timeStr?: string) => {
      if (!timeStr) return "";
      const parts = timeStr.split(":");
      if (parts.length >= 2) {
        const hour = parseInt(parts[0], 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const hour12 = hour % 12 || 12;
        return ` ${hour12}:${parts[1]} ${ampm}`;
      }
      return "";
    };

    const startD = campaign.campaign_start_date ? campaign.campaign_start_date.split(" ")[0] : "";
    const startT = parseTime(campaign.campaign_start_time);
    const endD = campaign.campaign_end_date ? campaign.campaign_end_date.split(" ")[0] : "";
    const endT = parseTime(campaign.campaign_end_time);

    if (!startD && !endD) return "Perpetual Campaign";

    const formattedStart = startD ? `${formatDateTime(startD)}${startT}` : "";
    const formattedEnd = endD ? `${formatDateTime(endD)}${endT}` : "";

    if (formattedStart && formattedEnd) {
      return `${formattedStart} to ${formattedEnd}`;
    }
    return formattedStart || formattedEnd;
  }, [
    campaign.campaign_start_date,
    campaign.campaign_start_time,
    campaign.campaign_end_date,
    campaign.campaign_end_time,
  ]);

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg p-4 shadow-sm mb-4">
      {/* Top section: Title, Status Badge, and Type Badge */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-2">
          {/* Campaign Name */}
          <Text className="text-sm font-bold text-neutral" numberOfLines={2}>
            {campaign.name || "Special Campaign"}
          </Text>
        </View>

        {/* Status Badge */}
        <View className={`px-2 py-[2px] rounded-full ${isActive ? "bg-green-500/10" : "bg-neutral/10"}`}>
          <Text className={`text-[8px] font-black uppercase ${isActive ? "text-green-500" : "text-accent"}`}>
            {isActive ? "Running" : "Paused"}
          </Text>
        </View>
      </View>

      {/* Description if present */}
      {campaign.description && (
        <Text className="text-[11px] text-accent font-semibold leading-4 mb-3" numberOfLines={3}>
          {campaign.description}
        </Text>
      )}

      {/* Schedule Row */}
      <View className="flex-row items-center gap-1.5 pt-3 border-t border-base-100 mt-1">
        <MaterialIcons name="date-range" size={14} color="#6E6E6E" />
        <Text className="text-[10px] font-semibold text-accent flex-1" numberOfLines={2}>
          {scheduleStr}
        </Text>
      </View>

      {/* Bottom Section: Type Badge */}
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-base-100">
        <View className={`flex-row items-center gap-1 px-2.5 py-1 rounded-lg ${typeDetails.bg}`}>
          <MaterialIcons
            name={typeDetails.icon}
            size={12}
            color={
              typeDetails.text === "text-primary"
                ? "#DC2D2A"
                : typeDetails.text === "text-secondary"
                  ? "#00677F"
                  : "#6E6E6E"
            }
          />
          <Text className={`text-[9px] font-black uppercase tracking-tight ${typeDetails.text}`}>
            {typeDetails.label}
          </Text>
        </View>
      </View>
    </View>
  );
}
