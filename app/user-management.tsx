import AppHeader from "@/components/AppHeader";
import KpiCard from "@/components/reports/KpiCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer from "@/components/reuseable/FilterDrawer";
import SearchBar from "@/components/reuseable/SearchBar";
import UserCard from "@/components/user-management/UserCard";
import UserDetailModal from "@/components/user-management/UserDetailModal";
import { useAuth } from "@/context/AuthContext";
import { useUsersQuery } from "@/hooks/useUserQueries";
import { useDebounce } from "@/hooks/useDebounce";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_FILTERS = {
  role: "all",
};

export default function UserManagementScreen() {
  const { token } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>(DEFAULT_FILTERS);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Debounce search query to prevent hitting the API on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch users from API with server side filters
  const { data: usersResponse, isLoading, refetch } = useUsersQuery(token || "", {
    search_key: debouncedSearchQuery.trim() || undefined,
    role: filterValues.role !== "all" ? filterValues.role : undefined,
  });

  // Safely extract users list from the API response envelope
  const users = useMemo(() => {
    if (!usersResponse) return [];
    if (Array.isArray(usersResponse)) return usersResponse;
    if (Array.isArray(usersResponse.data)) return usersResponse.data;
    if (usersResponse.data && Array.isArray(usersResponse.data.data)) return usersResponse.data.data;
    return [];
  }, [usersResponse]);

  // Define filter fields for the FilterDrawer
  const filterFields = useMemo(
    () => [
      {
        id: "role",
        label: "Staff Role",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Roles" },
          { id: "admin", label: "Admin" },
          { id: "waiter", label: "Waiter" },
          { id: "driver", label: "Driver" },
        ],
      },
    ],
    [],
  );

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  // Since we are filtering on the server side, the users list is already filtered.
  const filteredUsers = users;

  // Compute active filters count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterValues.role !== "all") count++;
    return count;
  }, [filterValues]);

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      {/* App Header with Back Button */}
      <AppHeader showBackButton={true} />

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 80 }}
        onRefresh={refetch}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="mb-6">
            {/* Page Title Row */}
            <View className="flex-row items-center gap-2 mb-5">
              <View className="bg-primary-container/10 p-1.5 rounded-lg">
                <MaterialIcons name="people" size={18} color="#DC2D2A" />
              </View>
              <Text className="text-lg font-black text-neutral uppercase tracking-tight">
                User Management
              </Text>
            </View>

            {/* KPI Total Staff Card */}
            <View className="mb-5">
              <KpiCard
                title="Total Staff"
                value={`Active Users: ${users.filter((u: any) => u.is_active !== 0).length}`}
                iconName="group"
                variant="dark"
                gradientColors={["#0d0d0d", "#1f0b1dff"]}
              />
            </View>

            {/* Search & Filter Row */}
            <View className="flex-row items-center gap-3">
              <SearchBar
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search staff name or email..."
                containerClassName="flex-1"
              />
              <FilterDrawer
                fields={filterFields}
                values={filterValues}
                onApply={handleApplyFilters}
                onClear={handleClearFilters}
              />
            </View>

            {/* Active Filter Indicators */}
            {(searchQuery || activeFilterCount > 0) && (
              <View className="flex-row items-center justify-between mt-4 px-1">
                <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
                  Matching {filteredUsers.length} Users
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => <UserCard user={item} onPress={() => setSelectedUser(item)} />}
        ListEmptyComponent={
          isLoading ? (
            <View className="py-20 items-center justify-center">
              <ActivityIndicator size="large" color="#DC2D2A" />
              <Text className="mt-3 text-xs font-semibold text-accent">Loading staff members...</Text>
            </View>
          ) : (
            <EmptyState
              icon="person-search"
              title="No Users Found"
              description={
                searchQuery || activeFilterCount > 0
                  ? "No staff members match your search or filter settings."
                  : "No registered users exist in this workspace."
              }
            />
          )
        }
      />

      {/* User Detail Modal Sheet */}
      <UserDetailModal
        visible={selectedUser !== null}
        onClose={() => setSelectedUser(null)}
        user={selectedUser}
      />
    </SafeAreaView>
  );
}
