// 1. React / React Native
import React from "react";
import { Text, View } from "react-native";

// 4. Shared components
import FilterDrawer, {
  IFilterField,
} from "@/components/reuseable/FilterDrawer";

// 6. Schema & Types
import { expenseFilterSchema, type IExpenseFilterValues } from "../schema";
import type { IExpenseType } from "../types";

// 7. Constants/utils
import { getDateRange } from "@/utils";

// ==================== TYPES ====================
export interface IExpenseFilterPanelProps {
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  filterValues: IExpenseFilterValues;
  setFilterValues: (values: IExpenseFilterValues) => void;
  defaultFilters: IExpenseFilterValues;
  expenseTypes?: IExpenseType[];
}

// ==================== COMPONENT ====================
export default function ExpenseFilterPanel({
  filterValues,
  setFilterValues,
  defaultFilters,
  expenseTypes = [],
}: Readonly<IExpenseFilterPanelProps>) {
  const expenseTypeOptions = [
    { id: "all", label: "All Expense Types" },
    ...(expenseTypes || []).map((type) => ({
      id: String(type.id),
      label: type.name,
    })),
  ];

  const filterFields: IFilterField[] = [
    {
      id: "period",
      label: "Filter by Date",
      type: "chips",
      options: [
        { id: "Today", label: "Today" },
        { id: "Yesterday", label: "Yesterday" },
        { id: "This Week", label: "This Week" },
        { id: "This Month", label: "This Month" },
        { id: "All Time", label: "All Time" },
      ],
      onFieldChange: (selectedPeriod: unknown) => {
        const range = getDateRange(String(selectedPeriod));
        return {
          date_range: {
            start: range.start_date,
            end: range.end_date,
          },
        };
      },
    },
    {
      id: "date_range",
      label: "Custom Date Range",
      type: "date-range",
    },
    {
      id: "amount_range",
      label: "Amount Range",
      type: "number-range",
    },
    {
      id: "expense_type",
      label: "Expense Type",
      type: "dropdown",
      isMultiSelect: true,
      options: expenseTypeOptions,
    },
    {
      id: "status",
      label: "Status",
      type: "dropdown",
      options: [
        { id: "all", label: "All Statuses" },
        { id: "active", label: "Active" },
        { id: "inactive", label: "Inactive" },
      ],
    },
    {
      id: "payment_method",
      label: "Payment Method",
      type: "dropdown",
      options: [
        { id: "all", label: "All Payment Methods" },
        { id: "card", label: "Credit/Debit Card" },
        { id: "cash", label: "Cash" },
        { id: "bank_transfer", label: "Bank Transfer" },
      ],
    },
    {
      id: "paid_by",
      label: "Paid By",
      type: "text",
    },
    {
      id: "order_by",
      label: "Sort Order",
      type: "chips",
      options: [
        { id: "desc", label: "Newest First" },
        { id: "asc", label: "Oldest First" },
      ],
    },
  ];

  const handleApply = (rawValues: Record<string, unknown>) => {
    const parseResult = expenseFilterSchema.safeParse(rawValues);
    if (parseResult.success) {
      setFilterValues(parseResult.data);
    } else {
      setFilterValues(rawValues as IExpenseFilterValues);
    }
  };

  return (
    <View className="flex-row items-center justify-end gap-2">
      <Text className="text-base font-bold text-neutral">Filters:</Text>
      <FilterDrawer<IExpenseFilterValues>
        fields={filterFields}
        values={filterValues}
        onApply={handleApply}
        onClear={() => setFilterValues(defaultFilters)}
      />
    </View>
  );
}
