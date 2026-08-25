// 1. React / React Native
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

// ==================== TYPES ====================
export interface ITimeRangeFieldProps {
  label?: string;
  startLabel?: string;
  endLabel?: string;
  startTimeValue?: string;
  endTimeValue?: string;
  onSelectStartTime: () => void;
  onSelectEndTime: () => void;
  formatTimeLabel: (timeStr?: string) => string;
}

// ==================== COMPONENT ====================
export default function TimeRangeField({
  label,
  startLabel = "Start Time",
  endLabel = "End Time",
  startTimeValue = "",
  endTimeValue = "",
  onSelectStartTime,
  onSelectEndTime,
  formatTimeLabel,
}: Readonly<ITimeRangeFieldProps>) {
  return (
    <View>
      {!!label && (
        <Text
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="font-semibold text-accent capitalize mb-3"
        >
          {label}
        </Text>
      )}
      <View className="flex-row items-center gap-3">
        {/* Start Time */}
        <TouchableOpacity
          onPress={onSelectStartTime}
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
              {formatTimeLabel(startTimeValue)}
            </Text>
          </View>
          <MaterialIcons
            name="access-time"
            size={WP("4.5%")}
            color={COLORS.primary}
          />
        </TouchableOpacity>

        {/* End Time */}
        <TouchableOpacity
          onPress={onSelectEndTime}
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
              {formatTimeLabel(endTimeValue)}
            </Text>
          </View>
          <MaterialIcons
            name="access-time"
            size={WP("4.5%")}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
