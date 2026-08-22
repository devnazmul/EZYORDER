import { Bone, SkeletonContainer } from "@/components/reuseable";
import { WP } from "@/utils";
import React from "react";
import { View } from "react-native";

export interface IOrderSalesMetricsSkeletonProps {
  containerClassName?: string;
}

export default function OrderSalesMetricsSkeleton({
  containerClassName = "",
}: Readonly<IOrderSalesMetricsSkeletonProps>) {
  return (
    <SkeletonContainer
      className={`bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm ${containerClassName}`}
    >
      {/* Header */}
      <View
        style={{ paddingHorizontal: WP("4%") }}
        className="border-b border-base-200 py-4"
      >
        <Bone width={WP("35%")} height={16} borderRadius={4} />
      </View>

      {/* Body: 3 Bars Simulator */}
      <View style={{ padding: WP("3.5%") }} className="py-4 items-center">
        <View className="flex-row items-end justify-around w-full h-[140px] px-6 pb-2 border-b border-base-200">
          <View className="items-center gap-y-2">
            <Bone width={WP("14%")} height={110} borderRadius={4} />
            <Bone width={WP("10%")} height={12} borderRadius={3} />
          </View>
          <View className="items-center gap-y-2">
            <Bone width={WP("14%")} height={80} borderRadius={4} />
            <Bone width={WP("10%")} height={12} borderRadius={3} />
          </View>
          <View className="items-center gap-y-2">
            <Bone width={WP("14%")} height={40} borderRadius={4} />
            <Bone width={WP("10%")} height={12} borderRadius={3} />
          </View>
        </View>

        {/* Legend Row */}
        <View className="flex-row justify-around w-full mt-4 pt-1">
          <View className="items-center gap-y-1.5">
            <Bone width={WP("16%")} height={10} borderRadius={3} />
            <Bone width={WP("14%")} height={14} borderRadius={4} />
          </View>
          <View className="items-center gap-y-1.5">
            <Bone width={WP("16%")} height={10} borderRadius={3} />
            <Bone width={WP("14%")} height={14} borderRadius={4} />
          </View>
          <View className="items-center gap-y-1.5">
            <Bone width={WP("16%")} height={10} borderRadius={3} />
            <Bone width={WP("14%")} height={14} borderRadius={4} />
          </View>
        </View>
      </View>
    </SkeletonContainer>
  );
}
