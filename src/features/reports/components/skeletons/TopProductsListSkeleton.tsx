// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import {
  Bone,
  SkeletonContainer,
} from "@/components/reuseable/skeletons/Skeleton";

// 7. Constants/utils
import { WP } from "@/utils/getResponsiveSizes";

export default function TopProductsListSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View
        style={{ paddingHorizontal: WP("4%") }}
        className="border-b border-base-200 py-4"
      >
        <Bone width={170} height={16} />
      </View>

      {/* Body List */}
      <View style={{ padding: WP("3.5%") }} className="gap-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{ padding: WP("3%") }}
            className="flex-row items-center justify-between border border-base-200 rounded-lg bg-base-100/50"
          >
            {/* Left: Rank + Product Name */}
            <View className="flex-row items-center gap-3 flex-1 min-w-0 mr-3">
              <Bone width={28} height={24} borderRadius={8} />
              <Bone width="65%" height={14} />
            </View>

            {/* Right: Qty Sold */}
            <Bone width={65} height={12} />
          </View>
        ))}
      </View>

      {/* Action Footer */}
      <View className="w-full py-4 border-t border-base-200 bg-base-100 items-center justify-center">
        <Bone width={160} height={14} />
      </View>
    </SkeletonContainer>
  );
}
