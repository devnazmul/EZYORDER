// 1. React / React Native
import React from "react";
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { CustomText, StatusBadge } from "@/components/reuseable";

// 6. Types
import type { IExpenseType } from "@/features/expenses/types/expenses.types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";

interface IExpenseTypeCardProps {
  readonly expenseType: IExpenseType;
  readonly onPress?: () => void;
  readonly onEdit?: () => void;
  readonly onDelete?: () => void;
}

export default function ExpenseTypeCard({
  expenseType,
  onPress,
  onEdit,
  onDelete,
}: Readonly<IExpenseTypeCardProps>) {
  const isActive = !!expenseType.is_active;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm"
    >
      {/* Title & Right Actions (Status Badge -> Delete Button -> Edit Button) */}
      <View className="flex-row items-center justify-between gap-2 mb-2">
        <CustomText
          size="md"
          weight="bold"
          variant="primary"
          className="flex-1 pr-1"
          numberOfLines={1}
        >
          {expenseType.name}
        </CustomText>

        <View className="flex-row items-center gap-2">
          {/* Status Badge */}
          <StatusBadge status={isActive ? "active" : "inactive"} />

          {/* Delete Button (To the right of status badge) */}
          {onDelete && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              accessibilityRole="button"
              accessibilityLabel="Delete Expense Type"
              className="p-1.5 rounded-lg bg-error/10 items-center justify-center"
            >
              <MaterialIcons
                name="delete-outline"
                size={WP("4.5%")}
                color="#EF4444"
              />
            </TouchableOpacity>
          )}

          {/* Edit Button (To the right of delete button) */}
          {onEdit && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              accessibilityRole="button"
              accessibilityLabel="Edit Expense Type"
              className="p-1.5 rounded-lg bg-primary/10 items-center justify-center"
            >
              <MaterialIcons
                name="edit"
                size={WP("4.5%")}
                color={COLORS.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Description */}
      {expenseType.description ? (
        <CustomText
          size="xs"
          weight="semibold"
          variant="tertiary"
          className="leading-relaxed mt-1"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {expenseType.description}
        </CustomText>
      ) : (
        <CustomText
          size="xs"
          weight="semibold"
          variant="tertiary"
          className="opacity-50 italic mt-1"
        >
          No description provided
        </CustomText>
      )}
    </TouchableOpacity>
  );
}
