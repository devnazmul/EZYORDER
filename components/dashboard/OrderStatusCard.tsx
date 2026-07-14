import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface OrderStatusCardProps {
  title: string;
  count: number;
  type: "new" | "preparing" | "completed" | "unpaid";
}

export default function OrderStatusCard({ title, count, type }: OrderStatusCardProps) {
  let containerClass = "";
  let textClass = "";
  let circleClass = "";

  if (type === "new") {
    containerClass = "bg-blue-500/10 border-l-4 border-blue-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-blue-800 tracking-wider";
    circleClass = "w-6 h-6 items-center justify-center rounded-full bg-blue-500";
  } else if (type === "preparing") {
    containerClass = "bg-orange-500/10 border-l-4 border-orange-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-orange-800 tracking-wider";
    circleClass = "bg-orange-500 w-6 h-6 items-center justify-center rounded-full";
  } else if (type === "completed") {
    containerClass = "bg-gray-500/10 border-l-4 border-gray-500 p-4 flex-row justify-between items-center rounded-r-xl opacity-60";
    textClass = "text-xs font-bold text-gray-800 tracking-wider";
    circleClass = "bg-gray-500 w-6 h-6 items-center justify-center rounded-full";
  } else if (type === "unpaid") {
    containerClass = "bg-pink-500/10 border-l-4 border-pink-500 p-4 flex-row justify-between items-center rounded-r-xl";
    textClass = "text-xs font-bold text-pink-800 tracking-wider";
    circleClass = "bg-pink-500 w-6 h-6 items-center justify-center rounded-full";
  }

  const handlePress = () => {
    let params: Record<string, string> = {
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

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={handlePress} className={containerClass}>
      <Text className={textClass}>{title}</Text>
      <View className={circleClass}>
        <Text className="text-white text-[11px] font-extrabold">{count}</Text>
      </View>
    </TouchableOpacity>
  );
}
