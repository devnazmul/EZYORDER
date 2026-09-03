// 1. React / React Native
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

// 7. Constants / utils
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";

export interface IChipItem {
  id: string;
  label: string;
}

export interface IFilterChipsProps {
  chips: IChipItem[];
  selectedId: string | string[];
  onSelect: (id: string) => void;
  containerClassName?: string;
  isBottomSheet?: boolean;
}

export default function FilterChips({
  chips,
  selectedId,
  onSelect,
  containerClassName = "",
  isBottomSheet = false,
}: Readonly<IFilterChipsProps>) {
  const renderChips = () =>
    chips.map((chip) => {
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
            marginRight: isBottomSheet ? 0 : WP("2%"),
          }}
          className={
            isSelected
              ? "rounded-lg border border-primary/20 bg-primary items-center justify-center self-start"
              : "rounded-lg border border-primary/20 bg-base-300 items-center justify-center self-start"
          }
        >
          <Text
            numberOfLines={1}
            className={
              isSelected
                ? "font-bold text-center text-white"
                : "font-bold text-center text-accent"
            }
            style={{ flexShrink: 0, fontSize: getResponsiveFontSize("xs") }}
          >
            {chip.label}
          </Text>
        </TouchableOpacity>
      );
    });

  if (isBottomSheet) {
    return (
      <View className={`flex-row flex-wrap gap-2 ${containerClassName}`}>
        {renderChips()}
      </View>
    );
  }

  return (
    <View className={containerClassName}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: "row", paddingRight: WP("4%") }}
      >
        {renderChips()}
      </ScrollView>
    </View>
  );
}
