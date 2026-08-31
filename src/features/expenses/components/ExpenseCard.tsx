// 1. React / React Native
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// 3. External libraries
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared utils
import { formatAmount, formatDateTime } from "@/utils/formatters";

// 5. Feature services
import { ExpenseService } from "../services/expense.service";

// 6. Types
import type { IExpense, IExpenseType } from "../types";

export interface IExpenseCardProps {
  expense: IExpense;
  expenseTypes: IExpenseType[];
  currencySymbol?: string;
  onPress: () => void;
}

function ExpenseCardComponent({
  expense,
  expenseTypes,
  currencySymbol = "£",
  onPress,
}: Readonly<IExpenseCardProps>) {
  const categoryName = ExpenseService.getExpenseCategoryName(
    expense.expense_type,
    expenseTypes,
  );

  const rawDate = expense.payment_date
    ? expense.payment_date.split(" ")[0]
    : "";
  const formattedDate = formatDateTime(rawDate) || "N/A";

  const detailsDisplay = ExpenseService.formatExpenseDetailsDisplay(
    expense.paid_by,
    formattedDate,
  );

  const formattedAmount = formatAmount(expense.amount, currencySymbol);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-base-300 border border-base-200 rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-row items-center flex-1 mr-3">
        {/* Category Icon */}
        <View className="w-12 h-12 rounded-lg items-center justify-center bg-neutral/10 mr-4">
          <MaterialIcons name="receipt" size={24} color="#464747" />
        </View>

        {/* Expense Info */}
        <View className="flex-1 min-w-0">
          <Text
            className="text-sm font-bold text-neutral truncate"
            numberOfLines={1}
          >
            {categoryName}
          </Text>
          {expense.description && expense.description.trim() !== "" ? (
            <Text
              className="text-xs text-neutral/80 mt-0.5 truncate"
              numberOfLines={1}
            >
              {expense.description.trim()}
            </Text>
          ) : null}
          <Text
            className="text-[11px] text-accent font-semibold leading-4 mt-0.5"
            numberOfLines={1}
          >
            {detailsDisplay}
          </Text>
        </View>
      </View>

      {/* Amount Display */}
      <View className="text-right">
        <Text className="text-sm font-bold text-primary">
          {formattedAmount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(ExpenseCardComponent);
