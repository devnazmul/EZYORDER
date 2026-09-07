// 1. React / React Native
import { useState } from "react";
import { FlatList, View } from "react-native";

// 3. External libraries / Shared hooks
import { USER_KEYS } from "@/constants/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components
import { EmptyState, PageTitle, ScreenContainer } from "@/components/reuseable";

// 5. Feature components / hooks / schema
import {
  UserCard,
  UserCardSkeleton,
  UserManagementFilterPanel,
} from "../components";
import { useUsersQuery } from "../hooks/queries/useUserQueries";
import { type UserFilterValues } from "../schema";

const DEFAULT_FILTERS: UserFilterValues = {
  role: "all",
};

export default function UserManagementScreen() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterValues, setFilterValues] =
    useState<UserFilterValues>(DEFAULT_FILTERS);

  // Debounce search query to prevent hitting the API on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Fetch users from API with server side filters
  const {
    data: usersResponse,
    isLoading,
    isFetching,
  } = useUsersQuery({
    search_key: debouncedSearchQuery.trim() || undefined,
    role:
      filterValues.role !== "all" ? (filterValues.role as string) : undefined,
  });

  // Extract users list from the typed API response envelope
  const users = usersResponse?.data ?? [];

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: USER_KEYS.lists() });
  };

  // Since we are filtering on the server side, the users list is already filtered.
  const filteredUsers = users;

  const isFiltered = Boolean(searchQuery || filterValues.role !== "all");
  const showSkeleton = isLoading || isFetching;

  return (
    <ScreenContainer scrollable={false} contentClassName="flex-1">
      <FlatList
        className="flex-1"
        data={showSkeleton ? [] : filteredUsers}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
        onRefresh={handleRefresh}
        refreshing={false}
        ListHeaderComponent={
          <View>
            {/* Page Title Row */}
            <PageTitle
              icon="people"
              title="User Management"
              description="Manage staff members and roles"
            />

            {/* Search & Filter Panel */}
            <UserManagementFilterPanel
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filterValues={filterValues}
              onApplyFilters={setFilterValues}
              onClearFilters={handleClearFilters}
              matchingCount={showSkeleton ? 0 : filteredUsers.length}
            />
          </View>
        }
        renderItem={({ item }) => <UserCard user={item} />}
        contentContainerClassName="gap-y-3"
        ListEmptyComponent={
          showSkeleton ? (
            <View className="gap-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <UserCardSkeleton key={`user-card-skeleton-${index}`} />
              ))}
            </View>
          ) : (
            <EmptyState
              icon="person-search"
              title="No Users Found"
              description={
                isFiltered
                  ? "No staff members match your search or filter settings."
                  : "No registered users exist in this workspace."
              }
            />
          )
        }
      />
    </ScreenContainer>
  );
}
