import { formatAmount, formatDateTime } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ExpenseCardProps {
  expense: {
    id: number | string;
    amount: number | string;
    payment_date: string;
    payment_method: string;
    paid_by?: string;
    note?: string;
    description?: string;
    expense_type: string | number;
  };
  expenseTypes: any[];
  onPress: () => void;
}

export default function ExpenseCard({ expense, expenseTypes, onPress }: ExpenseCardProps) {
  // Map category type details
  const categoryDetails = useMemo(() => {
    const typeId = String(expense.expense_type);
    const matchedType = expenseTypes.find((opt) => String(opt?.id) === typeId);
    const typeName =
      matchedType?.name || (typeof expense.expense_type === "string" ? expense.expense_type : "Other");

    return {
      name: typeName,
      icon: "receipt" as const,
      bgColor: "bg-neutral/10",
      color: "#464747",
    };
  }, [expense.expense_type, expenseTypes]);

  // Format date
  const formattedDate = useMemo(() => {
    if (!expense.payment_date) return "N/A";
    const rawDate = expense.payment_date.split(" ")[0];
    return formatDateTime(rawDate);
  }, [expense.payment_date]);

  // Format amount using the formatAmount utility
  const formattedAmount = useMemo(() => {
    return formatAmount(expense.amount);
  }, [expense.amount]);

  // Heading displays the expense type (category) name
  const titleDisplay = categoryDetails.name;

  // Sub-details displaying vendor name (paid_by) and payment date
  const detailsDisplay = useMemo(() => {
    const parts = [];
    if (expense.paid_by && expense.paid_by.trim() !== "") {
      parts.push(expense.paid_by.trim());
    }
    parts.push(formattedDate);
    return parts.join(" • ");
  }, [expense.paid_by, formattedDate]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-base-300 border border-base-200 rounded-lg p-4 mb-3 flex-row items-center justify-between shadow-sm"
    >
      <View className="flex-row items-center flex-1 mr-3">
        {/* Category Icon */}
        <View className={`w-12 h-12 rounded-lg items-center justify-center ${categoryDetails.bgColor} mr-4`}>
          <MaterialIcons name={categoryDetails.icon} size={24} color={categoryDetails.color} />
        </View>

        {/* Expense Info */}
        <View className="flex-1 min-w-0">
          <Text className="text-sm font-bold text-neutral truncate" numberOfLines={1}>
            {titleDisplay}
          </Text>
          {expense.description && expense.description.trim() !== "" ? (
            <Text className="text-xs text-neutral/80 mt-0.5 truncate" numberOfLines={1}>
              {expense.description.trim()}
            </Text>
          ) : null}
          <Text className="text-[11px] text-accent font-semibold leading-4 mt-0.5" numberOfLines={1}>
            {detailsDisplay}
          </Text>
        </View>
      </View>

      {/* Amount Display */}
      <View className="text-right">
        <Text className="text-sm font-black text-primary">{formattedAmount}</Text>
      </View>
    </TouchableOpacity>
  );
}
