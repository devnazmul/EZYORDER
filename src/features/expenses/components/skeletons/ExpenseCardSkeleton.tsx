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
          className="bg-base-300 border border-base-200 rounded-2xl p-4 flex-row items-center justify-between shadow-sm"
        >
          {/* Left Column: Icon Pill & Info */}
          <View className="flex-row items-center gap-3.5 flex-1 pr-3">
            <Bone width={48} height={48} borderRadius={12} />
            <View className="flex-1 gap-y-2">
              <Bone width="60%" height={16} borderRadius={4} />
              <View className="flex-row items-center gap-2">
                <Bone width={60} height={12} borderRadius={4} />
                <Bone width={50} height={16} borderRadius={9999} />
              </View>
            </View>
          </View>

          {/* Right Column: Amount */}
          <View className="items-end gap-2">
            <Bone width={70} height={18} borderRadius={4} />
            <Bone width={16} height={16} borderRadius={4} />
          </View>
        </View>
      ))}
    </SkeletonContainer>
  );
}
