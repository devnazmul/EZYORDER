import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { DriverOrder } from "../types";
import DriverActiveOrderCard from "./DriverActiveOrderCard";

interface DriverActiveOrderProps {
  ordersList: DriverOrder[] | [];
  isLoading: boolean;
  updateStatusMutation: any;
}

const DriverActiveOrder: React.FC<DriverActiveOrderProps> = ({
  ordersList,
  isLoading,
  updateStatusMutation,
}: DriverActiveOrderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);

  const handleScroll = (event: any) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / (containerWidth || 1));
    if (index >= 0 && index < ordersList.length) {
      setActiveIndex(index);
    }
  };

  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 p-4 pb-1 rounded-lg flex-1">
        <DriverActiveOrderCard
          activeOrder={{} as any}
          isLoading={true}
          updateStatusMutation={updateStatusMutation}
        />
      </View>
    );
  }

  if (!ordersList || ordersList.length === 0) {
    return (
      <View key="empty" className="bg-base-300 p-4 pb-1 rounded-lg flex-1 justify-center items-center py-10">
        <MaterialIcons name="inbox" size={48} color="#94a3b8" />
        <Text className="text-slate-400 font-bold mt-2">No active orders assigned</Text>
      </View>
    );
  }

  const activeOrder = ordersList[activeIndex];

  return (
    <View key="loaded" className="bg-base-300 p-4 pb-1 rounded-lg flex-1">
      <View className="mb-2 flex-row items-start justify-between px-1">
        <Text className="font-bold capitalize opacity-80">Active Order</Text>
        <Text className="font-extrabold capitalize opacity-30">
          {activeIndex + 1}/{ordersList.length}
        </Text>
      </View>
      <View className="flex-row items-start justify-between mb-4 px-1">
        <Text className="font-bold capitalize text-sm opacity-50">OrderId</Text>
        <Text className="font-bold capitalize text-sm opacity-30">{activeOrder?.id}</Text>
      </View>

      <View className="flex-1 w-full" onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}>
        {containerWidth > 0 && (
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {ordersList.map((order) => (
              <View key={order.id} style={{ width: containerWidth }}>
                <DriverActiveOrderCard
                  activeOrder={order}
                  isLoading={false}
                  updateStatusMutation={updateStatusMutation}
                />
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

DriverActiveOrder.displayName = "Driver Active Order";
export default DriverActiveOrder;
