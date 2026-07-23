import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import EmptyState from "../reuseable/EmptyState";

interface TopDishesProps {
  filterBy: string;
  topDishes: any[];
  isLoading: boolean;
}

export default function TopDishes({ filterBy, topDishes = [], isLoading }: TopDishesProps) {

  if (isLoading) {
    return (
      <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[120px] justify-center items-center">
        <Text className="text-xs text-accent">Loading top dishes...</Text>
      </View>
    );
  }

  return (
    <View className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xs font-bold text-accent tracking-widest uppercase font-semibold">
          Top Best Sellers
        </Text>
        <MaterialIcons name="star-outline" size={20} color="#6E6E6E" />
      </View>

      {topDishes.length === 0 ? (
        <EmptyState description="No best sellers data available" pyClassName="py-8" />
      ) : (
        <View className="gap-y-3">
          {topDishes.map((dish: any, i: number) => {
            const dishId = dish.id || dish.name || i;
            const dishName = dish.name || "Unknown";
            const dishCount = dish.count ?? dish.total_quantity ?? dish.order_count ?? 0;
            return (
              <View key={dishId} className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-3">
                  <Text className="text-xs font-bold text-primary">0{i + 1}</Text>
                  <Text className="text-xs font-medium text-neutral">{dishName}</Text>
                </View>
                <Text className="text-xs font-bold text-neutral">{dishCount} sold</Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
