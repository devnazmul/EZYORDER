// 1. React / React Native
import { useState } from "react";
import { FlatList, View } from "react-native";

// 3. External libraries / hooks
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components
import { CustomText, EmptyState } from "@/components/reuseable";

// 5. Feature components / hooks
import {
  useAllTablesQuery,
  useTableMatrixQuery,
} from "../hooks/queries/useTableQueries";
import TableCard from "./TableCard";
import TableCardSkeleton from "./TableCardSkeleton";
import TableFilterPanel, { DEFAULT_TABLE_FILTERS } from "./TableFilterPanel";

// 7. Constants/utils
import { TABLE_KEYS } from "@/constants/queryKeys";
import { HP } from "@/utils/getResponsiveSizes";
import TableKpiCards from "./TableKpiCards";

export default function TablesView() {
  const queryClient = useQueryClient();

  const [filterValues, setFilterValues] = useState<Record<string, unknown>>(
    DEFAULT_TABLE_FILTERS,
  );
  const [refreshing, setRefreshing] = useState(false);

  // Construct API params for server-side filtering
  const apiParams: Record<string, unknown> = {};

  if (filterValues.area !== "all") {
    apiParams.area = filterValues.area;
  }

  if (filterValues.status !== "all") {
    apiParams.status = filterValues.status;
  }

  const {
    data: tablesData,
    isLoading: isTablesLoading,
    isFetching: isTablesFetching,
  } = useAllTablesQuery(apiParams);

  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    isFetching: isMatrixFetching,
  } = useTableMatrixQuery();

  const handleRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: TABLE_KEYS.all });
    setRefreshing(false);
  };

  const renderEmptyOrLoadingState = () => {
    if (isTablesLoading || isTablesFetching) {
      return (
        <View className="flex-row flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <View
              key={`skeleton-${i}`}
              className="w-[48%] flex-1 min-w-[140px]"
            >
              <TableCardSkeleton />
            </View>
          ))}
        </View>
      );
    }

    return (
      <EmptyState
        icon="table-restaurant"
        title="No Tables Found"
        description={"Currently no tables are registered."}
      />
    );
  };

  return (
    <FlatList
      data={isTablesLoading || isTablesFetching ? [] : (tablesData?.data ?? [])}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      columnWrapperClassName="gap-2"
      contentContainerClassName="gap-3"
      contentContainerStyle={{ paddingBottom: HP("10%") }}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={
        <View>
          <TableKpiCards
            matrix={matrixData?.data ?? null}
            loading={isMatrixLoading || isMatrixFetching}
          />
          <View className="self-end flex-row items-center justify-center gap-2">
            <CustomText size="sm" weight="bold" variant="primary">
              Filters:
            </CustomText>

            <TableFilterPanel
              filterValues={filterValues}
              setFilterValues={setFilterValues}
            />
          </View>
        </View>
      }
      ListEmptyComponent={renderEmptyOrLoadingState}
      renderItem={({ item }) => (
        <View className="flex-1">
          <TableCard table={item} />
        </View>
      )}
    />
  );
}
