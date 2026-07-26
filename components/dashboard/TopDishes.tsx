import React from "react";
import { Text, View } from "react-native";
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
      <View className="pb-3 border-b border-base-200 mb-4">
        <Text className="text-sm font-semibold text-neutral capitalize">
          Top Dishes Performance {filterBy.split("_").join(" ")}
        </Text>
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
