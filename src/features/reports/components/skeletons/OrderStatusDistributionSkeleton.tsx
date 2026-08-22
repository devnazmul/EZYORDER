import { Bone, SkeletonContainer } from "@/components/reuseable";
import { WP } from "@/utils";
import React from "react";
import { View } from "react-native";

export interface IOrderStatusDistributionSkeletonProps {
  containerClassName?: string;
}

export default function OrderStatusDistributionSkeleton({
  containerClassName = "",
}: Readonly<IOrderStatusDistributionSkeletonProps>) {
  return (
    <SkeletonContainer
      className={`bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm ${containerClassName}`}
    >
      {/* Header Section */}
      <View
        style={{ paddingHorizontal: WP("4%") }}
        className="border-b border-base-200 py-4"
      >
        <Bone width={WP("45%")} height={16} borderRadius={4} />
      </View>

      {/* Body: Doughnut on Left, Legend on Right */}
      <View
        style={{ padding: WP("3.5%") }}
        className="flex-row items-center justify-between py-4"
      >
        {/* Doughnut Ring Skeleton */}
        <View
          style={{ width: WP("30%"), height: WP("30%") }}
          className="items-center justify-center relative"
        >
          <Bone
            width={WP("30%")}
            height={WP("30%")}
            borderRadius={WP("15%")}
            className="bg-base-200"
          />
          <View
            style={{ width: WP("22%"), height: WP("22%") }}
            className="absolute rounded-full bg-base-300 items-center justify-center gap-y-1"
          >
            <Bone width={WP("10%")} height={14} borderRadius={3} />
            <Bone width={WP("8%")} height={10} borderRadius={3} />
          </View>
        </View>

        {/* Legend Skeletons on Right */}
        <View
          className="flex-1 flex-col gap-y-3 ml-4"
          style={{ maxWidth: WP("50%") }}
        >
          {[1, 2, 3].map((i) => (
            <View key={i} className="flex-row items-center gap-x-2">
              <Bone width={WP("9%")} height={18} borderRadius={6} />
              <Bone width={WP("10%")} height={14} borderRadius={4} />
              <Bone width={WP("16%")} height={14} borderRadius={4} />
            </View>
          ))}
        </View>
      </View>
    </SkeletonContainer>
  );
}
