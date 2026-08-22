import React from "react";
import { Text, View } from "react-native";
import StatusBadge from "@/components/reuseable/StatusBadge";

interface ExpenseType {
  id: number;
  name: string;
  description?: string;
  is_active: number | boolean;
}

interface ExpenseTypeCardProps {
  expenseType: ExpenseType;
}

export default function ExpenseTypeCard({ expenseType }: ExpenseTypeCardProps) {
  const isActive = !!expenseType.is_active;

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4">
      {/* Title & Status Badge */}
      <View className="flex-row items-start justify-between gap-3 mb-2">
        <Text className="text-md font-bold text-neutral flex-1">
          {expenseType.name}
        </Text>
        <StatusBadge status={isActive ? "active" : "inactive"} />
      </View>

      {/* Description */}
      {expenseType.description ? (
        <Text className="text-xs font-semibold text-accent leading-relaxed mt-1">
          {expenseType.description}
        </Text>
      ) : (
        <Text className="text-xs font-semibold text-accent/50 italic mt-1">
          No description provided
        </Text>
      )}
    </View>
  );
}
