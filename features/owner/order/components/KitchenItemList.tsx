import Badge from "@/components/reuseable/Badge";
import COLORS from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface KitchenItemListProps {
  detail: any[];
}

export default function KitchenItemList({ detail = [] }: KitchenItemListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const allItems = detail || [];
  const visibleItems = isExpanded ? allItems : allItems.slice(0, 3);
  const hasMoreItems = allItems.length > 3;

  return (
    <View className="gap-y-4">
      {visibleItems.map((item: any, idx: number) => {
        const dishName = item.dish?.name || "Unknown Item";
        const qty = item.qty || 1;
        const variations = item.variations || [];

        return (
          <View key={item.id || idx} className="flex-row items-start">
            {/* Qty Badge */}
            <Badge
              text={`${qty}x`}
              containerClassName="bg-primary/10 border border-primary/20 !px-0.5 py-1 rounded-lg mr-2 mt-0"
              textClassName="text-primary font-bold "
              textStyle={{ fontSize: getResponsiveFontSize("xs") }}
            />
            {/* Item Name & Variations */}
            <View className="flex-1">
              <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-semibold text-neutral ">
                {dishName}
              </Text>
              {variations.length > 0 ? (
                <View className="flex-row flex-wrap gap-1.5 mt-2">
                  {variations.map((v: any, vIdx: number) => {
                    const varName = v.variation?.name || v.name || v.title || "";
                    if (!varName) return null;
                    return (
                      <Badge
                        key={v.id || vIdx}
                        text={varName}
                        containerClassName="bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg"
                        textClassName="text-neutral font-semibold"
                        textStyle={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                      />
                    );
                  })}
                </View>
              ) : null}
            </View>
          </View>
        );
      })}

      {/* Expand / Collapse Button */}
      {hasMoreItems && (
        <TouchableOpacity
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
          className="flex-row items-center gap-1 mt-1.5 self-start"
        >
          <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-primary">
            {isExpanded ? "Collapse Items" : `Expand Items (${allItems.length - 3} More)`}
          </Text>
          <MaterialIcons
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
            size={WP("4.5%")}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}
