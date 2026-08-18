import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
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
        contentContainerStyle={{ flexDirection: "row", paddingRight: WP("4%") }}
      >
        {chips.map((chip) => {
          const isSelected = Array.isArray(selectedId)
            ? selectedId.includes(chip.id)
            : chip.id === selectedId;
          return (
            <TouchableOpacity
              key={chip.id}
              onPress={() => onSelect(chip.id)}
              style={{
                paddingHorizontal: WP("4%"),
                paddingVertical: HP("0.75%"),
                marginRight: WP("2%"),
              }}
              className={
                isSelected
                  ? "rounded-lg border border-primary/20 bg-primary items-center justify-center"
                  : "rounded-lg border border-primary/20 bg-base-300 items-center justify-center"
              }
            >
              <Text
                numberOfLines={1}
                className={
                  isSelected ? "font-bold text-center text-white" : "font-bold text-center text-accent"
                }
                style={{ flexShrink: 0, fontSize: getResponsiveFontSize("xs") }}
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
