import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

interface DishCardSkeletonProps {
  count?: number;
}

export default function DishCardSkeleton({ count = 4 }: DishCardSkeletonProps) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-4">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm mb-4"
        >
          <View className="flex-row p-3 gap-3">
            {/* Left Side: Dish Thumbnail Image Placeholder */}
            <View className="w-20 h-20 rounded-lg overflow-hidden items-center justify-center flex-shrink-0">
              <Bone width="100%" height="100%" borderRadius={8} />
            </View>

            {/* Right Side: Details Placeholder */}
            <View className="flex-1 justify-between py-0.5 pr-1">
              <View>
                <View className="flex-row justify-between items-start gap-2">
                  {/* Name placeholder */}
                  <Bone width="50%" height={16} borderRadius={4} />
                  {/* Status badge placeholder */}
                  <Bone width="16%" height={16} borderRadius={9999} />
                </View>
                {/* Description placeholder */}
                <Bone width="90%" height={12} borderRadius={4} className="mt-2" />
                <Bone width="70%" height={12} borderRadius={4} className="mt-1" />

                {/* Option badge placeholder */}
                <Bone width="24%" height={14} borderRadius={6} className="mt-2" />
              </View>

              {/* Pricing Row Placeholder */}
              <View className="flex-row justify-between items-center mt-3 pt-1.5 border-t border-base-200/50">
                <Bone width="25%" height={10} borderRadius={4} />
                <Bone width="20%" height={16} borderRadius={4} />
              </View>
            </View>
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
