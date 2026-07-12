import React, { useMemo } from "react";
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { formatAmount } from "@/utils/formatters";
import { useData } from "@/context/context/DataContext";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import ENV from "@/config/env";

interface DishDetailDrawerProps {
  visible: boolean;
  onClose: () => void;
  dish: any;
}

const resolveImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const mediaBase = ENV.API_BASE_URL.replace("/api", "");
  return `${mediaBase}/${path}`;
};

const formatTime = (timeStr?: string) => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${String(hours).padStart(2, "0")}:${minutes} ${ampm}`;
};

export default function DishDetailDrawer({ visible, onClose, dish }: DishDetailDrawerProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  if (!dish) return null;

  const isDeal = Array.isArray(dish?.deal) && dish.deal.length > 0;
  const imageUri = resolveImageUrl(dish?.image);

  const hasDiscount = (val: any) => val && parseFloat(String(val)) > 0;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View key="drawer-overlay" className="flex-1 justify-end bg-neutral/55">
        <View key="drawer-container" className="bg-base-300 border-t border-base-200 rounded-t-3xl w-full p-6 shadow-2xl relative overflow-hidden gap-y-4 max-h-[85%]">
          
          {/* Header */}
          <View className="flex-row justify-between items-center border-b border-base-200 pb-3">
            <View className="gap-y-1 flex-1 pr-2">
              <Text className="text-base font-black text-neutral uppercase tracking-tight truncate">
                {isDeal ? "Deal Details" : "Dish Details"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-base-100 active:bg-base-200 flex-shrink-0">
              <MaterialIcons name="close" size={20} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          {/* Scrollable Body */}
          <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
            
            {/* 1. Dish Image banner */}
            {imageUri && (
              <View className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-base-200">
                <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              </View>
            )}

            {/* Name and description */}
            <View className="mb-4">
              <Text className="text-md font-bold text-neutral">{dish.name}</Text>
              <Text className="text-xs text-accent mt-1 leading-relaxed">
                {dish.description || "No description provided."}
              </Text>
            </View>

            {/* Quick Info Chips */}
            <View className="flex-row flex-wrap gap-2 mb-4">
              {!!dish.calories && (
                <View className="flex-row items-center bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full gap-1">
                  <MaterialIcons name="local-fire-department" size={12} color="#ea580c" />
                  <Text className="text-[10px] font-bold text-orange-700">{dish.calories} cal</Text>
                </View>
              )}
              {!!dish.preparation_time && (
                <View className="flex-row items-center bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full gap-1">
                  <MaterialIcons name="timer" size={12} color="#2563eb" />
                  <Text className="text-[10px] font-bold text-blue-700">{dish.preparation_time} min</Text>
                </View>
              )}
              {!!dish.ingredients && (
                <View className="flex-row items-center bg-green-50 border border-green-200 px-2.5 py-1 rounded-full gap-1">
                  <MaterialIcons name="eco" size={12} color="#16a34a" />
                  <Text className="text-[10px] font-bold text-green-700">{dish.ingredients}</Text>
                </View>
              )}
            </View>

            {/* 2. Pricing Section */}
            <View className="mb-4">
              <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                Pricing Tiers
              </Text>
              <View className="flex-row gap-3">
                {[
                  {
                    label: "Eat In",
                    price: dish.price,
                    discount: dish.eat_in_discounted_price,
                  },
                  {
                    label: "Take Away",
                    price: dish.take_away,
                    discount: dish.take_away_discounted_price,
                  },
                  {
                    label: "Delivery",
                    price: dish.delivery,
                    discount: dish.delivery_discounted_price,
                  },
                ].map((tier, idx) => {
                  if (tier.price === undefined || tier.price === null) return null;
                  return (
                    <View key={idx} className="flex-1 bg-base-100 border border-base-200 rounded-xl p-2.5 items-center justify-center">
                      <Text className="text-[8px] font-bold text-accent uppercase tracking-wider block mb-1">
                        {tier.label}
                      </Text>
                      <Text className="text-sm font-black text-neutral">
                        {formatAmount(tier.price, currencySymbol)}
                      </Text>
                      {hasDiscount(tier.discount) && (
                        <Text className="text-[9px] font-bold text-green-600 mt-0.5">
                          Disc: {formatAmount(tier.discount, currencySymbol)}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            {/* 3. Linked Dishes (If Deal) */}
            {isDeal && (
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                  Included Deal Options ({dish.deal.length})
                </Text>
                <View className="bg-base-100 border border-base-200 rounded-xl p-3 gap-y-2">
                  {dish.deal.map((de: any, i: number) => (
                    <View key={de.id || i} className="flex-row items-center justify-between py-1 border-b border-base-200/50 last:border-0">
                      <Text className="text-xs font-semibold text-neutral flex-1 pr-2">
                        {i + 1}. {de?.dish?.name || "Dish Item"}
                      </Text>
                      {!!de?.dish?.price && (
                        <Text className="text-xs text-accent">
                          {formatAmount(de?.dish?.price, currencySymbol)}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* 4. Dish Options / Variations */}
            {Array.isArray(dish.dish_variations) && dish.dish_variations.length > 0 && (
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                  Dish Customizations ({dish.dish_variations.length})
                </Text>
                <View className="gap-y-3">
                  {dish.dish_variations.map((dv: any) => {
                    const groupName = dv.variation_type?.name || "Option Group";
                    const optionsList = Array.isArray(dv.variation_type?.variation)
                      ? dv.variation_type.variation
                      : [];

                    return (
                      <View key={dv.id} className="bg-base-100 border border-base-200 rounded-xl overflow-hidden">
                        {/* Option Header */}
                        <View className="px-3 py-2 bg-base-200/50 border-b border-base-200/50 flex-row justify-between items-center">
                          <Text className="text-xs font-bold text-neutral truncate flex-1 pr-2">{groupName}</Text>
                          <View className="flex-row gap-1">
                            <View className="bg-base-300 px-1.5 py-0.5 rounded">
                              <Text className="text-[8px] font-bold text-accent">Min: {dv.minimum_variation_required}</Text>
                            </View>
                            <View className="bg-base-300 px-1.5 py-0.5 rounded">
                              <Text className="text-[8px] font-bold text-accent">Max: {dv.no_of_varation_allowed}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Option Choices */}
                        <View className="p-3 flex-row flex-wrap gap-2">
                          {optionsList.length > 0 ? (
                            optionsList.map((v: any) => (
                              <View key={v.id} className="flex-row items-center bg-base-300 border border-base-200 px-2.5 py-1.5 rounded-lg gap-1.5">
                                <Text className="text-xs font-semibold text-neutral">{v.name}</Text>
                                {parseFloat(v.price) > 0 && (
                                  <Text className="text-xs font-bold text-primary">
                                    +{formatAmount(v.price, currencySymbol)}
                                  </Text>
                                )}
                              </View>
                            ))
                          ) : (
                            <Text className="text-xs text-accent italic">No options defined</Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 5. Dish Time Slots (if time-based) */}
            {Number(dish.is_time_based) === 1 && Array.isArray(dish.time_slots) && dish.time_slots.length > 0 && (
              <View className="mb-4">
                <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
                  Dish Specific Time Limits
                </Text>
                <View className="gap-y-2">
                  {dish.time_slots.map((slot: any, idx: number) => {
                    const slotActive = Number(slot.is_active) === 1;
                    return (
                      <View key={idx} className="flex-row justify-between items-center bg-base-100 border border-base-200 p-2.5 rounded-xl">
                        <Text className="text-xs font-bold text-neutral">
                          {slot.day_of_week} Days Of Week
                        </Text>
                        <Text className={`text-xs font-black ${slotActive ? "text-primary" : "text-accent/55"}`}>
                          {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Close Action Button */}
          <TouchableOpacity
            onPress={onClose}
            activeOpacity={0.8}
            className="w-full bg-primary py-3.5 rounded-xl items-center mt-2 active:opacity-90 shadow-sm"
          >
            <Text className="text-white text-xs font-bold uppercase tracking-wider">Close Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
