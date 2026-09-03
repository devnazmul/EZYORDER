import React from "react";
import { View } from "react-native";
import { SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { WP } from "@/utils/getResponsiveSizes";

export default function TableCardSkeleton() {
  return (
    <SkeletonContainer
      style={{
        padding: WP("3%"),
        minHeight: 155,
      }}
      className="bg-base-300 border border-base-200 rounded-2xl flex-col justify-between"
    >
      {/* Top row: Icon + Badges */}
      <View className="flex-row items-start justify-between">
        {/* Left Side: TableIcon skeleton */}
        <View
          style={{ width: 68, height: 68 }}
          className="rounded-3xl bg-slate-100 flex items-center justify-center shadow-sm"
        >
          {/* Rounded table surface placeholder */}
          <View className="w-9 h-9 rounded-xl bg-slate-200" />
        </View>

        {/* Right Side: 3 Badges */}
        <View className="flex-col items-end gap-1.5">
          <View className="w-16 h-5 rounded-full bg-slate-200" />
          <View className="w-14 h-5 rounded-full bg-slate-200" />
          <View className="w-16 h-5 rounded-full bg-slate-200" />
        </View>
      </View>

      {/* Info Section */}
      <View className="mt-3">
        {/* Table Name */}
        <View className="w-24 h-5 rounded bg-slate-200" />
        {/* Capacity */}
        <View className="w-16 h-3 rounded bg-slate-200 mt-2" />
      </View>
    </SkeletonContainer>
  );
}
