import ENV from "@/config/env";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "@/components/AppHeader";

interface AllOrdersProps {
  initialTab?: "live" | "historical";
}

export default function AllOrders({ initialTab = "historical" }: AllOrdersProps) {
  const API_BASE_URL = ENV.API_BASE_URL;
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

  // React Query call to retrieve orders lists
  const {
    data: orders = [],
    isLoading,
    isRefetching,
    refetch,
  } = useQuery({
    queryKey: ["orders", activeTab, restaurantId],
    queryFn: async () => {
      const headers = {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      };

      if (activeTab === "live") {
        // Today's Live Orders
        const response = await axios.get(`${API_BASE_URL}/order/All/order/today/${restaurantId}`, {
          headers,
          validateStatus: () => true,
        });
        console.log("Response from live orders endpoint: ", response.data);
        if (response.status === 200 && response.data) {
          const rawData = response.data.data || response.data;
          let flattenedOrders: any[] = [];
          if (Array.isArray(rawData)) {
            flattenedOrders = rawData;
          } else if (typeof rawData === "object" && rawData !== null) {
            Object.keys(rawData).forEach((key) => {
              if (Array.isArray(rawData[key])) {
                flattenedOrders = [...flattenedOrders, ...rawData[key]];
              }
            });
          }
          return flattenedOrders;
        }
      } else {
        // Historical All Orders (Using v3.0 pagination endpoint)
        const response = await axios.get(`${API_BASE_URL}/v3.0/order/All/order/every/${restaurantId}`, {
          headers,
          params: { per_page: 50, page: 1 },
          validateStatus: () => true,
        });

        console.log("Response from historical orders endpoint: ", response.data);

        if (response.status === 200 && response.data) {
          const rawData = response.data.data || response.data;
          let flattenedOrders: any[] = [];
          if (Array.isArray(rawData)) {
            flattenedOrders = rawData;
          } else if (typeof rawData === "object" && rawData !== null) {
            Object.keys(rawData).forEach((key) => {
              if (Array.isArray(rawData[key])) {
                flattenedOrders = [...flattenedOrders, ...rawData[key]];
              }
            });
          }
          return flattenedOrders;
        }
      }
      return [];
    },
    enabled: !!token && !!restaurantId,
  });

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

  // Helper to extract items description
  const getOrderItemsText = (order: any) => {
    if (!order) return "";
    if (order.items_summary) return order.items_summary;
    const detailList = order.detail || order.details;
    if (Array.isArray(detailList) && detailList.length > 0) {
      return detailList
        .map((d: any) => `${d.qty || d.quantity || 1}x ${d.dish?.name || d.dish_name || "Item"}`)
        .join(", ");
    }
    return order.description || "";
  };

  // Helper to safely format time from string
  const getOrderTimeStr = (createdAtStr: string) => {
    if (!createdAtStr) return "--:--";
    const parts = createdAtStr.split(" ");
    if (parts.length > 1) {
      const timePart = parts[1]; // "18:23:25"
      if (timePart) {
        const timeSubParts = timePart.split(":");
        if (timeSubParts.length > 1) {
          return `${timeSubParts[0]}:${timeSubParts[1]}`; // "18:23"
        }
      }
    }
    return createdAtStr;
  };

  // Status Badge Colors Config
  const getStatusBadgeConfig = (status: string) => {
    const s = (status || "").toLowerCase().trim();
    switch (s) {
      case "new":
      case "pending":
        return {
          style: { backgroundColor: "#EFF6FF", borderColor: "#DBEAFE" },
          textStyle: { color: "#1E40AF" },
          label: "New",
          icon: "fiber-new",
        };
      case "kitchen":
      case "preparing":
        return {
          style: { backgroundColor: "#FFF7ED", borderColor: "#FFEDD5" },
          textStyle: { color: "#C2410C" },
          label: "Preparing",
          icon: "restaurant",
        };
      case "completed":
      case "complete":
        return {
          style: { backgroundColor: "#F0FDF4", borderColor: "#DCFCE7" },
          textStyle: { color: "#166534" },
          label: "Completed",
          icon: "check-circle",
        };
      case "unpaid":
        return {
          style: { backgroundColor: "#FDF2F8", borderColor: "#FCE7F3" },
          textStyle: { color: "#9D174D" },
          label: "Unpaid",
          icon: "payment",
        };
      default:
        return {
          style: { backgroundColor: "#F5F5F5", borderColor: "#E5E5E5" },
          textStyle: { color: "#404040" },
          label: status || "Unknown",
          icon: "help-outline",
        };
    }
  };

  const renderOrderCard = ({ item }: { item: any }) => {
    const configBadge = getStatusBadgeConfig(item.status);
    const orderTime = getOrderTimeStr(item.created_at);

    return (
      <View className="bg-base-300 rounded-xl border border-base-200 overflow-hidden shadow-sm mb-4">
        <View className="p-4 gap-y-3">
          <View className="flex-row justify-between items-start">
            <View className="gap-y-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-md font-bold text-neutral">#{item.id}</Text>
                <View className="bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  <Text className="text-[9px] font-bold text-blue-700 uppercase tracking-wider">
                    {item.type || "Delivery"}
                  </Text>
                </View>
              </View>
              <Text className="text-sm font-semibold text-neutral">
                {item.customer_name ||
                  item.user?.first_Name ||
                  (item.table_number && parseFloat(item.table_number) > 0
                    ? `Table ${parseFloat(item.table_number)}`
                    : "Walk-in Customer")}
              </Text>
            </View>

            <View className="items-end gap-y-1">
              <View
                className="flex-row items-center px-2.5 py-1 rounded-full border"
                style={configBadge.style}
              >
                <MaterialIcons
                  name={configBadge.icon as any}
                  size={12}
                  color={configBadge.textStyle.color}
                  style={{ marginRight: 4 }}
                />
                <Text className="text-[10px] font-bold" style={configBadge.textStyle}>
                  {configBadge.label}
                </Text>
              </View>
              <Text className="text-xs text-accent">{orderTime}</Text>
            </View>
          </View>

          {/* Items Summary bubble */}
          <View className="bg-base-100 rounded-lg p-3">
            <Text className="text-xs text-accent font-medium leading-4" numberOfLines={2}>
              {getOrderItemsText(item)}
            </Text>
          </View>

          {/* Price & Actions Row */}
          <View className="flex-row justify-between items-center pt-1">
            <Text className="text-md font-bold text-neutral">
              £{parseFloat(item.amount || item.final_price || "0").toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Buttons drawer */}
        <View className="px-4 pb-4">
          <TouchableOpacity
            onPress={() => {
              setSelectedOrder(item);
              setShowDetailsModal(true);
            }}
            className="w-full bg-primary py-3 rounded-lg flex-row items-center justify-center gap-2 shadow-sm"
          >
            <Text className="text-white font-bold text-xs">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <AppHeader showBackButton={true} />

      {/* Main Body */}
      <View className="flex-1 px-4 py-4">
        {/* Toggle between Live and Historical */}
        <View className="flex-row p-1 bg-base-200 rounded-xl mb-4">
          <TouchableOpacity
            onPress={() => {
              setActiveTab("live");
              setActiveStatusChip("all");
              setActiveTypeChip("all");
            }}
            className="flex-1 py-2.5 items-center justify-center rounded-lg"
            style={activeTab === "live" ? { backgroundColor: "#DC2D2A" } : undefined}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: activeTab === "live" ? "#FFFFFF" : "#6E6E6E" }}
            >
              Today's Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setActiveTab("historical");
              setActiveStatusChip("all");
              setActiveTypeChip("all");
            }}
            className="flex-1 py-2.5 items-center justify-center rounded-lg"
            style={activeTab === "historical" ? { backgroundColor: "#DC2D2A" } : undefined}
          >
            <Text
              className="text-xs font-semibold"
              style={{ color: activeTab === "historical" ? "#FFFFFF" : "#6E6E6E" }}
            >
              All Orders
            </Text>
          </TouchableOpacity>
        </View>

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

          {/* Status Chips Scrollable Row */}
          <View>
            {activeTab === "live" ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row", paddingRight: 16 }}
              >
                {[
                  { id: "all", label: "All" },
                  { id: "new", label: "New" },
                  { id: "preparing", label: "Preparing" },
                  { id: "completed", label: "Completed" },
                  { id: "unpaid", label: "Unpaid" },
                ].map((chip) => (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setActiveStatusChip(chip.id)}
                    className="px-4 py-2 rounded-full mr-2 border border-base-200 bg-base-300 items-center justify-center"
                    style={
                      activeStatusChip === chip.id
                        ? { backgroundColor: "#0D0D0D", borderColor: "#0D0D0D" }
                        : undefined
                    }
                  >
                    <Text
                      numberOfLines={1}
                      className="text-xs font-bold text-center"
                      style={{ color: activeStatusChip === chip.id ? "#FFFFFF" : "#6E6E6E", flexShrink: 0 }}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: "row", paddingRight: 16 }}
              >
                {[
                  { id: "all", label: "All" },
                  { id: "eat_in", label: "Eat In" },
                  { id: "delivery", label: "Delivery" },
                  { id: "take_away", label: "Take Away" },
                  { id: "walk_in", label: "Walk In" },
                ].map((chip) => (
                  <TouchableOpacity
                    key={chip.id}
                    onPress={() => setActiveTypeChip(chip.id)}
                    className="px-4 py-2 rounded-full mr-2 border border-base-200 bg-base-300 items-center justify-center"
                    style={
                      activeTypeChip === chip.id
                        ? { backgroundColor: "#0D0D0D", borderColor: "#0D0D0D" }
                        : undefined
                    }
                  >
                    <Text
                      numberOfLines={1}
                      className="text-xs font-bold text-center"
                      style={{ color: activeTypeChip === chip.id ? "#FFFFFF" : "#6E6E6E", flexShrink: 0 }}
                    >
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>

        {/* FlatList display */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#DC2D2A" />
            <Text className="mt-4 text-xs font-semibold text-accent">Loading orders...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredOrders}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderOrderCard}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={["#DC2D2A"]} />
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20">
                <MaterialIcons name="assignment-late" size={48} color="#A3A3A3" />
                <Text className="mt-4 text-sm font-semibold text-neutral">No Orders Found</Text>
                <Text className="mt-1 text-xs text-accent text-center px-6">
                  Try modifying your filters or checking back later.
                </Text>
              </View>
            }
          />
        )}
      </View>

      {/* Order Details Modal (View Details) */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        <View className="flex-1 justify-end bg-neutral/50">
          <View className="bg-base-300 rounded-t-3xl p-6 max-h-[80%] border-t border-base-200 shadow-2xl gap-y-4">
            <View className="flex-row justify-between items-center border-b border-base-200 pb-3">
              <View className="gap-y-1">
                <Text className="text-lg font-bold text-neutral">Order #{selectedOrder?.id}</Text>
                <Text className="text-xs text-accent">
                  Type: <Text className="font-bold uppercase text-primary">{selectedOrder?.type}</Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowDetailsModal(false)}
                className="p-1 hover:bg-base-200 rounded-full"
              >
                <MaterialIcons name="close" size={24} color="#6E6E6E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
              {/* Customer Information */}
              <View className="gap-y-2">
                <Text className="text-xs font-bold text-accent uppercase tracking-wider">
                  Customer Details
                </Text>
                <View className="bg-base-100 rounded-xl p-4 gap-y-2 border border-base-200">
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Name:</Text>
                    <Text className="text-xs font-bold text-neutral">
                      {selectedOrder?.customer_name ||
                        selectedOrder?.user?.first_Name ||
                        (selectedOrder?.table_number && parseFloat(selectedOrder.table_number) > 0
                          ? `Table ${parseFloat(selectedOrder.table_number)}`
                          : "Walk-in Customer")}
                    </Text>
                  </View>
                  {(selectedOrder?.customer_phone || selectedOrder?.user?.phone) && (
                    <View className="flex-row justify-between">
                      <Text className="text-xs text-accent">Phone:</Text>
                      <Text className="text-xs font-bold text-neutral">
                        {selectedOrder.customer_phone || selectedOrder.user.phone}
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Time:</Text>
                    <Text className="text-xs font-bold text-neutral">
                      {selectedOrder?.created_at || "--:--"}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Items details list */}
              <View className="gap-y-2 mt-4">
                <Text className="text-xs font-bold text-accent uppercase tracking-wider">Order Items</Text>
                <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-3">
                  <View className="border-b border-base-200 pb-2">
                    <Text className="text-xs text-neutral leading-5 font-semibold">
                      {getOrderItemsText(selectedOrder)}
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center pt-1">
                    <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
                    <Text className="text-md font-bold text-primary">
                      £{parseFloat(selectedOrder?.amount || selectedOrder?.final_price || "0").toFixed(2)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Bottom Modal Actions */}
            <TouchableOpacity
              onPress={() => setShowDetailsModal(false)}
              className="w-full bg-primary py-3 rounded-lg items-center justify-center mt-2 shadow-sm"
            >
              <Text className="text-white font-bold text-xs">Close Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
