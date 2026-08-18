import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP, HP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function RevenueByOrderTypeSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View style={{ paddingHorizontal: WP("4%") }} className="border-b border-base-200 py-4">
        <Bone width={160} height={16} />
      </View>

      {/* Body List */}
      <View style={{ padding: WP("3.5%") }} className="gap-y-5">
        {[1, 2, 3, 4].map((i) => (
          <View key={i} className="gap-y-2">
            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-3">
                {/* Icon Placeholder */}
                <Bone width={WP("7.5%")} height={WP("7.5%")} borderRadius={8} />
                {/* Label Placeholder */}
                <Bone width={100} height={13} />
              </View>
              {/* Value Placeholder */}
              <Bone width={70} height={14} />
            </View>
            {/* Progress Bar */}
            <Bone width="100%" height={HP("1.2%")} borderRadius={6} />
          </View>
        ))}
      </View>
    </SkeletonContainer>
  );
}
