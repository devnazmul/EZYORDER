import AppHeader from "@/components/AppHeader";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import ToggleBar from "@/components/reuseable/ToggleBar";
import ReservationsView from "@/components/tables-reservations/ReservationsView";
import TablesView from "@/components/tables-reservations/TablesView";
import { useAuth } from "@/context/AuthContext";
import {
  useAllTablesQuery,
  useReservationsQuery,
  useTableMatrixQuery,
} from "@/hooks/useTableReservationQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TOGGLE_OPTIONS = [
  { id: "tables", label: "Tables" },
  { id: "reservations", label: "Reservations" },
];

export default function TablesAndReservations() {
  const { user, token } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id;

  const [activeTab, setActiveTab] = useState("tables");

  // Fetch tables data
  const {
    data: tablesData,
    isLoading: isTablesLoading,
    refetch: refetchTables,
  } = useAllTablesQuery(token || "");

  // Fetch table matrix (KPI stats)
  const {
    data: matrixData,
    isLoading: isMatrixLoading,
    refetch: refetchMatrix,
  } = useTableMatrixQuery(token || "");

  // Fetch reservations
  const {
    data: reservationsResponse,
    isLoading: isReservationsLoading,
    refetch: refetchReservations,
  } = useReservationsQuery(token || "", {
    restaurant_id: restaurantId,
  });

  // Extract tables array from response
  const tables = useMemo(() => {
    if (Array.isArray(tablesData)) return tablesData;
    if (tablesData?.data && Array.isArray(tablesData.data)) return tablesData.data;
    return [];
  }, [tablesData]);

  // Extract matrix object
  const matrix = useMemo(() => {
    if (matrixData?.data) return matrixData.data;
    return matrixData || null;
  }, [matrixData]);

  // Extract reservations array from response
  const reservations = useMemo(() => {
    if (Array.isArray(reservationsResponse)) return reservationsResponse;
    if (reservationsResponse?.data && Array.isArray(reservationsResponse.data))
      return reservationsResponse.data;
    return [];
  }, [reservationsResponse]);

  const handleRefresh = async () => {
    if (activeTab === "tables") {
      await Promise.all([refetchTables(), refetchMatrix()]);
    } else {
      await refetchReservations();
    }
  };

  const isTablesTab = activeTab === "tables";

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      <RefreshableScrollView
        className="flex-1 px-4 py-4"
        onRefresh={handleRefresh}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* Page Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="bg-primary-container/10 p-1.5 rounded-lg">
              <MaterialIcons name="table-restaurant" size={18} color="#DC2D2A" />
            </View>
            <Text className="text-lg font-black text-neutral uppercase tracking-tight">
              Tables & Reservations
            </Text>
          </View>
          <Text className="text-[10px] font-black tracking-widest text-accent uppercase">
            Restaurant
          </Text>
        </View>

        {/* Toggle Bar */}
        <ToggleBar
          options={TOGGLE_OPTIONS}
          activeId={activeTab}
          onSelect={setActiveTab}
          containerClassName="mb-6"
        />

        {/* Conditional Content */}
        {isTablesTab ? (
          <TablesView
            tables={tables}
            matrix={matrix}
            isLoading={isTablesLoading || isMatrixLoading}
          />
        ) : (
          <ReservationsView
            reservations={reservations}
            isLoading={isReservationsLoading}
          />
        )}
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
