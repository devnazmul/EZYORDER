import Badge from "@/components/reuseable/Badge";
import COLORS from "@/constants/colors";
import { dayWiseSlotDivide } from "@/utils/dayWiseSlotDivide";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

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
      <View
        style={{ padding: WP("4%"), gap: WP("3%") }}
        className="bg-amber-500/10 border border-amber-200 rounded-xl flex-row items-center"
      >
        <MaterialIcons name="info-outline" size={WP("5%")} color="#d97706" />
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="text-amber-800 font-semibold flex-1"
        >
          This category is marked as time-based but has no operating hours slots defined.
        </Text>
      </View>
    );
  }

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm ">
      {/* Title */}
      <View
        style={{ paddingHorizontal: WP("4%"), paddingVertical: WP("3%"), gap: WP("2%") }}
        className="bg-base-200 flex-row items-center border-b border-base-200/50"
      >
        <MaterialIcons name="schedule" size={WP("4%")} color={COLORS.primary} />
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="font-semibold text-neutral capitalize tracking-wider"
        >
          Operating Weekly Schedule
        </Text>
      </View>

      {/* Days grid list */}
      <View className="divide-y divide-base-200/50">
        {dividedDays.map((daySlot) => {
          const dayName = DAYS[daySlot.day] || `Day ${daySlot.day}`;
          return (
            <View key={daySlot.day} style={{ paddingVertical: HP("1%"), paddingHorizontal: WP("3%") }}>
              <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral mb-2">
                {dayName}
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {daySlot.slots.map((slot: any, idx: number) => (
                  <Badge
                    key={slot?.id || idx}
                    icon={<MaterialIcons name="alarm" size={WP("3.5%")} color={COLORS.primary} />}
                    text={`${formatTime(slot?.start_time)} — ${formatTime(slot?.end_time)}`}
                    containerClassName="bg-primary/10 border border-primary/20 rounded-full"
                    textClassName="text-primary capitalize"
                    textStyle={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
