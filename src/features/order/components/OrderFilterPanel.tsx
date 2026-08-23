import React, { useMemo } from "react";
import { View } from "react-native";
import FilterDrawer, {
  IFilterField,
} from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";

import { IOrderFilterValues } from "../types/orderFilter.types";

// ==================== TYPES ====================
export interface IOrderFilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterValues: IOrderFilterValues;
  setFilterValues: (values: IOrderFilterValues) => void;
}

// ==================== COMPONENT ====================
export function OrderFilterPanel({
  searchQuery,
  setSearchQuery,
  filterValues,
  setFilterValues,
}: Readonly<IOrderFilterPanelProps>) {
  // ==================== HOOKS ====================

  // Define dynamic filter fields for the FilterDrawer
  const filterFields: IFilterField[] = useMemo(() => {
    const fields: IFilterField[] = [
      {
        id: "status",
        label: "Order Status",
        type: "chips",
        isMultiSelect: true,
        options: [
          { id: "all", label: "All" },
          { id: "pending", label: "Pending" },
          { id: "kitchen", label: "Kitchen" },
          { id: "completed", label: "Completed" },
        ],
      },
      {
        id: "payment_status",
        label: "Payment Status",
        type: "chips",
        isMultiSelect: false,
        options: [
          { id: "all", label: "All" },
          { id: "paid", label: "Paid" },
          { id: "unpaid", label: "Unpaid" },
        ],
      },
      {
        id: "order_type",
        label: "Order Type",
        type: "chips",
        isMultiSelect: true,
        options: [
          { id: "all", label: "All" },
          { id: "eat_in", label: "Eat In" },
          { id: "delivery", label: "Delivery" },
          { id: "take_away", label: "Take Away" },
          { id: "walk_in", label: "Walk In" },
        ],
      },
      {
        id: "customer_name",
        label: "Customer Name",
        type: "text",
        keyboardType: "default",
      },
      {
        id: "customer_phone",
        label: "Customer Phone",
        type: "text",
        keyboardType: "phone-pad",
      },
      {
        id: "table_number",
        label: "Table Number",
        type: "text",
        keyboardType: "default",
      },
      { id: "date_range", label: "Date Range", type: "date-range" },
      { id: "amount_range", label: "Price Range", type: "number-range" },
    ];

    return fields;
  }, []);

  // ==================== RENDER ====================
  return (
    <View className="gap-y-3 mb-4">
      {/* Search Bar & Custom Filter Drawer */}
      <View className="flex-row items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search by Order ID..."
          keyboardType="numeric"
          containerClassName="flex-1 rounded-xl py-2"
        />
        <FilterDrawer
          fields={filterFields}
          values={filterValues as unknown as Record<string, unknown>}
          onApply={(values) =>
            setFilterValues(values as unknown as IOrderFilterValues)
          }
          onClear={() =>
            setFilterValues({
              status: ["all"],
              payment_status: "all",
              order_type: ["all"],
              customer_name: "",
              customer_phone: "",
              table_number: "",
              date_range: { start: "", end: "" },
              amount_range: { min: "", max: "" },
            } as IOrderFilterValues)
          }
        />
      </View>
    </View>
  );
}
