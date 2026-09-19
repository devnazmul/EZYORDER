// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import {
  CustomText,
  FilterDrawer,
  type IFilterField,
} from "@/components/reuseable";

// ==================== TYPES ====================
export interface IReservationFilterPanelProps {
  filterValues: Record<string, unknown>;
  setFilterValues: (values: Record<string, unknown>) => void;
}

const STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending" },
  { id: "booked", label: "Confirmed" },
  { id: "rejected", label: "Rejected" },
  { id: "cancelled", label: "Cancelled" },
  { id: "completed", label: "Completed" },
];

const ORDER_OPTIONS = [
  { id: "desc", label: "Newest First" },
  { id: "asc", label: "Oldest First" },
];

const FILTER_FIELDS: IFilterField[] = [
  {
    id: "status",
    label: "Reservation Status",
    type: "dropdown",
    options: STATUS_OPTIONS,
  },
  {
    id: "sort_order",
    label: "Sort Order",
    type: "chips",
    options: ORDER_OPTIONS,
  },
  {
    id: "date",
    label: "Reservation Date",
    type: "date",
  },
];

export const DEFAULT_RESERVATION_FILTERS = {
  status: "all",
  date: "",
  sort_order: "desc",
};

export default function ReservationFilterPanel({
  filterValues,
  setFilterValues,
}: Readonly<IReservationFilterPanelProps>) {
  const handleClear = () => {
    setFilterValues(DEFAULT_RESERVATION_FILTERS);
  };

  return (
    <View className="mb-1 flex-row items-center gap-3 ml-auto mr-0">
      <CustomText weight="bold" variant="primary" size="xs">
        Filters:
      </CustomText>
      <FilterDrawer
        fields={FILTER_FIELDS}
        values={filterValues}
        onApply={setFilterValues}
        onClear={handleClear}
      />
    </View>
  );
}
