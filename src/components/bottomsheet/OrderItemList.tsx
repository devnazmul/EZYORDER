import ItemsSummarySkeleton from "@/features/driver/components/skeletons/ItemsSummarySkeleton";
import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface OrderItemListProps {
  items: any[];
  isLoading?: boolean;
  currencySymbol: string;
  title?: string;
  containerClassName?: string;
}

export default function OrderItemList({
  items = [],
  isLoading = false,
  currencySymbol,
  title = "Order Items",
  containerClassName = "",
}: OrderItemListProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string | number, boolean>>({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const toggleVariations = (itemId: string | number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleToggleAll = () => {
    const nextState = !isAllExpanded;
    setIsAllExpanded(nextState);
    const updated: Record<string | number, boolean> = {};
    items.forEach((item: any, idx: number) => {
      updated[item.id || idx] = nextState;
    });
    setExpandedItems(updated);
  };

  return (
    <View className={`gap-y-2 mt-4 ${containerClassName}`}>
      <View className="flex-row justify-between items-center">
        <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
          {title}
        </Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleToggleAll} activeOpacity={0.7}>
            <Text className="text-[10px] font-bold text-primary">
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-0">
        {isLoading ? (
          <ItemsSummarySkeleton />
        ) : items.length === 0 ? (
          <View key="items-empty" className="py-3 items-center justify-center">
            <Text className="text-xs text-accent italic">No items found for this order.</Text>
          </View>
        ) : (
          <View key="items-list">
            {items.map((item: any, index: number) => {
              const dishName = item.dish?.name || item.meal?.name || item.dish_name || "Item";
              const dishDesc = item.dish?.description || item.description || "";
              const qty = item.qty || item.quantity || 1;
              const rawPrice = item.dish?.price || item.dish_price || item.main_price || item.price || 0;
              const price = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
              const variations = item.variations || item.options || [];

              return (
                <View
                  key={item.id || index}
                  className={`py-3 ${index < items.length - 1 ? "border-b border-base-200" : ""}`}
                >
                  <View className="flex-row justify-between items-start">
                    <View className="flex-row items-start gap-2.5 flex-1 pr-2">
                      <View className="bg-primary/10 border border-primary/20 min-w-[28px] h-7 px-1.5 rounded-lg items-center justify-center mt-0.5">
                        <Text className="text-xs font-semibold text-primary">{qty}x</Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-bold text-neutral leading-5">{dishName}</Text>
                        {dishDesc ? (
                          <Text className="text-[10px] text-accent italic mt-0.5" numberOfLines={2}>
                            {dishDesc}
                          </Text>
                        ) : null}
                        <Text className="text-[10px] font-medium text-accent mt-0.5">
                          {formatAmount(price, currencySymbol)} each
                        </Text>
                      </View>
                    </View>

                    <Text className="text-xs font-bold text-neutral">
                      {formatAmount(qty * price, currencySymbol)}
                    </Text>
                  </View>

                  {/* Expandable Variations Section */}
                  {variations.length > 0 && (
                    <View className="mt-1.5 ml-9">
                      <TouchableOpacity
                        onPress={() => toggleVariations(item.id || index)}
                        activeOpacity={0.7}
                        className="flex-row items-center gap-1 py-0.5"
                      >
                        <Text className="text-[10px] font-bold text-primary">
                          {expandedItems[item.id || index]
                            ? "Hide variations"
                            : `See variations (${variations.length})`}
                        </Text>
                        <MaterialIcons
                          name={
                            expandedItems[item.id || index] ? "keyboard-arrow-up" : "keyboard-arrow-down"
                          }
                          size={14}
                          color="#DC2D2A"
                        />
                      </TouchableOpacity>

                      {expandedItems[item.id || index] && (
                        <View className="flex-row flex-wrap gap-1.5 mt-2">
                          {variations.map((v: any, vIdx: number) => {
                            const varName = v.variation?.name || v.name || v.title || "";
                            if (!varName) return null;
                            const varPrice = parseFloat(v.variation?.price || v.price || "0");
                            const varPriceText =
                              varPrice > 0 ? ` (+${formatAmount(varPrice, currencySymbol)})` : "";

                            return (
                              <View
                                key={v.id || vIdx}
                                className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg"
                              >
                                <Text className="text-[10px] font-semibold text-neutral">
                                  {varName}
                                  {varPriceText}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
