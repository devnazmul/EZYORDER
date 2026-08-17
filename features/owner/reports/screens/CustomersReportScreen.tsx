import { CustomerParams } from "../apis/reports";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer, { FilterField } from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import SearchBar from "@/components/reuseable/SearchBar";
import COLORS from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { HP, WP } from "@/utils/getResponsiveSizes";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerCard from "../components/CustomerCard";
import CustomerCardSkeleton from "../components/skeletons/CustomerCardSkeleton";
import { useCustomersQuery } from "../hooks/queries/useReportsQueries";

const DEFAULT_FILTERS = {
  frequency_visit: ["all"],
  date_filter: "all",
  rating: "all",
  order_by: "all",
  creation_dates: { start: "", end: "" },
  last_visited_date: "",
  email: "",
  phone: "",
  status: "all",
  payment_status: "all",
  payment_type: "all",
  booking_type: "all",
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
        isMultiSelect: true,
        options: [
          { id: "all", label: "All Frequencies" },
          { id: "new", label: "New" },
          { id: "regular", label: "Regular" },
          { id: "vip", label: "VIP" },
        ],
      },
      {
        id: "booking_type",
        label: "Order Type",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Types" },
          { id: "take_away", label: "Take Away" },
          { id: "delivery", label: "Delivery" },
          { id: "admin_panel_booking", label: "Eat In" },
        ],
      },
      {
        id: "status",
        label: "Order Status",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Statuses" },
          { id: "pending", label: "Pending" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" },
        ],
      },
      {
        id: "payment_status",
        label: "Payment Status",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Payment Statuses" },
          { id: "paid", label: "Paid" },
          { id: "unpaid", label: "Unpaid" },
        ],
      },
      {
        id: "payment_type",
        label: "Payment Type",
        type: "chips" as const,
        options: [
          { id: "all", label: "All Payment Types" },
          { id: "cash", label: "Cash" },
          { id: "card", label: "Card" },
          { id: "change", label: "Change" },
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
        id: "email",
        label: "Email Address",
        type: "text" as const,
        keyboardType: "email-address",
      },
      {
        id: "phone",
        label: "Phone Number",
        type: "text" as const,
        keyboardType: "phone-pad",
      },
      {
        id: "last_visited_date",
        label: "Last Visited Date",
        type: "date" as const,
      },
      {
        id: "creation_dates",
        label: "Creation Date Range",
        type: "date-range" as const,
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
    if (filterValues.frequency_visit && Array.isArray(filterValues.frequency_visit)) {
      const activeVisits = filterValues.frequency_visit.filter((v: string) => v !== "all");
      if (activeVisits.length > 0) {
        params.frequency_visit = activeVisits.join(",");
      }
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
    if (filterValues.email) {
      params.email = filterValues.email.trim();
    }
    if (filterValues.phone) {
      params.phone = filterValues.phone.trim();
    }
    if (filterValues.status !== "all") {
      params.status = filterValues.status;
    }
    if (filterValues.payment_status !== "all") {
      params.payment_status = filterValues.payment_status;
    }
    if (filterValues.payment_type !== "all") {
      params.payment_type = filterValues.payment_type;
    }
    if (filterValues.booking_type !== "all") {
      params.booking_type = filterValues.booking_type;
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
      {/* Main content header */}
      <View style={{ paddingHorizontal: WP("4%"), paddingTop: HP("2%") }}>
        <PageTitle title="Customers" icon="group" badgeCount={customers.length} />

        {/* Search & Filter Drawer Row */}
        <View style={{ marginBottom: HP("1.5%") }} className="flex-row items-center gap-3">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search by name, code, or phone..."
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
      {isLoading || isRefetching ? (
        <View key="loading" style={{ paddingHorizontal: WP("4%") }} className="flex-1">
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
          <CustomerCardSkeleton />
        </View>
      ) : customers.length === 0 ? (
        <View key="empty" style={{ paddingHorizontal: WP("4%") }} className="flex-1">
          <EmptyState description="No customers found matching your criteria" pyClassName="py-12" />
        </View>
      ) : (
        <FlatList
          key="loaded"
          data={customers}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: WP("4%"), paddingBottom: HP("4%") }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <CustomerCard customer={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
