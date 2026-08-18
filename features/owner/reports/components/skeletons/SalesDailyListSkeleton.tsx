import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function SalesDailyListSkeleton() {
  return (
    <SkeletonContainer className="flex flex-col gap-3 pb-3 w-full">
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={{ padding: WP("4%") }} className="bg-base-300 border border-base-200 rounded-lg">
          {/* Header Row */}
          <View className="flex-row justify-between items-center mb-3">
            <Bone width={90} height={14} />
            <Bone width={65} height={16} borderRadius={9999} />
          </View>
          {/* Financial Columns Grid */}
          <View className="flex-row justify-between pt-1">
            {[1, 2, 3, 4].map((col) => (
              <View key={col} className="gap-y-1.5">
                <Bone width={45} height={10} />
                <Bone width={55} height={12} />
              </View>
            ))}
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
