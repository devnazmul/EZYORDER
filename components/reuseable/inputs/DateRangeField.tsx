import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="font-semibold text-accent capitalize mb-3"
        >
          {label}
        </Text>
      )}
      <View className="flex-row items-center gap-3">
        {/* Start Date */}
        <TouchableOpacity
          onPress={onSelectStartDate}
          activeOpacity={0.8}
          style={{ padding: WP("2.5%") }}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
        >
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize"
            >
              {startLabel}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral mt-0.5"
            >
              {formatDateLabel(startDateValue)}
            </Text>
          </View>
          <MaterialIcons name="calendar-today" size={WP("4.5%")} color={COLORS.primary} />
        </TouchableOpacity>

        {/* End Date */}
        <TouchableOpacity
          onPress={onSelectEndDate}
          activeOpacity={0.8}
          style={{ padding: WP("2.5%") }}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
        >
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize"
            >
              {endLabel}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral mt-0.5"
            >
              {formatDateLabel(endDateValue)}
            </Text>
          </View>
          <MaterialIcons name="calendar-today" size={WP("4.5%")} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
