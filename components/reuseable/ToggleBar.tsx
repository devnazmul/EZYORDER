import COLORS from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
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
    <View style={{ padding: WP("1%") }} className={`flex-row bg-base-200 rounded-xl ${containerClassName}`}>
      {options.map((option) => {
        const isActive = option.id === activeId;
        return (
          <TouchableOpacity
            key={option.id}
            onPress={() => onSelect(option.id)}
            style={{ paddingVertical: HP("1%"), paddingHorizontal: WP("2%") }}
            className={
              isActive
                ? "flex-1 flex-row items-center justify-center gap-1.5 rounded-lg bg-primary"
                : "flex-1 flex-row items-center justify-center gap-1.5 rounded-lg"
            }
          >
            {option.icon && (
              <MaterialIcons
                name={option.icon}
                size={WP("4%")}
                color={isActive ? COLORS.base300 : COLORS.accent}
              />
            )}
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className={
                isActive ? "font-semibold capitalize text-white" : "font-semibold capitalize text-accent"
              }
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
