// 1. React / React Native
import { View } from "react-native";

// 2. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";
import { WP } from "@/utils";

export interface ICampaignCardSkeletonProps {
  count?: number;
}

export default function CampaignCardSkeleton({
  count = 3,
}: Readonly<ICampaignCardSkeletonProps>) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-3">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
          style={{ padding: WP(4) }}
        >
          {/* Top Row: Title & Status Badge */}
          <View className="flex-row items-start justify-between mb-2">
            <Bone width="60%" height={16} borderRadius={4} />
            <Bone width={55} height={18} borderRadius={9999} />
          </View>

          {/* Date Range */}
          <View className="flex-row items-center gap-2">
            <Bone width={14} height={14} borderRadius={4} />
            <Bone width={140} height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
