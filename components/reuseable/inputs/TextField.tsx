import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { KeyboardTypeOptions, Text, TextInput, View } from "react-native";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function TextField({
  label,
  placeholder = "Enter value...",
  value = "",
  onChangeText,
  keyboardType = "default",
}: TextFieldProps) {
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
      <View style={{ padding: WP("3") }} className="bg-base-100 border border-base-200 rounded-xl">
        <TextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor={COLORS.accent}
          value={value}
          onChangeText={onChangeText}
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="font-semibold text-neutral p-0"
        />
      </View>
    </View>
  );
}
