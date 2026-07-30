import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import React from "react";
import { View } from "react-native";

export default function SalesAreaChartSkeleton() {
  return (
    <SkeletonContainer className="bg-base-300 rounded-xl border border-base-200 shadow-sm p-5 w-full">
      {/* Header Section */}
      <View className="flex-row justify-between items-center pb-4 border-b border-base-200 mb-4">
        <View className="gap-y-1.5">
          <Bone width={110} height={16} />
          <Bone width={90} height={18} className="mt-1" />
        </View>
      </View>

      {/* Chart Body */}
      <View className="h-[130px] flex-row items-end justify-between px-4 pb-4">
        <Bone width={20} height="40%" />
        <Bone width={20} height="70%" />
        <Bone width={20} height="50%" />
        <Bone width={20} height="85%" />
        <Bone width={20} height="60%" />
        <Bone width={20} height="90%" />
        <Bone width={20} height="75%" />
      </View>
    </SkeletonContainer>
  );
}
