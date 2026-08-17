import { Bone, SkeletonContainer } from "@/components/reuseable/skeletons/Skeleton";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { View } from "react-native";

interface DealCardSkeletonProps {
  count?: number;
}

export default function DealCardSkeleton({ count = 4 }: DealCardSkeletonProps) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-4">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm mb-4"
        >
          <View className="flex-row p-3 gap-3">
            {/* Deal Thumbnail Image Placeholder */}
            <View className="w-20 h-20 rounded-lg overflow-hidden items-center justify-center flex-shrink-0">
              <Bone width="100%" height="100%" borderRadius={8} />
            </View>

            {/* Details Placeholder */}
            <View className="flex-1 justify-between py-0.5 pr-1">
              <View>
                <View className="flex-row justify-between items-start gap-2">
                  {/* Name placeholder */}
                  <Bone width="50%" height={16} borderRadius={4} />
                  {/* Status badge placeholder */}
                  <Bone width="16%" height={16} borderRadius={9999} />
                </View>
                {/* Description placeholder */}
                <Bone width="80%" height={12} borderRadius={4} className="mt-2" />

                {/* Linked Items List Placeholder */}
                <View className="mt-3 gap-y-1.5">
                  <Bone width="35%" height={8} borderRadius={4} />
                  <View className="flex-row items-center gap-2">
                    <Bone width={10} height={10} circle />
                    <Bone width="50%" height={10} borderRadius={4} />
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Bone width={10} height={10} circle />
                    <Bone width="60%" height={10} borderRadius={4} />
                  </View>
                </View>
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
