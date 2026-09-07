// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { FilterDrawer, SearchBar } from "@/components/reuseable";
import type { IFilterField } from "@/components/reuseable/FilterDrawer";

// 5. Feature components / schema
import { userFilterSchema, type UserFilterValues } from "../schema";

// ==================== TYPES ====================
export interface IUserManagementFilterPanelProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filterValues: UserFilterValues;
  onApplyFilters: (newValues: UserFilterValues) => void;
  onClearFilters: () => void;
  matchingCount?: number;
}

// ==================== CONSTANTS ====================
const FILTER_FIELDS: IFilterField[] = [
  {
    id: "role",
    label: "Staff Role",
    type: "dropdown",
    options: [
      { id: "all", label: "All Roles" },
      { id: "admin", label: "Admin" },
      { id: "waiter", label: "Waiter" },
      { id: "driver", label: "Driver" },
    ],
  },
];

// ==================== COMPONENT ====================
export default function UserManagementFilterPanel({
  searchQuery,
  onSearchChange,
  filterValues,
  onApplyFilters,
  onClearFilters,
}: Readonly<IUserManagementFilterPanelProps>) {
  return (
    <View>
      {/* Search & Filter Row */}
      <View className="flex-row items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholder="Search staff name or email..."
          containerClassName="flex-1"
        />
        <FilterDrawer
          fields={FILTER_FIELDS}
          values={filterValues}
          schema={userFilterSchema}
          onApply={onApplyFilters}
          onClear={onClearFilters}
        />
      </View>
    </View>
  );
}
