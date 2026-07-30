import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function TopProductsListSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm w-full overflow-hidden">
      {/* Header Section */}
      <View style={{ paddingHorizontal: WP("4%") }} className="border-b border-base-200 py-4">
        <Bone width={160} height={16} />
      </View>

      {/* Body List */}
      <View style={{ padding: WP("3.5%") }} className="gap-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <View key={i} className="flex-row justify-between items-center py-1">
            <View className="flex-row items-center gap-3 flex-1">
              {/* Product index badge */}
              <Bone width={24} height={20} borderRadius={6} />
              {/* Product name & count */}
              <View className="gap-y-1.5 flex-1 pr-4">
                <Bone width="75%" height={12} />
                <Bone width="40%" height={10} />
              </View>
            </View>
            {/* Sales & Discount values */}
            <View className="items-end gap-y-1.5">
              <Bone width={55} height={12} />
              <Bone width={40} height={10} />
            </View>
          </View>
        ))}
      </View>

      {/* Action Footer */}
      <View className="w-full py-4 border-t border-base-200 bg-base-100 items-center justify-center">
        <Bone width={150} height={14} />
      </View>
    </SkeletonContainer>
  );
}
