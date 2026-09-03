// 1. React / React Native
import React from "react";
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// 4. Shared components
import { BottomSheet, CustomText, StatusBadge } from "@/components/reuseable";

// 6. Types
import type { IExpenseType } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";

export interface IExpenseTypeDetailBottomSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly expenseType: IExpenseType | null;
  readonly onEdit?: () => void;
}

export default function ExpenseTypeDetailBottomSheet({
  visible,
  onClose,
  expenseType,
  onEdit,
}: Readonly<IExpenseTypeDetailBottomSheetProps>) {
  if (!expenseType) return null;

  const isActive = !!expenseType.is_active;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "80%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Drawer Header */}
      <View
        style={{ paddingHorizontal: WP("6%") }}
        className="flex-row justify-between items-center border-b border-base-200 pb-3 pt-2"
      >
        <View className="flex-1 pr-2">
          <CustomText
            variant="primary"
            size="md"
            weight="bold"
            numberOfLines={1}
          >
            {expenseType.name}
          </CustomText>
          <CustomText
            variant="tertiary"
            size="xs"
            weight="medium"
            className="mt-0.5"
          >
            Expense Category Detail
          </CustomText>
        </View>

        <View className="flex-row items-center gap-2">
          <StatusBadge status={isActive ? "active" : "inactive"} />

          {onEdit && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                onClose();
                onEdit();
              }}
              accessibilityRole="button"
              accessibilityLabel="Edit Expense Category"
              className="p-1.5 rounded-lg bg-primary/10 items-center justify-center ml-1"
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

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: WP("6%"),
          paddingTop: 16,
          paddingBottom: HP("6%"),
        }}
      >
        {/* Description */}
        <View className="py-1">
          <CustomText
            variant="tertiary"
            size="xs"
            weight="bold"
            className="mb-1.5"
          >
            Description
          </CustomText>
          <CustomText
            variant="primary"
            size="xs"
            weight="semibold"
            className="leading-5 bg-base-300/40 p-3 rounded-lg border border-base-200"
          >
            {expenseType.description ||
              "No description provided for this expense category."}
          </CustomText>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
