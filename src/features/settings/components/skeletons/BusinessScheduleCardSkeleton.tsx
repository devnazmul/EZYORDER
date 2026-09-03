// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components & utils
import {
  Bone,
  SkeletonContainer,
} from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";

export default function BusinessScheduleCardSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm mb-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-base-200/50 mb-3">
        <Bone width={WP("25%")} height={WP("5%")} borderRadius={6} />
        <Bone width={WP("16%")} height={WP("5.5%")} borderRadius={9999} />
      </View>
      <View className="gap-y-2">
        <View className="flex-row items-center justify-between bg-base-200/50 p-2.5 rounded-lg">
          <Bone width={WP("18%")} height={WP("4%")} borderRadius={4} />
          <Bone width={WP("30%")} height={WP("4%")} borderRadius={4} />
        </View>
        <View className="flex-row items-center justify-between bg-base-200/50 p-2.5 rounded-lg">
          <Bone width={WP("18%")} height={WP("4%")} borderRadius={4} />
          <Bone width={WP("30%")} height={WP("4%")} borderRadius={4} />
        </View>
      </View>
    </SkeletonContainer>
  );
}
