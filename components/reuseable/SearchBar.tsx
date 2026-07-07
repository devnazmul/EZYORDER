import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  containerClassName?: string;
}

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
  containerClassName = "",
}: SearchBarProps) {
  return (
    <View
      className={`flex-row items-center bg-base-300 border border-base-200 rounded-lg px-4 py-2.5 ${containerClassName}`}
    >
      <MaterialIcons name="search" size={20} color="#6E6E6E" />
      <TextInput
        className="flex-1 ml-2 text-xs font-semibold text-neutral p-0"
        placeholder={placeholder}
        placeholderTextColor="#8C8C8C"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")}>
          <MaterialIcons name="close" size={18} color="#6E6E6E" />
        </TouchableOpacity>
      )}
    </View>
  );
}
