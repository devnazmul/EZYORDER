import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DateRangeFieldProps {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  startDateValue?: string;
  endDateValue?: string;
  onSelectStartDate: () => void;
  onSelectEndDate: () => void;
  formatDateLabel: (dateStr: string) => string;
}

export default function DateRangeField({
  label,
  startLabel = "Start Date",
  endLabel = "End Date",
  startDateValue = "",
  endDateValue = "",
  onSelectStartDate,
  onSelectEndDate,
  formatDateLabel,
}: DateRangeFieldProps) {
  return (
    <View>
      {label && (
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
          {label}
        </Text>
      )}
      <View className="flex-row items-center gap-3">
        {/* Start Date */}
        <TouchableOpacity
          onPress={onSelectStartDate}
          activeOpacity={0.8}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
        >
          <View>
            <Text className="text-[8px] font-bold text-accent uppercase">{startLabel}</Text>
            <Text className="text-xs font-semibold text-neutral mt-0.5">
              {formatDateLabel(startDateValue)}
            </Text>
          </View>
          <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
        </TouchableOpacity>

        {/* End Date */}
        <TouchableOpacity
          onPress={onSelectEndDate}
          activeOpacity={0.8}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
        >
          <View>
            <Text className="text-[8px] font-bold text-accent uppercase">{endLabel}</Text>
            <Text className="text-xs font-semibold text-neutral mt-0.5">
              {formatDateLabel(endDateValue)}
            </Text>
          </View>
          <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
