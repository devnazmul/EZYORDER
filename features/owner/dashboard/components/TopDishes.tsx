import Badge from "@/components/reuseable/Badge";
import EmptyState from "@/components/reuseable/EmptyState";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface TopDishItem {
  name: string;
  total_quantity: number;
  order_count: number;
  percent: number;
}

interface TopDishesProps {
  filterBy: string;
  topDishes: TopDishItem[];
  isLoading: boolean;
}

const LEADERBOARD_CONFIG = [
  {
    rowStyle: { backgroundColor: "rgba(234, 179, 8, 0.12)", borderColor: "rgba(234, 179, 8, 0.35)" },
    color: "#EAB308",
    trophy: "#FFD700",
  },
  {
    rowStyle: { backgroundColor: "rgba(148, 163, 184, 0.18)", borderColor: "rgba(148, 163, 184, 0.4)" },
    color: "#94A3B8",
    trophy: "#C0C0C0",
  },
  {
    rowStyle: { backgroundColor: "rgba(180, 83, 9, 0.14)", borderColor: "rgba(180, 83, 9, 0.35)" },
    color: "#B45309",
    trophy: "#CD7F32",
  },
];

export default function TopDishes({ filterBy, topDishes = [], isLoading }: TopDishesProps) {
  const handleDishPress = (dishName: string) => {
    router.push({
      pathname: "/orders/all-orders",
      params: {
        tab: "eat_in,delivery,take_away,walk_in",
        filterBy,
        date_filter: filterBy,
        dish_ids: dishName,
        dish_name: dishName,
      },
    });
  };

  if (isLoading) {
    return (
      <View
        key="loading"
        className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[120px] justify-center items-center"
      >
        <Text className="text-xs text-accent">Loading top dishes...</Text>
      </View>
    );
  }

  return (
    <View key="loaded" className="bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm">
      <View className="pb-3 border-b border-base-200 mb-4">
        <Text className="text-sm font-semibold text-neutral capitalize">
          Top Dishes Performance {filterBy.split("_").join(" ")}
        </Text>
      </View>

      {topDishes.length === 0 ? (
        <View key="empty">
          <EmptyState description="No best sellers data available" pyClassName="py-8" />
        </View>
      ) : (
        <View className="gap-y-2.5">
          {topDishes.map((dish, i) => {
            const cfg = LEADERBOARD_CONFIG[i];

            return (
              <TouchableOpacity
                key={dish.name || i}
                onPress={() => handleDishPress(dish.name)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-3 border rounded-xl gap-x-3 bg-base-100/50 border-base-200"
                style={cfg?.rowStyle}
              >
                {/* Text Content */}
                <View className="flex-row items-center gap-3 flex-1 min-w-0">
                  <View
                    className="w-7 h-7 rounded-full items-center justify-center bg-primary/10 overflow-hidden"
                    style={cfg ? { backgroundColor: cfg.color } : undefined}
                  >
                    <Text
                      className="text-xs font-bold text-primary"
                      style={cfg ? { color: "#FFFFFF" } : undefined}
                    >
                      {i + 1}
                    </Text>
                  </View>

                  <View className="flex-1 min-w-0 items-start gap-1">
                    <Text className="text-xs font-bold text-neutral capitalize">
                      {dish.name}
                    </Text>
                    <Badge
                      text={`${dish.total_quantity} sold`}
                      containerClassName="-ml-1 bg-primary/10 border border-primary/20 "
                      textClassName="text-primary opacity-80"
                    />
                  </View>
                </View>

                {/* Progress Bar & Percentage */}
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs font-semibold text-neutral/50">{dish.percent}%</Text>
                  <View className="h-2 bg-base-200/70 rounded-full overflow-hidden w-16">
                    <View
                      className="bg-primary h-full rounded-full"
                      style={[
                        { width: `${dish.percent}%` },
                        cfg ? { backgroundColor: cfg.color } : undefined,
                      ]}
                    />
                  </View>
                </View>

                {/* Cup Icon */}
                <View className="w-6 items-center justify-center">
                  {cfg ? <Ionicons name="trophy" size={20} color={cfg.trophy} /> : null}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
