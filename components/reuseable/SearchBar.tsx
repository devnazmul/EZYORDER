import COLORS from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { KeyboardTypeOptions, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerClassName?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  containerClassName = "",
  keyboardType = "default",
}: SearchBarProps) {
  return (
    <View
      style={{ paddingHorizontal: WP("3%"), paddingVertical: HP("1.2%") }}
      className={`flex-row items-center bg-base-300 border border-base-200 rounded-lg ${containerClassName}`}
    >
      <MaterialIcons name="search" size={WP("5%")} color={COLORS.accent} />
      <TextInput
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="flex-1 ml-2 font-semibold text-neutral p-0"
        placeholder={placeholder}
        placeholderTextColor={COLORS.accent}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialIcons name="close" size={WP("4.5%")} color={COLORS.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}
