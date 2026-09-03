import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function WeeklyPerformance() {
  const chartData = [45, 60, 30, 80, 50, 90, 70];
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <View className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-md relative overflow-hidden min-h-[220px]">
      {/* Decorative Blur Background Circles */}
      <View className="absolute -right-10 -top-10 w-28 h-28 bg-white/5 rounded-full" />
      <View className="absolute -left-10 -bottom-10 w-28 h-28 bg-emerald-500/10 rounded-full" />

      <View className="flex-row justify-between items-center mb-6">
        <View>
          <Text className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            Weekly Performance
          </Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-white text-2xl font-black">£210.00</Text>
            <View className="flex-row items-center bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
              <Feather name="trending-up" size={10} color="#36d399" />
              <Text className="text-emerald-400 text-[9px] font-bold ml-0.5">+12%</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="flex-row items-end justify-between h-24 mt-2">
        {chartData.map((val, idx) => {
          const isHighest = idx === 5; // highlight Saturday
          return (
            <View key={idx} className="flex-1 items-center gap-2">
              <View className="w-2.5 h-full bg-white/5 rounded-full justify-end overflow-hidden">
                <View
                  style={{ height: `${val}%` }}
                  className={`w-full rounded-full ${isHighest ? "bg-emerald-400" : "bg-white/20"}`}
                />
              </View>
              <Text
                className={`text-[8px] font-black uppercase ${
                  isHighest ? "text-emerald-400" : "text-white/30"
                }`}
              >
                {days[idx]}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
