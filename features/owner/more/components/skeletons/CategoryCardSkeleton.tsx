import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

interface CategoryCardSkeletonProps {
  count?: number;
}

export default function CategoryCardSkeleton({ count = 4 }: CategoryCardSkeletonProps) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-4">
      {cards.map((key) => (
        <View
          key={key}
          style={{ padding: WP("3%") }}
          className="bg-base-300 border border-base-200 rounded-xl shadow-sm"
        >
          {/* Top Row: Name, time-based badge */}
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center flex-1 pr-2 gap-2">
              {/* Name bone */}
              <Bone width={WP("45%")} height={getResponsiveFontSize("md") + 2} borderRadius={4} />
              {/* Optional Time-based badge bone */}
              <Bone width={WP("22%")} height={getResponsiveFontSize("xs") + 4} borderRadius={9999} />
            </View>
          </View>

          {/* Details Row: Description, Status, Dishes count */}
          <View className="flex-row border-t border-base-200/50 border-dashed pt-3 justify-between">
            {/* Description */}
            <View className="flex-1 pr-2">
              <Bone
                width={WP("18%")}
                height={getResponsiveFontSize("xs") - 1}
                borderRadius={4}
                className="mb-1.5"
              />
              <Bone width={WP("40%")} height={getResponsiveFontSize("xs") + 2} borderRadius={4} />
            </View>

            {/* Status */}
            <View className="items-start px-2">
              <Bone
                width={WP("12%")}
                height={getResponsiveFontSize("xs") - 1}
                borderRadius={4}
                className="mb-1.5"
              />
              <Bone width={WP("16%")} height={getResponsiveFontSize("xs") + 6} borderRadius={9999} />
            </View>

            {/* Dishes count */}
            <View className="items-start pl-2">
              <Bone
                width={WP("12%")}
                height={getResponsiveFontSize("xs") - 1}
                borderRadius={4}
                className="mb-1.5"
              />
              <Bone width={WP("8%")} height={getResponsiveFontSize("md")} borderRadius={4} />
            </View>
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
