import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface ToggleBarOption {
  id: string;
  label: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
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
                ? "flex-1 py-2.5 flex-row items-center justify-center gap-1.5 rounded-lg bg-primary"
                : "flex-1 py-2.5 flex-row items-center justify-center gap-1.5 rounded-lg"
            }
          >
            {option.icon && (
              <MaterialIcons
                name={option.icon}
                size={16}
                color={isActive ? "#ffffff" : "#6E6E6E"}
              />
            )}
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
