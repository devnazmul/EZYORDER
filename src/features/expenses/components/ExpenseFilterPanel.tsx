// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components
import FilterDrawer, {
  IFilterField,
} from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";

// 6. Schema & Types
import { expenseFilterSchema, type IExpenseFilterValues } from "../schema";

// ==================== TYPES ====================
export interface IExpenseFilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterValues: IExpenseFilterValues;
  setFilterValues: (values: IExpenseFilterValues) => void;
  defaultFilters: IExpenseFilterValues;
}

const FILTER_FIELDS: IFilterField[] = [
  {
    id: "date_range",
    label: "Payment Date Range",
    type: "date-range" as const,
  },
  {
    id: "amount_range",
    label: "Amount Range",
    type: "number-range" as const,
  },
  {
    id: "payment_method",
    label: "Payment Method",
    type: "chips" as const,
    options: [
      { id: "all", label: "All Methods" },
      { id: "cash", label: "Cash" },
      { id: "card", label: "Card" },
      { id: "bank_transfer", label: "Bank Transfer" },
    ],
  },
  {
    id: "order_by",
    label: "Sort Order",
    type: "chips" as const,
    options: [
      { id: "desc", label: "Newest First" },
      { id: "asc", label: "Oldest First" },
    ],
  },
];

// ==================== COMPONENT ====================
export default function ExpenseFilterPanel({
  searchQuery,
  setSearchQuery,
  filterValues,
  setFilterValues,
  defaultFilters,
}: Readonly<IExpenseFilterPanelProps>) {
  const handleApply = (rawValues: Record<string, any>) => {
    const parseResult = expenseFilterSchema.safeParse(rawValues);
    if (parseResult.success) {
      setFilterValues(parseResult.data);
    } else {
      setFilterValues(rawValues as IExpenseFilterValues);
    }
  };

  return (
    <View className="flex-row items-center gap-3">
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search expenses..."
        containerClassName="flex-1"
      />
      <FilterDrawer<IExpenseFilterValues>
        fields={FILTER_FIELDS}
        values={filterValues}
        onApply={handleApply}
        onClear={() => setFilterValues(defaultFilters)}
      />
    </View>
  );
}
