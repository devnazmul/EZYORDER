import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { Text, TextInput, View } from "react-native";

interface NumberRangeFieldProps {
  label?: string;
  minLabel?: string;
  maxLabel?: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  minValue?: string;
  maxValue?: string;
  onChangeMinText: (text: string) => void;
  onChangeMaxText: (text: string) => void;
}

export default function NumberRangeField({
  label,
  minLabel = "Min Amount",
  maxLabel = "Max Amount",
  minPlaceholder = "0.00",
  maxPlaceholder = "0.00",
  minValue = "",
  maxValue = "",
  onChangeMinText,
  onChangeMaxText,
}: NumberRangeFieldProps) {
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
        {/* Min Input */}
        <View
          style={{ padding: WP("2.5%") }}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
        >
          <View className="flex-1">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize"
            >
              {minLabel}
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder={minPlaceholder}
              placeholderTextColor={COLORS.accent}
              value={minValue}
              onChangeText={onChangeMinText}
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral mt-0.5 p-0"
            />
          </View>
        </View>

        {/* Max Input */}
        <View
          style={{ padding: WP("2.5%") }}
          className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
        >
          <View className="flex-1">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
              className="font-semibold text-accent capitalize"
            >
              {maxLabel}
            </Text>
            <TextInput
              keyboardType="numeric"
              placeholder={maxPlaceholder}
              placeholderTextColor={COLORS.accent}
              value={maxValue}
              onChangeText={onChangeMaxText}
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral mt-0.5 p-0"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
