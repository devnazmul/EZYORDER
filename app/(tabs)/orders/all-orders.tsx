import AppHeader from "@/components/AppHeader";
import OrderCard from "@/components/OrderCard";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import EmptyState from "@/components/reuseable/EmptyState";
import FilterChips from "@/components/reuseable/FilterChips";
import LoadingScreen from "@/components/reuseable/LoadingScreen";
import ToggleBar from "@/components/reuseable/ToggleBar";
import { useAuth } from "@/context/AuthContext";
import { useAllOrdersQuery, useTodayOrdersQuery } from "@/hooks/useOrderQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AllOrdersProps {
  initialTab?: "live" | "historical";
}

export default function AllOrders({ initialTab = "historical" }: AllOrdersProps) {
  const { token, user } = useAuth();

  const restaurantId =
    user?.restaurant?.length > 0 ? String(user?.restaurant[0]?.id) : String(user?.business_id || "1");

  // Tab State: "live" (Today's) vs "historical" (All)
  const [activeTab, setActiveTab] = useState<"live" | "historical">(initialTab);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatusChip, setActiveStatusChip] = useState("all");
  const [activeTypeChip, setActiveTypeChip] = useState("all");

  // Order Details Modal State
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sync prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const isLive = activeTab === "live";

  // Call both query hooks at the top level to adhere to react hook rules
  const todayQuery = useTodayOrdersQuery(token || "", restaurantId, { enabled: isLive });
  const allQuery = useAllOrdersQuery(token || "", restaurantId, { enabled: !isLive });

  const { data: orders = [], isLoading, isRefetching, refetch } = isLive ? todayQuery : allQuery;

  // Filtered list
  const filteredOrders = orders.filter((order) => {
    // Search query matching
    const idMatches = String(order.id).includes(searchQuery);
    const customerMatches = (order.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSearch = idMatches || customerMatches;

    // Status Chip matching
    const matchesStatus =
      activeStatusChip === "all" ||
      (order.status || "").toLowerCase().trim() === activeStatusChip.toLowerCase().trim();

    // Type Chip matching
    const matchesType =
      activeTypeChip === "all" ||
      (order.type || "").toLowerCase().trim() === activeTypeChip.toLowerCase().trim();

    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const statusChips = [
    { id: "all", label: "All" },
    { id: "new", label: "New" },
    { id: "preparing", label: "Preparing" },
    { id: "completed", label: "Completed" },
    { id: "unpaid", label: "Unpaid" },
  ];

  const typeChips = [
    { id: "all", label: "All" },
    { id: "eat_in", label: "Eat In" },
    { id: "delivery", label: "Delivery" },
    { id: "take_away", label: "Take Away" },
    { id: "walk_in", label: "Walk In" },
  ];

  if (isLoading) {
    return <LoadingScreen message="Loading orders..." />;
  }

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      {/* Main Body */}
      <View className="flex-1 px-4 py-4">
        {/* Toggle between Live and Historical */}
        <ToggleBar
          options={[
            { id: "live", label: "Today's Orders" },
            { id: "historical", label: "All Orders" },
          ]}
          activeId={activeTab}
          onSelect={(id) => {
            setActiveTab(id as "live" | "historical");
            setActiveStatusChip("all");
            setActiveTypeChip("all");
          }}
          containerClassName="mb-4"
        />

        {/* Filters Panel Container */}
        <View className="gap-y-3 mb-4">
          {/* Search Bar */}
          <View className="flex-row items-center bg-base-300 border border-base-200 rounded-xl px-3 py-2 shadow-sm">
            <MaterialIcons name="search" size={18} color="#6E6E6E" style={{ marginRight: 8 }} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by ID or customer..."
              placeholderTextColor="#A3A3A3"
              className="flex-1 text-xs font-medium text-neutral p-0"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MaterialIcons name="cancel" size={16} color="#6E6E6E" />
              </TouchableOpacity>
            )}
          </View>

          {/* Status/Type Chips */}
          <FilterChips
            chips={activeTab === "live" ? statusChips : typeChips}
            selectedId={activeTab === "live" ? activeStatusChip : activeTypeChip}
            onSelect={activeTab === "live" ? setActiveStatusChip : setActiveTypeChip}
          />
        </View>

        {/* FlatList display */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <OrderCard item={item} onViewDetails={() => handleViewDetails(item)} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#DC2D2A"]} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="assignment-late"
              title="No Orders Found"
              description="Try modifying your filters or checking back later."
              pyClassName="py-20"
            />
          }
        />
      </View>

      {/* Order Details Modal (View Details) */}
      <OrderDetailsModal
        visible={showDetailsModal}
        order={selectedOrder}
        onClose={() => setShowDetailsModal(false)}
      />
    </SafeAreaView>
  );
}
