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
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
          {label}
        </Text>
      )}
      <View className="flex-row items-center gap-3">
        {/* Min Input */}
        <View className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3">
          <View className="flex-1">
            <Text className="text-[8px] font-bold text-accent uppercase">{minLabel}</Text>
            <TextInput
              keyboardType="numeric"
              placeholder={minPlaceholder}
              placeholderTextColor="#6E6E6E"
              value={minValue}
              onChangeText={onChangeMinText}
              className="text-xs font-semibold text-neutral mt-0.5 p-0"
            />
          </View>
        </View>

        {/* Max Input */}
        <View className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl p-3">
          <View className="flex-1">
            <Text className="text-[8px] font-bold text-accent uppercase">{maxLabel}</Text>
            <TextInput
              keyboardType="numeric"
              placeholder={maxPlaceholder}
              placeholderTextColor="#6E6E6E"
              value={maxValue}
              onChangeText={onChangeMaxText}
              className="text-xs font-semibold text-neutral mt-0.5 p-0"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
