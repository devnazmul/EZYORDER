import React from "react";
import { Text, View } from "react-native";
import OrderStatusCard from "./OrderStatusCard";

interface LiveOrderBoardProps {
  liveOrderBoard: any;
  isLoading: boolean;
}

export default function LiveOrderBoard({ liveOrderBoard = {}, isLoading }: LiveOrderBoardProps) {
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

  return (
    <View key="loaded" className="mb-6 gap-y-3">
      <Text className="text-base font-bold text-neutral">Live Today's Order Board</Text>
      <View className="gap-y-2">
        <OrderStatusCard title="NEW ORDERS" count={liveOrderBoard?.new_order || 0} type="new" />
        <OrderStatusCard title="PREPARING" count={liveOrderBoard?.preparing || 0} type="preparing" />
        <OrderStatusCard title="COMPLETED" count={liveOrderBoard?.complete || 0} type="completed" />
        <OrderStatusCard title="UNPAID" count={liveOrderBoard?.unpaid || 0} type="unpaid" />
      </View>
    </View>
  );
}
