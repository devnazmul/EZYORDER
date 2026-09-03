import React from "react";
import { View } from "react-native";
import { SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export default function ReservationCardSkeleton() {
  return (
    <SkeletonContainer
      style={{ padding: WP("3.5%"), gap: WP("2.5%") }}
      className="bg-base-300 border border-base-200 rounded-xl shadow-sm flex-col"
    >
      {/* Top: Avatar + Name/Phone + Reservation Status Badge */}
      <View className="flex-row items-center justify-between">
        <View style={{ gap: WP("3%") }} className="flex-row items-center flex-1 mr-2">
          {/* Avatar circle */}
          <View
            style={{ width: WP("9.5%"), height: WP("9.5%"), borderRadius: 9999 }}
            className="bg-slate-200"
          />
          {/* Name & Phone */}
          <View className="flex-1 gap-1.5">
            <View className="w-24 h-4 rounded bg-slate-200" />
            <View className="w-16 h-3 rounded bg-slate-200" />
          </View>
        </View>
        {/* Status Badge */}
        <View className="w-20 h-6 rounded-full bg-slate-200" />
      </View>

      {/* Middle: Details row (Guests Count & Schedule Time) */}
      <View style={{ gap: WP("4%") }} className="flex-row items-center mt-1">
        {/* Guests count */}
        <View className="flex-row items-center gap-1.5">
          <View className="w-4 h-4 rounded bg-slate-200" />
          <View className="w-12 h-3.5 rounded bg-slate-200" />
        </View>
        {/* Schedule */}
        <View className="flex-row items-center gap-1.5">
          <View className="w-4 h-4 rounded bg-slate-200" />
          <View className="w-28 h-3.5 rounded bg-slate-200" />
        </View>
      </View>

      {/* Bottom: Nested Table Info (if assigned) */}
      <View
        style={{ paddingTop: WP("3%"), marginTop: WP("1%") }}
        className="border-t border-base-100 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-1.5">
          <View className="w-4 h-4 rounded bg-slate-200" />
          <View className="w-16 h-3.5 rounded bg-slate-200" />
        </View>
        <View className="flex-row items-center gap-2">
          <View className="w-16 h-5 rounded-full bg-slate-200" />
          <View className="w-14 h-5 rounded-full bg-slate-200" />
        </View>
      </View>
    </SkeletonContainer>
  );
}
