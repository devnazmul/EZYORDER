import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ChipItem {
  id: string;
  label: string;
}

interface FilterChipsProps {
  chips: ChipItem[];
  selectedId: string | string[];
  onSelect: (id: string) => void;
  containerClassName?: string;
}

export default function FilterChips({
  chips,
  selectedId,
  onSelect,
  containerClassName = "",
}: FilterChipsProps) {
  return (
    <View className={containerClassName}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", paddingRight: 16 }}
      >
        {chips.map((chip) => {
          const isSelected = Array.isArray(selectedId)
            ? selectedId.includes(chip.id)
            : chip.id === selectedId;
          return (
            <TouchableOpacity
              key={chip.id}
              onPress={() => onSelect(chip.id)}
              className={
                isSelected
                  ? "px-4 py-2 rounded-lg mr-2 border border-primary/20 bg-primary items-center justify-center"
                  : "px-4 py-2 rounded-lg mr-2 border border-primary/20 bg-base-300 items-center justify-center"
              }
            >
              <Text
                numberOfLines={1}
                className={
                  isSelected
                    ? "text-xs font-bold text-center text-white"
                    : "text-xs font-bold text-center text-accent"
                }
                style={{ flexShrink: 0 }}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
