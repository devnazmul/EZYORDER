// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";

export default function ProfileScreenSkeleton() {
  return (
    <SkeletonContainer className="gap-y-6">
      {/* 1. Header Profile Card Skeleton */}
      <View className="bg-base-300 border border-base-200 rounded-xl p-5 shadow-sm items-center gap-3">
        <Bone width={96} height={96} circle />
        <View className="items-center gap-2 mt-1">
          <Bone width={140} height={20} borderRadius={6} />
          <Bone width={80} height={18} borderRadius={9999} />
        </View>
      </View>

      {/* 2. Personal Information Card Skeleton */}
      <View className="bg-base-300 rounded-2xl overflow-hidden border border-base-200 shadow-sm">
        <View className="border-b border-base-200 px-4 py-4">
          <Bone width={150} height={16} borderRadius={4} />
        </View>
        <View className="px-4 py-1">
          {/* Row 1 */}
          <View className="flex-row items-start gap-3 py-3.5 border-b border-base-200/50">
            <Bone width={34} height={34} borderRadius={8} />
            <View className="flex-1 gap-1.5 justify-center">
              <Bone width={80} height={12} borderRadius={4} />
              <Bone width={160} height={16} borderRadius={4} />
            </View>
          </View>
          {/* Row 2 */}
          <View className="flex-row items-start gap-3 py-3.5">
            <Bone width={34} height={34} borderRadius={8} />
            <View className="flex-1 gap-1.5 justify-center">
              <Bone width={90} height={12} borderRadius={4} />
              <Bone width={130} height={16} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      {/* 3. Role & Workplace Details Card Skeleton */}
      <View className="bg-base-300 rounded-2xl overflow-hidden border border-base-200 shadow-sm">
        <View className="border-b border-base-200 px-4 py-4">
          <Bone width={160} height={16} borderRadius={4} />
        </View>
        <View className="px-4 py-1">
          <View className="flex-row items-start gap-3 py-3.5">
            <Bone width={34} height={34} borderRadius={8} />
            <View className="flex-1 gap-1.5 justify-center">
              <Bone width={70} height={12} borderRadius={4} />
              <Bone width={120} height={16} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>

      {/* 4. Address Details Card Skeleton */}
      <View className="bg-base-300 rounded-2xl overflow-hidden border border-base-200 shadow-sm">
        <View className="border-b border-base-200 px-4 py-4">
          <Bone width={140} height={16} borderRadius={4} />
        </View>
        <View className="px-4 py-1">
          {/* Row 1 */}
          <View className="flex-row items-start gap-3 py-3.5 border-b border-base-200/50">
            <Bone width={34} height={34} borderRadius={8} />
            <View className="flex-1 gap-1.5 justify-center">
              <Bone width={70} height={12} borderRadius={4} />
              <Bone width={180} height={16} borderRadius={4} />
            </View>
          </View>
          {/* Row 2 */}
          <View className="flex-row items-start gap-3 py-3.5">
            <Bone width={34} height={34} borderRadius={8} />
            <View className="flex-1 gap-1.5 justify-center">
              <Bone width={80} height={12} borderRadius={4} />
              <Bone width={100} height={16} borderRadius={4} />
            </View>
          </View>
        </View>
      </View>
    </SkeletonContainer>
  );
}
