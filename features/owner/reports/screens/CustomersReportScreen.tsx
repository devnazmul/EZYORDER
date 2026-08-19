import { ICustomerParams } from "../apis/reports";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterDrawer, {
  IFilterField,
} from "@/components/reuseable/FilterDrawer";
import PageTitle from "@/components/reuseable/PageTitle";
import SearchBar from "@/components/reuseable/SearchBar";
import { COLORS } from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomerCard from "../components/CustomerCard";
import CustomerCardSkeleton from "../components/skeletons/CustomerCardSkeleton";
import { useCustomersQuery } from "../hooks/queries/useReportsQueries";

interface ICustomerCreationDates {
  start: string;
  end: string;
}

interface ICustomerFilterState {
  frequency_visit: string[];
  date_filter: string;
  rating: string;
  order_by: string;
  creation_dates: ICustomerCreationDates;
  last_visited_date: string;
  email: string;
  phone: string;
  status: string;
  payment_status: string;
  payment_type: string;
  booking_type: string;
}

const DEFAULT_FILTERS: ICustomerFilterState = {
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

interface ICustomerItem {
  id: string | number;
  first_Name?: string;
  last_Name?: string;
  image?: string;
  type?: string;
  completed_orders_count?: number;
  total_revenue_takeaway?: string;
  total_revenue_delivery?: string;
  total_revenue_eat_in?: string;
  [key: string]: unknown;
}

interface ICustomerListContentProps {
  isLoadingOrRefetching: boolean;
  customers: ICustomerItem[];
  isRefetching: boolean;
  onRefresh: () => void;
}

function CustomerListContent({
  isLoadingOrRefetching,
  customers,
  isRefetching,
  onRefresh,
}: Readonly<ICustomerListContentProps>) {
  if (isLoadingOrRefetching) {
    return (
      <View
        key="loading"
        style={{ paddingHorizontal: WP("4%") }}
        className="flex-1"
      >
        <CustomerCardSkeleton />
        <CustomerCardSkeleton />
        <CustomerCardSkeleton />
        <CustomerCardSkeleton />
        <CustomerCardSkeleton />
      </View>
    );
  }

  if (customers.length === 0) {
    return (
      <View
        key="empty"
        style={{ paddingHorizontal: WP("4%") }}
        className="flex-1"
      >
        <EmptyState
          description="No customers found matching your criteria"
          pyClassName="py-12"
        />
      </View>
    );
  }

  return (
    <FlatList
      key="loaded"
      data={customers}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{
        paddingHorizontal: WP("4%"),
        paddingBottom: HP("4%"),
      }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => <CustomerCard customer={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
    />
  );
}

export default function CustomersReport() {
  // State for search and advanced filters
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(
    DEFAULT_FILTERS as unknown as Record<string, unknown>,
  );

  // Debounce search query to prevent rapid API requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Configure FilterDrawer fields using all API schema options
  const filterFields = useMemo<IFilterField[]>(() => {
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
  const queryParams = useMemo<ICustomerParams>(() => {
    return buildCustomerQueryParams(debouncedSearch, filterValues);
  }, [debouncedSearch, filterValues]);

  // Fetch queries
  const {
    data: customers = [],
    isLoading,
    isRefetching,
    refetch,
  } = useCustomersQuery(queryParams);

  const handleApplyFilters = (newValues: Record<string, unknown>) => {
    setFilterValues(newValues);
  };

  const handleClearFilters = () => {
    setFilterValues(DEFAULT_FILTERS as unknown as Record<string, unknown>);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      {/* Main content header */}
      <View style={{ paddingHorizontal: WP("4%"), paddingTop: HP("2%") }}>
        <PageTitle
          title="Customers"
          icon="group"
          badgeCount={customers.length}
        />

        {/* Search & Filter Drawer Row */}
        <View
          style={{ marginBottom: HP("1.5%") }}
          className="flex-row items-center gap-3"
        >
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
      <CustomerListContent
        isLoadingOrRefetching={isLoading || isRefetching}
        customers={customers as ICustomerItem[]}
        isRefetching={isRefetching}
        onRefresh={refetch}
      />
    </SafeAreaView>
  );
}

const FILTER_MAPPING: [string, keyof ICustomerParams][] = [
  ["date_filter", "date_filter"],
  ["rating", "rating"],
  ["order_by", "order_by"],
  ["status", "status"],
  ["payment_status", "payment_status"],
  ["payment_type", "payment_type"],
  ["booking_type", "booking_type"],
];

function buildCustomerQueryParams(
  debouncedSearch: string,
  filterValues: Record<string, unknown>,
): ICustomerParams {
  const params: ICustomerParams = {
    per_page: 50,
  };

  const trimSearch = debouncedSearch.trim();
  if (trimSearch) params.search_key = trimSearch;

  const emailTrim =
    typeof filterValues.email === "string" ? filterValues.email.trim() : "";
  if (emailTrim) params.email = emailTrim;

  const phoneTrim =
    typeof filterValues.phone === "string" ? filterValues.phone.trim() : "";
  if (phoneTrim) params.phone = phoneTrim;

  if (
    typeof filterValues.last_visited_date === "string" &&
    filterValues.last_visited_date
  ) {
    params.last_visited_date = filterValues.last_visited_date;
  }

  const creationDates = filterValues.creation_dates as
    ICustomerCreationDates | undefined;
  if (creationDates?.start) params.start_date = creationDates.start;
  if (creationDates?.end) params.end_date = creationDates.end;

  for (const [key, paramKey] of FILTER_MAPPING) {
    const val = filterValues[key];
    if (typeof val === "string" && val && val !== "all") {
      (params as Record<keyof ICustomerParams, unknown>)[paramKey] = val;
    }
  }

  const freq = filterValues.frequency_visit;
  if (Array.isArray(freq)) {
    const activeVisits = freq.filter(
      (v): v is string => typeof v === "string" && v !== "all",
    );
    if (activeVisits.length > 0) {
      params.frequency_visit = activeVisits.join(",");
    }
  }

  return params;
}
