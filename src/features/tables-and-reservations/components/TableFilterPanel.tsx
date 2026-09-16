// 1. React / React Native

// 4. Shared components
import { FilterDrawer, type IFilterField } from "@/components/reuseable";

// ==================== TYPES ====================
export interface ITableFilterPanelProps {
  filterValues: Record<string, unknown>;
  setFilterValues: (values: Record<string, unknown>) => void;
}

const STATUS_CHIPS = [
  { id: "all", label: "All Statuses" },
  { id: "free", label: "Available" },
  { id: "occupied", label: "Occupied" },
  { id: "reserved", label: "Reserved" },
];

const AREA_CHIPS = [
  { id: "all", label: "All Areas" },
  { id: "indoor", label: "Indoor" },
  { id: "outdoor", label: "Outdoor" },
  { id: "rooftop", label: "Rooftop" },
];

const FILTER_FIELDS: IFilterField[] = [
  {
    id: "area",
    label: "Areas",
    type: "dropdown",
    options: AREA_CHIPS,
  },
  {
    id: "status",
    label: "Statuses",
    type: "dropdown",
    options: STATUS_CHIPS,
  },
];

export const DEFAULT_TABLE_FILTERS = {
  area: "all",
  status: "all",
};

export default function TableFilterPanel({
  filterValues,
  setFilterValues,
}: Readonly<ITableFilterPanelProps>) {
  const handleClear = () => {
    setFilterValues(DEFAULT_TABLE_FILTERS);
  };

  return (
    <FilterDrawer
      fields={FILTER_FIELDS}
      values={filterValues}
      onApply={setFilterValues}
      onClear={handleClear}
    />
  );
}
