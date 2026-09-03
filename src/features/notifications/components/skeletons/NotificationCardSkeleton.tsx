import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function NotificationCardSkeleton() {
  const cards = [1, 2, 3, 4, 5];
  const iconBoneSize = WP("8%");

  return (
    <SkeletonContainer className="gap-y-3">
      {cards.map((key) => (
        <View
          key={key}
          className="rounded-xl p-4 flex-row items-start gap-x-3 border border-base-200 bg-base-300/40"
        >
          {/* Circular icon bone */}
          <Bone width={iconBoneSize} height={iconBoneSize} circle className="shrink-0" />

          {/* Content wrapper bones */}
          <View className="flex-1 gap-y-2 min-w-0">
            <View className="flex-row justify-between items-center">
              <Bone width="60%" height={16} borderRadius={4} />
              <Bone width="20%" height={12} borderRadius={4} />
            </View>
            <Bone width="90%" height={12} borderRadius={4} className="mt-1" />
            <Bone width="50%" height={12} borderRadius={4} />
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
