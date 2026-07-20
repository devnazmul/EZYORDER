import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface LiveOrderBoardData {
  new_order: number;
  preparing: number;
  complete: number;
  unpaid: number;
}

export interface LiveOrderBoardProps {
  liveOrderBoard?: LiveOrderBoardData;
  isLoading?: boolean;
  role?: "manager" | "driver";
}

interface OrderStatusCardProps {
  title: string;
  count: number;
  type: "new" | "preparing" | "completed" | "unpaid";
  role?: "manager" | "driver";
}

function OrderStatusCard({ title, count, type, role = "manager" }: OrderStatusCardProps) {
  let containerClass = "";
  let textClass = "";
  let circleClass = "";

  if (type === "new") {
    containerClass =
      "bg-blue-500/10 border-l-4 border-blue-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-blue-800 tracking-wider";
    circleClass = "w-6 h-6 items-center justify-center rounded-full bg-blue-500";
  } else if (type === "preparing") {
    containerClass =
      "bg-orange-500/10 border-l-4 border-orange-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-orange-800 tracking-wider";
    circleClass = "bg-orange-500 w-6 h-6 items-center justify-center rounded-full";
  } else if (type === "completed") {
    containerClass =
      "bg-gray-500/10 border-l-4 border-gray-500 p-4 flex-row justify-between items-center rounded-r-xl opacity-60";
    textClass = "text-xs font-bold text-gray-800 tracking-wider";
    circleClass = "bg-gray-500 w-6 h-6 items-center justify-center rounded-full";
  } else if (type === "unpaid") {
    containerClass =
      "bg-pink-500/10 border-l-4 border-pink-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-pink-800 tracking-wider";
    circleClass = "bg-pink-500 w-6 h-6 items-center justify-center rounded-full";
  }

  const handlePress = () => {
    if (role === "driver") {
      // TODO: Place driver specific routes here when provided
      return;
    }

    // Default: manager route
    const params: Record<string, string> = {
      tab: "eat_in,delivery,take_away,walk_in",
    };

    if (type === "new") {
      params.status = "pending";
      params.payment_status = "";
    } else if (type === "preparing") {
      params.status = "kitchen";
      params.payment_status = "";
    } else if (type === "completed") {
      params.status = "completed";
      params.payment_status = "";
    } else if (type === "unpaid") {
      params.status = "";
      params.payment_status = "unpaid";
    }

    router.push({
      pathname: "/orders/todays-orders",
      params,
    });
  };

  const isInteractive = role !== "driver";

  return (
    <TouchableOpacity
      activeOpacity={isInteractive ? 0.8 : 1}
      onPress={handlePress}
      disabled={role === "driver"} // Temporarily disabled for driver until routes are specified
      className={containerClass}
    >
      <Text className={textClass}>{title}</Text>
      <View className={circleClass}>
        <Text className="text-white text-[11px] font-extrabold">{count}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function LiveOrderBoard({
  liveOrderBoard,
  isLoading = false,
  role = "manager",
}: LiveOrderBoardProps) {
  if (isLoading) {
    return (
      <View
        key="loading"
        className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[160px] justify-center items-center"
      >
        <Text className="text-xs text-accent">Loading order board...</Text>
      </View>
    );
  }

  const newOrdersCount = liveOrderBoard?.new_order ?? 0;
  const preparingCount = liveOrderBoard?.preparing ?? 0;
  const completedCount = liveOrderBoard?.complete ?? 0;
  const unpaidCount = liveOrderBoard?.unpaid ?? 0;

  return (
    <View key="loaded" className="mb-6 gap-y-3">
      <Text className="text-base font-bold text-neutral">Live Today's Order Board</Text>
      <View className="gap-y-2">
        <OrderStatusCard title="NEW ORDERS" count={newOrdersCount} type="new" role={role} />
        <OrderStatusCard title="PREPARING" count={preparingCount} type="preparing" role={role} />
        <OrderStatusCard title="COMPLETED" count={completedCount} type="completed" role={role} />
        <OrderStatusCard title="UNPAID" count={unpaidCount} type="unpaid" role={role} />
      </View>
    </View>
  );
}
