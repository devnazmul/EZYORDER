// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components & utils
import {
  Bone,
  SkeletonContainer,
} from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";

export default function BusinessInfoCardSkeleton() {
  return (
    <SkeletonContainer className="gap-y-3">
      {/* 1. Header Skeleton */}
      <View className="flex-row items-center gap-3 bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm">
        <Bone width={WP("12%")} height={WP("12%")} circle />
        <View className="flex-1 gap-y-2">
          <Bone width={WP("40%")} height={WP("5%")} borderRadius={6} />
          <Bone width={WP("25%")} height={WP("4%")} borderRadius={9999} />
        </View>
      </View>

      {/* 2. Contact Details Card Skeleton */}
      <View className="bg-base-300 rounded-2xl border border-base-200 p-4 shadow-sm gap-y-3">
        <Bone
          width={WP("35%")}
          height={WP("4.5%")}
          borderRadius={6}
          className="mb-1"
        />
        <View className="flex-row items-center gap-3">
          <Bone width={WP("6%")} height={WP("6%")} circle />
          <View className="flex-1 gap-y-1">
            <Bone width={WP("20%")} height={WP("3.5%")} borderRadius={4} />
            <Bone width={WP("50%")} height={WP("4%")} borderRadius={4} />
          </View>
        </View>
        <View className="flex-row items-center gap-3">
          <Bone width={WP("6%")} height={WP("6%")} circle />
          <View className="flex-1 gap-y-1">
            <Bone width={WP("20%")} height={WP("3.5%")} borderRadius={4} />
            <Bone width={WP("40%")} height={WP("4%")} borderRadius={4} />
          </View>
        </View>
      </View>

      {/* 3. Services Card Skeleton */}
      <View className="bg-base-300 rounded-2xl border border-base-200 p-4 shadow-sm gap-y-3">
        <Bone
          width={WP("45%")}
          height={WP("4.5%")}
          borderRadius={6}
          className="mb-1"
        />
        <View className="bg-base-200/50 p-3 rounded-xl gap-y-2">
          <View className="flex-row items-center justify-between">
            <Bone width={WP("30%")} height={WP("4%")} borderRadius={4} />
            <Bone width={WP("15%")} height={WP("5%")} borderRadius={9999} />
          </View>
          <View className="flex-row gap-2 mt-1">
            <Bone width={WP("28%")} height={WP("7%")} borderRadius={8} />
            <Bone width={WP("28%")} height={WP("7%")} borderRadius={8} />
          </View>
        </View>
      </View>
    </SkeletonContainer>
  );
}
