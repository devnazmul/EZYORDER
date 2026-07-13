import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DateFieldProps {
  label?: string;
  selectedLabel?: string;
  value?: string;
  onPress: () => void;
  formatDateLabel: (dateStr: string) => string;
}

export default function DateField({
  label,
  selectedLabel = "Selected Date",
  value = "",
  onPress,
  formatDateLabel,
}: DateFieldProps) {
  return (
    <View>
      {label && (
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        className="flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3"
      >
        <View>
          <Text className="text-[8px] font-bold text-accent uppercase">{selectedLabel}</Text>
          <Text className="text-xs font-semibold text-neutral mt-0.5">
            {formatDateLabel(value)}
          </Text>
        </View>
        <MaterialIcons name="calendar-today" size={16} color="#DC2D2A" />
      </TouchableOpacity>
    </View>
  );
}
