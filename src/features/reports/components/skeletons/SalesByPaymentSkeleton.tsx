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

export default function SalesByPaymentSkeleton() {
  const ringSize = WP("34%");

  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View
        style={{ paddingHorizontal: WP("4%") }}
        className="border-b border-base-200 py-4"
      >
        <Bone width={180} height={16} />
      </View>

      {/* Body Section: Doughnut Ring on Left + Legend List on Right */}
      <View
        style={{ padding: WP("3.5%") }}
        className="flex-row items-center justify-between py-4"
      >
        {/* Doughnut Ring Skeleton */}
        <View
          style={{ width: ringSize, height: ringSize }}
          className="items-center justify-center relative"
        >
          <Bone
            width={ringSize}
            height={ringSize}
            borderRadius={ringSize / 2}
          />
          {/* Inner Hole */}
          <View
            style={{
              width: ringSize - WP("10%"),
              height: ringSize - WP("10%"),
            }}
            className="absolute bg-base-300 rounded-full items-center justify-center"
          >
            <Bone width={50} height={14} />
            <View className="mt-1" />
            <Bone width={35} height={10} />
          </View>
        </View>

        {/* Legend Column (Cash, Card, Online) */}
        <View className="flex-1 ml-4 gap-y-3">
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center gap-2">
              {/* Legend Pill */}
              <Bone width={WP("10%")} height={20} borderRadius={8} />
              {/* Label & Value Column */}
              <View className="flex-1 gap-y-1">
                <Bone width="70%" height={12} />
                <Bone width="50%" height={14} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Footer */}
      <View className="w-full py-4 border-t border-base-200 bg-base-100 items-center justify-center">
        <Bone width={130} height={14} />
      </View>
    </SkeletonContainer>
  );
}
