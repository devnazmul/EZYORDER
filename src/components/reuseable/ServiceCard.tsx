import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

export interface IServiceCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  isEnabled: boolean | number;
  paymentMode?: { cash: number; stripe: number };
}

export function ServiceCard({ icon, title, isEnabled, paymentMode }: Readonly<IServiceCardProps>) {
  const enabled = !!isEnabled;
  return (
    <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-base-200/50 mb-3">
        <View className="flex-row items-center gap-2">
          <View className={`p-1.5 rounded-lg ${enabled ? "bg-primary/10" : "bg-neutral/5"}`}>
            <MaterialIcons name={icon} size={18} color={enabled ? "#DC2D2A" : "#6E6E6E"} />
          </View>
          <Text className="text-md font-bold text-neutral">{title}</Text>
        </View>
        <View
          className={`px-2.5 py-0.5 rounded-full border ${enabled ? "bg-green-50 border-green-100" : "bg-neutral/5 border-neutral/10"}`}
        >
          <Text className={`text-[9px] font-bold ${enabled ? "text-green-700" : "text-neutral/40"}`}>
            {enabled ? "ACTIVE" : "INACTIVE"}
          </Text>
        </View>
      </View>

      {enabled ? (
        <View className="space-y-2">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
            Accepted Payment Modes
          </Text>
          <View className="flex-row gap-3">
            <View
              className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg border ${paymentMode?.cash ? "bg-primary/5 border-primary/20 text-primary" : "bg-base-200 border-transparent"}`}
            >
              <MaterialIcons
                name="attach-money"
                size={14}
                color={paymentMode?.cash ? "#DC2D2A" : "#6E6E6E"}
                style={{ marginRight: 4 }}
              />
              <Text className={`text-xs font-bold ${paymentMode?.cash ? "text-primary" : "text-accent"}`}>
                Cash
              </Text>
            </View>
            <View
              className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg border ${paymentMode?.stripe ? "bg-primary/5 border-primary/20 text-primary" : "bg-base-200 border-transparent"}`}
            >
              <MaterialIcons
                name="credit-card"
                size={14}
                color={paymentMode?.stripe ? "#DC2D2A" : "#6E6E6E"}
                style={{ marginRight: 4 }}
              />
              <Text className={`text-xs font-bold ${paymentMode?.stripe ? "text-primary" : "text-accent"}`}>
                Card/Online
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-xs font-semibold text-accent/50 italic py-1 text-center">
          Service is disabled
        </Text>
      )}
    </View>
  );
}

export default ServiceCard;
