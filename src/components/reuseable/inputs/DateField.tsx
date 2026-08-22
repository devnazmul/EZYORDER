import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="font-semibold text-accent capitalize mb-3"
        >
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.8}
        style={{ padding: WP("3.5%") }}
        className="flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
      >
        <View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-accent capitalize"
          >
            {selectedLabel}
          </Text>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral mt-0.5"
          >
            {formatDateLabel(value)}
          </Text>
        </View>
        <MaterialIcons name="calendar-today" size={WP("4.5%")} color={COLORS.primary} />
      </TouchableOpacity>
    </View>
  );
}
