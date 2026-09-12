// 1. React / React Native
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. Shared components / context / hooks
import { CustomText, StatusBadge } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { formatDate, WP } from "@/utils";

// 4. Types
import type { ICampaign } from "../types/campaign.types";

interface ICampaignCardProps {
  campaign: ICampaign;
}

export default function CampaignCard({
  campaign,
}: Readonly<ICampaignCardProps>) {
  return (
    <View
      className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
      style={{ padding: WP(4) }}
    >
      {/* Top section: Title & Status Badge */}
      <View className="flex-row items-start justify-between mb-1.5">
        <CustomText
          variant="primary"
          size="sm"
          weight="bold"
          className="flex-1 mr-2"
          numberOfLines={2}
        >
          {campaign.name}
        </CustomText>

        <StatusBadge status={campaign.is_active ? "active" : "inactive"} />
      </View>

      {/* Date Range below Name */}
      {(!!campaign.campaign_start_date || !!campaign.campaign_end_date) && (
        <View className="flex-row items-center gap-1 flex-wrap">
          <MaterialIcons name="event" size={WP(3.5)} color={COLORS.accent} />
          {!!campaign.campaign_start_date && (
            <CustomText variant="tertiary" size="xs" weight="semibold">
              {formatDate(campaign.campaign_start_date, "DD-MM-YYYY")}
            </CustomText>
          )}
          {!!campaign.campaign_start_date && !!campaign.campaign_end_date && (
            <CustomText variant="tertiary" size="xs" weight="semibold">
              to
            </CustomText>
          )}
          {!!campaign.campaign_end_date && (
            <CustomText variant="tertiary" size="xs" weight="semibold">
              {formatDate(campaign.campaign_end_date, "DD-MM-YYYY")}
            </CustomText>
          )}
        </View>
      )}
    </View>
  );
}
