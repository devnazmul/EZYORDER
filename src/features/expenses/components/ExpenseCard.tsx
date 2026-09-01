// 1. React / React Native
import React from "react";
import { TouchableOpacity, View } from "react-native";

// 3. External libraries
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components & utils
import { Badge, CustomText } from "@/components/reuseable";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import getGeneralStatusConfig from "@/utils/getGeneralStatusConfig";
import getPaymentMethodsConfig from "@/utils/getPaymentMethodsConfig";
import { WP } from "@/utils/getResponsiveSizes";

// 5. Feature services
import { ExpenseService } from "../services/expense.service";

// 6. Types
import { COLORS } from "@/constants";
import type { IExpense, IExpenseType } from "../types";

export interface IExpenseCardProps {
  expense: IExpense;
  expenseTypes: IExpenseType[];
  currencySymbol?: string;
  onPress: () => void;
  onEdit?: (expense: IExpense) => void;
}

function ExpenseCardComponent({
  expense,
  expenseTypes,
  currencySymbol = "£",
  onPress,
  onEdit,
}: Readonly<IExpenseCardProps>) {
  const categoryName = ExpenseService.getExpenseCategoryName(
    expense.expense_type,
    expenseTypes,
  );

  const rawDate = expense.payment_date
    ? expense.payment_date.split(" ")[0]
    : "";
  const formattedDate = formatDateTime(rawDate) || "N/A";

  const paymentMethodConfig = getPaymentMethodsConfig(expense.payment_method);
  const paidBy = expense.paid_by?.trim() || "N/A";
  const formattedAmount = formatAmount(expense.amount, currencySymbol);

  const receiptsCount = expense.reciepts?.length ?? 0;
  const isExpenseActive = expense.is_active !== 0;
  const statusConfig = getGeneralStatusConfig(
    isExpenseActive ? "active" : "inactive",
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="bg-base-300 border border-base-200 rounded-2xl p-4 mb-3 shadow-sm gap-y-3"
    >
      {/* Top Row: Category Name & Amount */}
      <View className="flex-row items-start justify-between">
        <CustomText
          variant="primary"
          weight="bold"
          size="md"
          className="flex-1 mr-3"
        >
          {categoryName}
        </CustomText>
        <CustomText
          variant="currency"
          weight="bold"
          size="md"
          className="shrink-0"
        >
          {formattedAmount}
        </CustomText>
      </View>

      {/* Description below Category Name & Amount */}
      {expense.description && expense.description.trim() !== "" ? (
        <CustomText
          variant="secondary"
          size="xs"
          numberOfLines={2}
          ellipsizeMode="tail"
          className="-mt-1"
        >
          {expense.description.trim()}
        </CustomText>
      ) : (
        <CustomText
          variant="secondary"
          size="xs"
          numberOfLines={2}
          ellipsizeMode="tail"
          className="-mt-1"
        >
          No description provided
        </CustomText>
      )}

      {/* Row of Badges: Payment Method & Status */}
      <View className="flex-row items-center justify-end gap-2 flex-wrap">
        <Badge
          text={paymentMethodConfig.label}
          icon={
            <MaterialIcons
              name="payment"
              size={12}
              color={paymentMethodConfig.color}
              style={{ marginRight: 2 }}
            />
          }
          containerStyle={{
            backgroundColor: `${paymentMethodConfig.color}15`,
            borderColor: `${paymentMethodConfig.color}66`,
            borderWidth: 1,
          }}
          textStyle={{
            color: paymentMethodConfig.color,
          }}
        />
        <Badge
          text={statusConfig.label}
          icon={
            <MaterialIcons
              name={statusConfig.iconName}
              size={12}
              color={statusConfig.iconColor}
              style={{ marginRight: 2 }}
            />
          }
          containerStyle={{
            backgroundColor: statusConfig.backgroundColor,
            borderColor: statusConfig.borderColor,
            borderWidth: 1,
          }}
          textStyle={{
            color: statusConfig.textColor,
          }}
        />

        {Boolean(onEdit) && (
          <TouchableOpacity
            onPress={(e) => {
              e.stopPropagation();
              onEdit?.(expense);
            }}
            activeOpacity={0.7}
            className="p-1.5 rounded-lg bg-base-100 border border-base-200"
          >
            <MaterialIcons
              name="edit"
              size={WP("3.5%")}
              color={COLORS.accent}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Divider */}
      <View className="h-[1px] bg-base-200 w-full" />

      {/* Bottom Metadata Details Row: Paid By, Payment Date, Receipts */}
      <View className="flex-row items-center justify-between flex-wrap gap-y-1.5 pt-0.5">
        {/* Paid By */}
        <View className="flex-row items-center gap-x-1 mr-2">
          <MaterialIcons name="person-outline" size={14} color="#6B7280" />
          <CustomText
            variant="secondary"
            weight="medium"
            size="xs"
            numberOfLines={1}
          >
            {paidBy}
          </CustomText>
        </View>

        {/* Payment Date */}
        <View className="flex-row items-center gap-x-1 mr-2">
          <MaterialIcons name="event" size={14} color="#6B7280" />
          <CustomText
            variant="secondary"
            weight="medium"
            size="xs"
            numberOfLines={1}
          >
            {formattedDate}
          </CustomText>
        </View>

        {/* Number of Receipts */}
        <View className="flex-row items-center gap-x-1">
          <MaterialIcons
            name="attach-file"
            size={14}
            color={receiptsCount > 0 ? "#10B981" : "#9CA3AF"}
          />
          <CustomText
            variant={receiptsCount > 0 ? "primary" : "tertiary"}
            weight="semibold"
            size="xs"
            className={receiptsCount > 0 ? "text-success" : ""}
            numberOfLines={1}
          >
            {receiptsCount} {receiptsCount === 1 ? "Receipt" : "Receipts"}
          </CustomText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default React.memo(ExpenseCardComponent);
