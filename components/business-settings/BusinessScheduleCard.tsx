import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface TimeSlot {
  id: number;
  start_at: string;
  end_at: string;
}

interface TimingDay {
  day: number;
  is_weekend: number; // 1 = closed, 0 = open
  time_slots?: TimeSlot[];
}

interface BusinessScheduleCardProps {
  timing: TimingDay;
}

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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

export default function BusinessScheduleCard({ timing }: BusinessScheduleCardProps) {
  const dayName = DAY_NAMES[timing.day] || `Day ${timing.day}`;
  const isClosed = timing.is_weekend === 1 || !timing.time_slots || timing.time_slots.length === 0;

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4">
      {/* Day Title and Open/Closed Status */}
      <View className="flex-row items-center justify-between pb-3 border-b border-base-200/50 mb-3">
        <Text className="text-md font-bold text-neutral">{dayName}</Text>

        {/* Status indicator */}
        {isClosed ? (
          <View className="flex-row items-center px-2.5 py-1 rounded-full border bg-neutral/5 border-neutral/10">
            <MaterialIcons name="pause-circle-outline" size={12} color="#A3A3A3" style={{ marginRight: 4 }} />
            <Text className="text-[10px] font-bold text-neutral/50">Closed</Text>
          </View>
        ) : (
          <View className="flex-row items-center px-2.5 py-1 rounded-full border bg-green-50 border-green-100">
            <MaterialIcons name="check-circle" size={12} color="#15803D" style={{ marginRight: 4 }} />
            <Text className="text-[10px] font-bold text-green-700">Open</Text>
          </View>
        )}
      </View>

      {/* Time Slots display */}
      {isClosed ? (
        <View className="py-2 items-center justify-center">
          <Text className="text-xs font-semibold text-accent/60 italic">Not operating on this day</Text>
        </View>
      ) : (
        <View className="gap-y-2">
          {timing.time_slots?.map((slot, index) => (
            <View key={slot.id || index} className="flex-row items-center justify-between bg-base-200/50 p-2.5 rounded-lg">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="schedule" size={16} color="#6E6E6E" />
                <Text className="text-xs font-bold text-neutral">Slot {index + 1}</Text>
              </View>
              <Text className="text-xs font-bold text-primary">
                {formatTime(slot.start_at)} — {formatTime(slot.end_at)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
