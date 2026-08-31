// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";

// 7. Constants/utils
import { WP } from "@/utils/getResponsiveSizes";

export default function ExpenseTrendSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View
        style={{ paddingHorizontal: WP("4%") }}
        className="border-b border-base-200 py-4 flex-row items-center justify-between"
      >
        <Bone width={140} height={16} />
        <Bone width={80} height={14} />
      </View>

      {/* Body Section: Bar Chart Placeholder */}
      <View
        style={{ padding: WP("3.5%"), height: 180 }}
        className="flex-row items-end justify-between py-4 px-6"
      >
        {[40, 75, 30, 90, 50, 65, 80].map((h, i) => (
          <View key={i} className="items-center gap-y-2">
            <Bone width={16} height={h} borderRadius={4} />
            <Bone width={24} height={10} />
          </View>
        ))}
      </View>
    </SkeletonContainer>
  );
}
