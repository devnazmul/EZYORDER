import { CustomerParams } from "@/apis/reports";
import AppHeader from "@/components/AppHeader";
import CustomerCard from "@/components/CustomerCard";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer, { FilterField } from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import SearchBar from "@/components/reuseable/SearchBar";
import { useAuth } from "@/context/AuthContext";
import { useCustomersQuery } from "@/hooks/useReportsQueries";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_FILTERS = {
  frequency_visit: "all",
  date_filter: "all",
  rating: "all",
  order_by: "all",
  creation_dates: { start: "", end: "" },
  last_visited_date: "",
};

export default function CustomersReport() {
  const { token } = useAuth();

  // State for search and advanced filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, any>>(DEFAULT_FILTERS);

  // Debounce search query to prevent rapid API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Configure FilterDrawer fields using all API schema options
  const filterFields = useMemo<FilterField[]>(() => {
    return [
      {
        id: "frequency_visit",
        label: "Visit Frequency",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Frequencies" },
          { id: "new", label: "New" },
          { id: "regular", label: "Regular" },
          { id: "vip", label: "VIP" },
        ],
      },
      {
        id: "date_filter",
        label: "Date Filter Range",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Time" },
          { id: "today", label: "Today" },
          { id: "this_week", label: "This Week" },
          { id: "previous_week", label: "Previous Week" },
          { id: "this_month", label: "This Month" },
          { id: "previous_month", label: "Previous Month" },
          { id: "this_year", label: "This Year" },
        ],
      },
      {
        id: "rating",
        label: "Review Rating",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Ratings" },
          { id: "1", label: "★ 1" },
          { id: "2", label: "★ 2" },
          { id: "3", label: "★ 3" },
          { id: "4", label: "★ 4" },
          { id: "5", label: "★ 5" },
        ],
      },
      {
        id: "order_by",
        label: "Sort Order",
        type: "chips" as const,
        options: [
          { id: "all", label: "Default" },
          { id: "asc", label: "Oldest First" },
          { id: "desc", label: "Newest First" },
        ],
      },
      {
        id: "creation_dates",
        label: "Creation Date Range",
        type: "date-range" as const,
      },
      {
        id: "last_visited_date",
        label: "Last Visited Date",
        type: "date" as const,
      },
    ];
  }, []);

  // Construct query parameters
  const queryParams = useMemo<CustomerParams>(() => {
    const params: CustomerParams = {
      per_page: 50,
    };

    if (debouncedSearch.trim()) {
      params.search_key = debouncedSearch.trim();
    }
    if (filterValues.frequency_visit !== "all") {
      params.frequency_visit = filterValues.frequency_visit;
    }
    if (filterValues.date_filter !== "all") {
      params.date_filter = filterValues.date_filter;
    }
    if (filterValues.rating !== "all") {
      params.rating = filterValues.rating;
    }
    if (filterValues.order_by !== "all") {
      params.order_by = filterValues.order_by;
    }
    if (filterValues.creation_dates?.start) {
      params.start_date = filterValues.creation_dates.start;
    }
    if (filterValues.creation_dates?.end) {
      params.end_date = filterValues.creation_dates.end;
    }
    if (filterValues.last_visited_date) {
      params.last_visited_date = filterValues.last_visited_date;
    }

    return params;
  }, [debouncedSearch, filterValues]);

  // Fetch queries
  const { data: customers = [], isLoading, isRefetching, refetch } = useCustomersQuery(token, queryParams);

  const handleApplyFilters = (newValues: Record<string, any>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton />

      {/* Main content header */}
      <View className="px-4 pt-4">
        <PageTitle title="Customers" icon="group" badgeCount={customers.length} />

        {/* Search & Filter Drawer Row */}
        <View className="flex-row items-center gap-3 mb-4">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, email, or phone..."
            containerClassName="flex-1"
          />
          <FilterDrawer
            fields={filterFields}
            values={filterValues}
            onApply={handleApplyFilters}
            onClear={handleClearFilters}
          />
        </View>
      </View>

      {/* Main Content Area */}
      {isLoading ? (
        <View key="loading" className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#DC2D2A" />
          <Text className="text-xs text-accent mt-4 font-semibold">Loading customers list...</Text>
        </View>
      ) : customers.length === 0 ? (
        <View key="empty" className="flex-1 px-4">
          <EmptyState description="No customers found matching your criteria" pyClassName="py-12" />
        </View>
      ) : (
        <FlatList
          key="loaded"
          data={customers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CustomerCard customer={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={["#DC2D2A"]}
              tintColor="#DC2D2A"
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
