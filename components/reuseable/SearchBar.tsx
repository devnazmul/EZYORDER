import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
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
      style={{ paddingHorizontal: WP("3%") }}
      className={`flex-row items-center bg-base-300 border border-base-200 rounded-lg py-2.5 ${containerClassName}`}
    >
      <MaterialIcons name="search" size={WP("4.75%")} color="#6E6E6E" />
      <TextInput
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="flex-1 ml-2 font-semibold text-neutral p-0"
        placeholder={placeholder}
        placeholderTextColor="#8C8C8C"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialIcons name="close" size={WP("4.5%")} color="#6E6E6E" />
        </TouchableOpacity>
      )}
    </View>
  );
}
