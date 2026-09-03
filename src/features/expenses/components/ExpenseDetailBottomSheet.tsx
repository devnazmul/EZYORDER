// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 2. Expo / Navigation / Icons
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

// 4. Shared components & utils
import { BottomSheet, CustomText } from "@/components/reuseable";
import { COLORS } from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";

// 5. Types
import type { IExpense, IExpenseType } from "../types";

export interface IExpenseDetailBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  expense: IExpense | null;
  expenseTypes?: IExpenseType[];
  currencySymbol?: string;
}

export default function ExpenseDetailBottomSheet({
  visible,
  onClose,
  expense,
}: Readonly<IExpenseDetailBottomSheetProps>) {
  if (!expense) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "90%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Drawer Header */}
      <View
        style={{ paddingHorizontal: WP("6%") }}
        className="flex-row justify-between items-center border-b border-base-200 pb-3 pt-2"
      >
        <View className="flex-row items-center gap-3">
          <View className="rounded-lg bg-primary/10 border border-primary/20 items-center justify-center p-2">
            <MaterialIcons
              name="receipt-long"
              size={20}
              color={COLORS.primary}
            />
          </View>
          <View>
            <CustomText variant="primary" size="md" weight="bold">
              Expense Details
            </CustomText>
            <CustomText
              variant="tertiary"
              size="xs"
              weight="medium"
              className="mt-0.5"
            >
              Note & Description
            </CustomText>
          </View>
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
        <View className="gap-y-4">
          {/* Note */}
          <View className="py-1">
            <CustomText
              variant="tertiary"
              size="xs"
              weight="bold"
              className="mb-1.5"
            >
              Note
            </CustomText>
            <CustomText
              variant="primary"
              size="xs"
              weight="semibold"
              className="leading-5 bg-base-300/40 p-3 rounded-lg border border-base-200"
            >
              {expense.note || "No notes logged for this entry."}
            </CustomText>
          </View>

          {/* Description */}
          {expense.description ? (
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
                {expense.description}
              </CustomText>
            </View>
          ) : null}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
