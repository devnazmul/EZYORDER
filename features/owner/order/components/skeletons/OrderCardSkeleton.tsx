import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function OrderCardSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
      <View style={{ padding: WP("3.5%") }} className="gap-y-3">
        {/* Header Row */}
        <View className="flex-row justify-between items-start">
          <View className="gap-y-2 flex-1 pr-2">
            <View className="flex-row items-center gap-2">
              {/* Order ID bone */}
              <Bone width={48} height={20} />
              {/* Order Type Badge bone */}
              <Bone width={64} height={20} borderRadius={99} />
            </View>
            {/* Customer Name bone */}
            <Bone width={128} height={16} style={{ marginTop: 4 }} />
          </View>

          <View className="items-end gap-y-2">
            {/* Status Badge bone */}
            <Bone width={80} height={24} borderRadius={99} />
            {/* Date time bone */}
            <Bone width={64} height={12} style={{ marginTop: 4 }} />
          </View>
        </View>

        {/* Metadata Details Row */}
        <View className="flex-row flex-wrap justify-between items-center gap-2 border-t border-b border-base-200/50 py-2.5">
          <View className="flex flex-col gap-2">
            {/* Source bone */}
            <View className="flex-row items-center gap-1">
              <Bone width={40} height={12} />
              <Bone width={48} height={12} />
            </View>

            {/* Assigned bone */}
            <View className="flex-row items-center gap-1">
              <Bone width={56} height={12} />
              <Bone width={80} height={12} />
            </View>
          </View>

          {/* Payment Status bone */}
          <View className="flex-row items-center gap-1">
            <Bone width={48} height={12} />
            <Bone width={64} height={24} borderRadius={99} />
          </View>
        </View>

        {/* Price Row */}
        <View className="flex-row justify-between items-center pt-1">
          {/* Price bone */}
          <Bone width={80} height={24} />
        </View>
      </View>

      {/* Button Action */}
      <View style={{ paddingHorizontal: WP("4%") }} className="pb-4">
        {/* Button bone */}
        <Bone width="100%" height={44} borderRadius={8} />
      </View>
    </SkeletonContainer>
  );
}
