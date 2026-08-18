import { SkeletonContainer, Bone } from "@/components/reuseable/skeletons/Skeleton";
import { WP, HP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

export default function SalesHourlyListSkeleton() {
  return (
    <SkeletonContainer className="flex flex-col gap-3 pb-6 w-full">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View
          key={i}
          style={{ padding: WP("3%") }}
          className="bg-base-300 border border-base-200 rounded-lg gap-y-3"
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2 items-center">
              {/* Icon Circle placeholder */}
              <Bone width={WP("4.5%")} height={WP("4.5%")} circle />
              {/* Hour text placeholder */}
              <Bone width={65} height={12} />
            </View>
            <View className="items-end gap-y-1.5">
              {/* Sales amount placeholder */}
              <Bone width={65} height={12} />
              {/* Orders count placeholder */}
              <Bone width={45} height={10} />
            </View>
          </View>
          {/* Progress bar placeholder */}
          <Bone width="100%" height={HP("0.8%")} borderRadius={6} />
        </View>
      ))}
    </SkeletonContainer>
  );
}
