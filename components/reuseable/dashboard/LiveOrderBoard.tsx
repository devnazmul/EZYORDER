import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import LiveOrderBoardSkeleton from "../skeletons/LiveOrderBoardSkeleton";

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
  let iconName: keyof typeof MaterialIcons.glyphMap = "notifications-none";
  let iconColor = "#2563eb";

  if (type === "new") {
    containerClass =
      "bg-blue-500/10 border-l-4 border-blue-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-blue-800 tracking-wider";
    iconName = "notifications-none";
    iconColor = "#2563eb";
  } else if (type === "preparing") {
    containerClass =
      "bg-orange-500/10 border-l-4 border-orange-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-orange-800 tracking-wider";
    iconName = "schedule";
    iconColor = "#f97316";
  } else if (type === "completed") {
    containerClass =
      "bg-gray-500/10 border-l-4 border-gray-500 p-4 flex-row justify-between items-center rounded-r-xl opacity-60";
    textClass = "text-xs font-bold text-gray-800 tracking-wider";
    iconName = "history";
    iconColor = "#4b5563";
  } else if (type === "unpaid") {
    containerClass =
      "bg-pink-500/10 border-l-4 border-pink-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-pink-800 tracking-wider";
    iconName = "history";
    iconColor = "#ec4899";
  }

  const handlePress = () => {
    if (role === "driver") {
      router.push({ pathname: "/(driver)/my-orders" });
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

  const isFlippedIcon = type === "completed" || type === "unpaid";

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} className={containerClass}>
      <Text className={textClass}>{`${title} (${count})`}</Text>
      <MaterialIcons
        name={iconName}
        size={22}
        color={iconColor}
        style={isFlippedIcon ? { transform: [{ scaleX: -1 }] } : undefined}
      />
    </TouchableOpacity>
  );
}

export default function LiveOrderBoard({
  liveOrderBoard,
  isLoading = false,
  role = "manager",
}: LiveOrderBoardProps) {
  if (isLoading) {
    return <LiveOrderBoardSkeleton />;
  }

  const newOrdersCount = liveOrderBoard?.new_order ?? 0;
  const preparingCount = liveOrderBoard?.preparing ?? 0;
  const completedCount = liveOrderBoard?.complete ?? 0;
  const unpaidCount = liveOrderBoard?.unpaid ?? 0;

  return (
    <View key="loaded" className="gap-y-2">
      <OrderStatusCard title="New Orders" count={newOrdersCount} type="new" role={role} />
      <OrderStatusCard title="Preparing" count={preparingCount} type="preparing" role={role} />
      <OrderStatusCard title="Completed" count={completedCount} type="completed" role={role} />
      <OrderStatusCard title="Unpaid" count={unpaidCount} type="unpaid" role={role} />
    </View>
  );
}
