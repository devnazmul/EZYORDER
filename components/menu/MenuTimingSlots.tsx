import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { dayWiseSlotDivide } from "@/utils/dayWiseSlotDivide";

interface MenuTimingSlotsProps {
  timeSlots?: any[];
}

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

export default function MenuTimingSlots({ timeSlots }: MenuTimingSlotsProps) {
  const dividedDays = dayWiseSlotDivide(timeSlots);

  if (dividedDays.length === 0) {
    return (
      <View className="bg-amber-500/10 border border-amber-200 rounded-xl p-4 flex-row items-center gap-3">
        <MaterialIcons name="info-outline" size={20} color="#d97706" />
        <Text className="text-xs text-amber-800 font-semibold flex-1">
          This category is marked as time-based but has no operating hours slots defined.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm mb-4">
      {/* Title */}
      <View className="px-4 py-3 bg-base-200 flex-row items-center gap-2 border-b border-base-200/50">
        <MaterialIcons name="schedule" size={16} color="#DC2D2A" />
        <Text className="text-xs font-bold text-neutral uppercase tracking-widest">
          Operating Weekly Schedule
        </Text>
      </View>

      {/* Days grid list */}
      <View className="divide-y divide-base-200/50">
        {dividedDays.map((daySlot) => {
          const dayName = DAYS[daySlot.day] || `Day ${daySlot.day}`;
          return (
            <View key={daySlot.day} className="p-3">
              <Text className="text-xs font-bold text-neutral mb-2">{dayName}</Text>
              <View className="flex-row flex-wrap gap-2">
                {daySlot.slots.map((slot: any, idx: number) => (
                  <View
                    key={slot?.id || idx}
                    className="flex-row items-center bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full gap-1.5"
                  >
                    <MaterialIcons name="alarm" size={10} color="#DC2D2A" />
                    <Text className="text-[10px] font-black text-primary">
                      {formatTime(slot?.start_time)} — {formatTime(slot?.end_time)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
