import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ToggleBarOption {
  id: string;
  label: string;
}

interface ToggleBarProps {
  options: ToggleBarOption[];
  activeId: string;
  onSelect: (id: any) => void;
  containerClassName?: string;
}

export default function ToggleBar({
  options,
  activeId,
  onSelect,
  containerClassName = "mb-4",
}: ToggleBarProps) {
  return (
    <View className={`flex-row p-1 bg-base-200 rounded-xl ${containerClassName}`}>
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option.id)}
            className={
              isActive
                ? "flex-1 py-2.5 items-center justify-center rounded-lg bg-primary"
                : "flex-1 py-2.5 items-center justify-center rounded-lg"
            }
          >
            <Text
              className={isActive ? "text-xs font-semibold text-white" : "text-xs font-semibold text-accent"}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
