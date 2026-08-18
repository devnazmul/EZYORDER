import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function SalesItemListSkeleton() {
  return (
    <SkeletonContainer className="flex flex-col gap-3 pb-6 w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View
          key={i}
          style={{ padding: WP("4%") }}
          className="bg-base-300 border border-base-200 rounded-lg flex-row items-center justify-between"
        >
          <View className="flex-row items-center gap-3 flex-1 min-w-0">
            {/* Rank index placeholder */}
            <Bone width={24} height={20} borderRadius={6} />
            <View className="flex-1 min-w-0 gap-y-1.5">
              {/* Item name placeholder */}
              <Bone width="70%" height={12} />
              {/* Sold qty placeholder */}
              <Bone width="35%" height={10} />
            </View>
          </View>
          <View className="items-end ml-2 gap-y-1.5">
            {/* Net sales placeholder */}
            <Bone width={60} height={12} />
            {/* Discount placeholder */}
            <Bone width={50} height={10} />
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
