// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import { Bone, SkeletonContainer } from "@/components/reuseable";

export interface IExpenseCardSkeletonProps {
  count?: number;
}

export default function ExpenseCardSkeleton({
  count = 4,
}: Readonly<IExpenseCardSkeletonProps>) {
  const cards = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-3">
      {cards.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm gap-y-3"
        >
          {/* Row 1: Category Name & Amount */}
          <View className="flex-row items-start justify-between">
            <Bone width="45%" height={18} borderRadius={4} />
            <Bone width={70} height={18} borderRadius={4} />
          </View>

          {/* Row 2: Description */}
          <Bone width="65%" height={14} borderRadius={4} />

          {/* Row 3: Badges Row */}
          <View className="flex-row items-center justify-end gap-2">
            <Bone width={80} height={22} borderRadius={9999} />
            <Bone width={60} height={22} borderRadius={9999} />
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-base-200 w-full" />

          {/* Bottom Metadata Details Row */}
          <View className="flex-row items-center justify-between pt-0.5">
            <Bone width={65} height={14} borderRadius={4} />
            <Bone width={75} height={14} borderRadius={4} />
            <Bone width={60} height={14} borderRadius={4} />
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
