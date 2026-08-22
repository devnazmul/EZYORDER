import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function SalesSummaryListSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View style={{ paddingHorizontal: WP("4%") }} className="border-b border-base-200 py-4">
        <Bone width={110} height={16} />
      </View>

      {/* Body List */}
      <View style={{ padding: WP("3.5%") }} className="gap-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <View key={i} className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
              {/* Icon placeholder */}
              <Bone width={16} height={16} circle />
              {/* Label placeholder */}
              <Bone width={100} height={12} />
            </View>
            {/* Value placeholder */}
            <Bone width={60} height={14} />
          </View>
        ))}
      </View>

      {/* Action Footer */}
      <View className="w-full py-4 border-t border-base-200 bg-base-100 items-center justify-center">
        <Bone width={130} height={14} />
      </View>
    </SkeletonContainer>
  );
}
