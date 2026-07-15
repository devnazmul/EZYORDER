import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";

interface LiveOrderBoardProps {
  orderBoardData?: {
    new_orders?: number;
    new_order?: number;
    preparing?: number;
    completed?: number;
    complete?: number;
    unpaid?: number;
  };
  isLoading?: boolean;
}

interface ColumnProps {
  label: string;
  count: number;
  color: {
    bg: string;
    border: string;
    text: string;
    icon: string;
  };
  iconName: any;
  iconType?: "Feather" | "MaterialCommunity";
  isLoading?: boolean;
}

function BoardItem({ label, count, color, iconName, iconType = "Feather", isLoading }: ColumnProps) {
  if (isLoading) {
    return (
      <View
        key="loading"
        className="flex-row items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl h-14 animate-pulse mb-2"
      >
        <View className="h-4 w-24 bg-slate-200 rounded" />
        <View className="h-6 w-8 bg-slate-200 rounded-full" />
      </View>
    );
  }

  const renderIcon = () => {
    if (iconType === "MaterialCommunity") {
      return <MaterialCommunityIcons name={iconName} size={22} color={color.icon} />;
    }
    return <Feather name={iconName} size={20} color={color.icon} />;
  };

  return (
    <View
      key="loaded"
      className={`flex-row items-center justify-between p-4 ${color.bg} border-b-4 ${color.border} rounded-xl mb-2.5`}
    >
      <View className="flex-row items-center gap-3">
        <View className="p-1.5 bg-white/60 rounded-lg">{renderIcon()}</View>
        <Text className={`${color.text} font-black text-sm uppercase tracking-wider`}>
          {label}
        </Text>
      </View>
      <Text className={`${color.text} font-black text-xl`}>{count}</Text>
    </View>
  );
}

export default function LiveOrderBoard({ orderBoardData, isLoading = false }: LiveOrderBoardProps) {
  const newOrdersCount = orderBoardData?.new_orders ?? orderBoardData?.new_order ?? 0;
  const preparingCount = orderBoardData?.preparing ?? 0;
  const completedCount = orderBoardData?.completed ?? orderBoardData?.complete ?? 0;
  const unpaidCount = orderBoardData?.unpaid ?? 0;

  return (
    <View className="bg-base-300 border border-base-200 rounded-2xl p-5 shadow-sm">
      <Text className="text-sm font-black text-neutral uppercase tracking-wider mb-4">
        Today's Live Order Board
      </Text>

      <View className="flex-col">
        <BoardItem
          label="New Orders"
          count={newOrdersCount}
          color={{
            bg: "bg-blue-50",
            border: "border-blue-500",
            text: "text-blue-700",
            icon: "#3b82f6",
          }}
          iconName="bell"
          isLoading={isLoading}
        />

        <BoardItem
          label="Preparing"
          count={preparingCount}
          color={{
            bg: "bg-orange-50",
            border: "border-orange-500",
            text: "text-orange-700",
            icon: "#f97316",
          }}
          iconName="clock"
          isLoading={isLoading}
        />

        <BoardItem
          label="Completed"
          count={completedCount}
          color={{
            bg: "bg-emerald-50",
            border: "border-emerald-500",
            text: "text-emerald-700",
            icon: "#10b981",
          }}
          iconName="check-circle"
          isLoading={isLoading}
        />

        <BoardItem
          label="Unpaid"
          count={unpaidCount}
          color={{
            bg: "bg-rose-50",
            border: "border-rose-500",
            text: "text-rose-700",
            icon: "#ef4444",
          }}
          iconName="alert-circle"
          isLoading={isLoading}
        />
      </View>
    </View>
  );
}
