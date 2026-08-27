// 1. React / React Native
import React, { useMemo } from "react";
import { View } from "react-native";

// 4. Shared components
import FilterDrawer, {
  IFilterField,
} from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";

// 7. Constants/utils
import { getDateRange } from "@/utils";
import { IOrderFilterValues } from "../types/orderFilter.types";

// ==================== TYPES ====================
export interface IOrderFilterPanelProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterValues: IOrderFilterValues;
  setFilterValues: (values: IOrderFilterValues) => void;
}

const DELIVERY_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "kitchen", label: "Kitchen" },
  { id: "ready", label: "Ready" },
  { id: "picked_up", label: "Picked Up" },
  { id: "en route", label: "En Route" },
  { id: "arrived", label: "Arrived" },
  { id: "completed", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

const STANDARD_STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "kitchen", label: "Kitchen" },
  { id: "ready", label: "Ready" },
  { id: "completed", label: "Completed" },
];

const ORDER_TYPE_OPTIONS = [
  { id: "all", label: "All Channels" },
  { id: "eat_in", label: "Eat In" },
  { id: "delivery", label: "Delivery" },
  { id: "take_away", label: "Take Away" },
  { id: "walk_in", label: "Walk In" },
];

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
    const isDelivery = Array.isArray(filterValues.order_type)
      ? filterValues.order_type.includes("delivery")
      : filterValues.order_type === "delivery";

    const statusOptions = isDelivery
      ? DELIVERY_STATUS_OPTIONS
      : STANDARD_STATUS_OPTIONS;

    const fields: IFilterField[] = [
      {
        id: "order_type",
        label: "Order Type",
        type: "dropdown",
        isMultiSelect: true,
        options: ORDER_TYPE_OPTIONS,
        onFieldChange: (
          selectedType: unknown,
          currentValues: Record<string, unknown>,
        ) => {
          const isSelectedDelivery = Array.isArray(selectedType)
            ? selectedType.includes("delivery")
            : selectedType === "delivery";

          const validStatuses = new Set(
            (isSelectedDelivery
              ? DELIVERY_STATUS_OPTIONS
              : STANDARD_STATUS_OPTIONS
            ).map((opt) => opt.id),
          );

          const currentStatus = currentValues.status;
          if (Array.isArray(currentStatus)) {
            const filtered = currentStatus.filter((st) =>
              validStatuses.has(st),
            );
            if (filtered.length === 0) {
              return { status: ["all"] };
            }
            return { status: filtered };
          }
          return undefined;
        },
      },
      {
        id: "status",
        label: "Order Status",
        type: "dropdown",
        isMultiSelect: true,
        options: statusOptions,
      },
      {
        id: "payment_status",
        label: "Payment Status",
        type: "dropdown",
        isMultiSelect: false,
        options: [
          { id: "all", label: "All Payment Statuses" },
          { id: "paid", label: "Paid" },
          { id: "partial_paid", label: "Partial Paid" },
          { id: "unpaid", label: "Unpaid" },
        ],
      },
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
      { id: "date_range", label: "Date Range", type: "date-range" },
      { id: "time_range", label: "Time Range", type: "time-range" },
      { id: "amount_range", label: "Price Range", type: "number-range" },
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
    ];

    return fields;
  }, [filterValues.order_type]);

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
        <FilterDrawer<IOrderFilterValues>
          fields={filterFields}
          values={filterValues}
          onApply={setFilterValues}
          onClear={() => {
            setFilterValues({
              period: "All Time",
              status: ["all"],
              payment_status: "all",
              order_type: ["all"],
              customer_name: "",
              customer_phone: "",
              table_number: "",
              date_range: {
                start: "",
                end: "",
              },
              time_range: {
                start: "",
                end: "",
              },
              amount_range: { min: "", max: "" },
            });
          }}
        />
      </View>
    </View>
  );
}
