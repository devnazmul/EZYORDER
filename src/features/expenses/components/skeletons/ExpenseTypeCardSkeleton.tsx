import React from "react";
import { View } from "react-native";
import { Bone, SkeletonContainer } from "@/components/reuseable";

export interface IExpenseTypeCardSkeletonProps {
  count?: number;
}

export default function ExpenseTypeCardSkeleton({
  count = 5,
}: Readonly<IExpenseTypeCardSkeletonProps>) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <SkeletonContainer className="gap-y-3">
      {items.map((key) => (
        <View
          key={key}
          className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm"
        >
          {/* Title & Status Badge */}
          <View className="flex-row items-start justify-between gap-3 mb-2">
            <Bone width="50%" height={18} borderRadius={4} />
            <Bone width={65} height={20} borderRadius={9999} />
          </View>

          {/* Description */}
          <Bone width="75%" height={14} borderRadius={4} className="mt-1" />
        </View>
      ))}
    </SkeletonContainer>
  );
}
