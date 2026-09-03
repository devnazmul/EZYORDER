import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function KitchenCardSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 border border-base-200 rounded-xl shadow-sm mb-4 border-l-[6px] border-l-base-200/50 overflow-hidden">
      <View style={{ padding: WP("3.5%") }}>
        {/* Card Header Skeleton */}
        <View className="flex-row justify-between items-start border-b border-base-200 pb-3 mb-3">
          <View className="gap-y-1.5">
            {/* Order ID */}
            <Bone width={70} height={18} borderRadius={4} />
            {/* Customer Name */}
            <Bone width={110} height={12} borderRadius={4} />
          </View>
          <View className="items-end gap-y-2">
            {/* Status Badge */}
            <Bone width={85} height={22} borderRadius={12} />
            {/* Date / Time */}
            <Bone width={90} height={12} borderRadius={4} />
          </View>
        </View>

        {/* Dishes List Skeleton */}
        <View className="gap-y-4">
          {/* Item 1 */}
          <View className="flex-row items-start gap-2">
            {/* Qty Badge */}
            <Bone width={32} height={20} borderRadius={8} />
            <View className="flex-1 gap-y-2">
              {/* Dish Name */}
              <Bone width="60%" height={16} borderRadius={4} />
              {/* Variations */}
              <View className="flex-row gap-1.5">
                <Bone width={55} height={18} borderRadius={8} />
                <Bone width={75} height={18} borderRadius={8} />
              </View>
            </View>
          </View>

          {/* Item 2 */}
          <View className="flex-row items-start gap-2">
            {/* Qty Badge */}
            <Bone width={32} height={20} borderRadius={8} />
            <View className="flex-1 gap-y-2">
              {/* Dish Name */}
              <Bone width="45%" height={16} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Special Note Skeleton */}
        <View className="bg-base-200/40 border border-base-200/60 rounded-lg p-2.5 mt-3.5 flex-row items-start gap-2">
          <Bone width={16} height={16} circle={true} />
          <View className="flex-1 gap-y-1.5">
            <Bone width={80} height={12} borderRadius={4} />
            <Bone width="90%" height={12} borderRadius={4} />
          </View>
        </View>
      </View>
    </SkeletonContainer>
  );
}
