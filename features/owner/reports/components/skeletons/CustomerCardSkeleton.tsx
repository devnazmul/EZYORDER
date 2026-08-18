import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function CustomerCardSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm mb-4">
      <View style={{ padding: WP("3.5%") }} className="flex-row items-center justify-between">
        {/* Left Side Info */}
        <View className="flex-row items-center flex-1 mr-2">
          {/* Avatar Circle */}
          <Bone width={40} height={40} circle={true} className="mr-3" />
          
          {/* Name & Subtitle Details */}
          <View className="flex-1 gap-y-1.5">
            <Bone width="60%" height={16} borderRadius={4} />
            <View className="flex-row items-center gap-x-2">
              <Bone width={50} height={10} borderRadius={2} />
              <Bone width={60} height={14} borderRadius={4} />
            </View>
          </View>
        </View>

        {/* Right Side Info */}
        <View className="flex-row items-center gap-2">
          <View className="items-end gap-y-1.5">
            <Bone width={55} height={16} borderRadius={4} />
            <Bone width={45} height={10} borderRadius={2} />
          </View>
          {/* Chevron */}
          <Bone width={20} height={20} circle={true} />
        </View>
      </View>
    </SkeletonContainer>
  );
}
