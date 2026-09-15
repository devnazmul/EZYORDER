// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";

// 7. Constants/utils
import { WP } from "@/utils";

export interface IPartnerSaleCardSkeletonProps {
  count?: number;
}

export default function PartnerSaleCardSkeleton({
  count = 4,
}: Readonly<IPartnerSaleCardSkeletonProps>) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-4">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-300 rounded-2xl overflow-hidden flex-row items-center gap-3"
          style={{ padding: WP("4%") }}
        >
          {/* Left Icon Skeleton */}
          <Bone width={WP("11%")} height={WP("11%")} borderRadius={12} />

          {/* Content Details Skeleton */}
          <View className="flex-1 gap-y-1.5">
            {/* Partner Name Skeleton */}
            <Bone width="55%" height={16} borderRadius={4} />

            {/* Bank & Cash Payments Row Skeleton */}
            <View className="flex-row items-center gap-3">
              <Bone width="40%" height={12} borderRadius={4} />
              <Bone width="40%" height={12} borderRadius={4} />
            </View>
          </View>

          {/* Right Chevron Skeleton */}
          <Bone width={WP("5.5%")} height={WP("5.5%")} circle />
        </View>
      ))}
    </SkeletonContainer>
  );
}
