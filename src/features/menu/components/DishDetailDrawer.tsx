import Badge from "@/components/reuseable/Badge";
import BottomSheet from "@/components/reuseable/BottomSheet";
import ENV from "@/config/env";
import COLORS from "@/constants/colors";
import { useData } from "@/src/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { getOrderTypeColor } from "@/utils/orderTypeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  if (!dish) return null;

  const isDeal = Array.isArray(dish?.deal) && dish.deal.length > 0;
  const imageUri = resolveImageUrl(dish?.image);

  const hasDiscount = (val: any) => val && parseFloat(String(val)) > 0;

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["80%"]}>
      <View className="flex-1 px-5 py-4 gap-y-3">
        {/* Header */}
        <View className="pb-3 border-b border-base-200">
          <Text
            style={{ fontSize: getResponsiveFontSize("sm") }}
            className="font-bold text-neutral capitalize tracking-tight truncate"
          >
            {isDeal ? "Deal Details" : "Dish Details"}
          </Text>
        </View>

        {/* Scrollable Body */}

        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: HP("4%") }}
          className="gap-y-4"
        >
          {/* 1. Dish Image banner */}
          {imageUri && (
            <View className="w-full h-44 rounded-xl overflow-hidden mb-3 bg-base-200">
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            </View>
          )}

          {/* Name and description */}
          <View className="mb-4">
            <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
              {dish.name}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent mt-1 leading-relaxed"
            >
              {dish.description || "No description provided."}
            </Text>
          </View>

          {/* Quick Info Chips */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {!!dish.calories && (
              <View className="flex-row items-center bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full gap-1">
                <MaterialIcons name="local-fire-department" size={WP("3.5%")} color="#ea580c" />
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                  className="font-semibold text-orange-700"
                >
                  {dish.calories} cal
                </Text>
              </View>
            )}
            {!!dish.preparation_time && (
              <View className="flex-row items-center bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full gap-1">
                <MaterialIcons name="timer" size={WP("3.5%")} color="#2563eb" />
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                  className="font-semibold text-blue-700"
                >
                  {dish.preparation_time} min
                </Text>
              </View>
            )}
            {!!dish.ingredients && (
              <View className="flex-row items-center bg-green-50 border border-green-200 px-2.5 py-1 rounded-full gap-1">
                <MaterialIcons name="eco" size={WP("3.5%")} color="#16a34a" />
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                  className="font-semibold text-green-700"
                >
                  {dish.ingredients}
                </Text>
              </View>
            )}
          </View>

          {/* 2. Pricing Section */}
          <View className="mb-4">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-accent capitalize tracking-wider mb-3"
            >
              Pricing Tiers
            </Text>
            <View className="flex-row gap-3">
              {[
                {
                  key: "eat_in",
                  label: "Eat In",
                  price: dish.price,
                  discount: dish.eat_in_discounted_price,
                  icon: "restaurant",
                },
                {
                  key: "take_away",
                  label: "Take Away",
                  price: dish.take_away,
                  discount: dish.take_away_discounted_price,
                  icon: "shopping-bag",
                },
                {
                  key: "delivery",
                  label: "Delivery",
                  price: dish.delivery,
                  discount: dish.delivery_discounted_price,
                  icon: "delivery-dining",
                },
              ].map((tier, idx) => {
                if (tier.price === undefined || tier.price === null) return null;
                const baseColor = getOrderTypeColor(tier.key);
                const lightColor = `${baseColor}15`;
                return (
                  <LinearGradient
                    key={idx}
                    colors={[lightColor, `${baseColor}05`]}
                    style={{
                      padding: WP("3%"),
                      flex: 1,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: `${baseColor}30`,
                    }}
                    className="items-center justify-center"
                  >
                    <MaterialIcons
                      name={tier.icon as any}
                      size={WP("5%")}
                      color={baseColor}
                      className="mb-1"
                    />
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") - 1, color: baseColor }}
                      className="font-semibold capitalize tracking-wider mb-1"
                    >
                      {tier.label}
                    </Text>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") + 1 }}
                      className="font-bold text-neutral"
                    >
                      {formatAmount(tier.price, currencySymbol)}
                    </Text>
                    {hasDiscount(tier.discount) && (
                      <Text
                        style={{ fontSize: getResponsiveFontSize("xs") - 2 }}
                        className="font-semibold text-success mt-0.5"
                      >
                        Disc: {formatAmount(tier.discount, currencySymbol)}
                      </Text>
                    )}
                  </LinearGradient>
                );
              })}
            </View>
          </View>

          {/* 3. Linked Dishes (If Deal) */}
          {isDeal && (
            <View className="mb-4">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-bold text-accent capitalize tracking-wider mb-3"
              >
                Included Deal Options ({dish.deal.length})
              </Text>
              <View className="bg-base-100 border border-base-200 rounded-xl p-3 gap-y-2">
                {dish.deal.map((de: any, i: number) => (
                  <View
                    key={de.id || i}
                    className="flex-row items-center justify-between py-1 border-b border-base-200/50 last:border-0"
                  >
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-semibold text-neutral flex-1 pr-2"
                    >
                      {i + 1}. {de?.dish?.name || "Dish Item"}
                    </Text>
                    {!!de?.dish?.price && (
                      <Text
                        style={{ fontSize: getResponsiveFontSize("xs") }}
                        className="text-primary font-semibold"
                      >
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
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-bold text-accent capitalize tracking-wider mb-3"
              >
                Dish Customizations ({dish.dish_variations.length})
              </Text>
              <View className="gap-y-3">
                {dish.dish_variations.map((dv: any) => {
                  const groupName = dv.variation_type?.name || "Option Group";
                  const optionsList = Array.isArray(dv.variation_type?.variation)
                    ? dv.variation_type.variation
                    : [];
                  const isExpanded = !!expandedGroups[dv.id];

                  return (
                    <View
                      key={dv.id}
                      className="bg-base-100 border border-base-200 rounded-xl overflow-hidden"
                    >
                      {/* Option Header */}
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => toggleGroup(dv.id)}
                        style={{ paddingVertical: HP("1.2%"), paddingHorizontal: WP("3%") }}
                        className="bg-base-200/50 border-b border-base-200/50 flex-row justify-between items-center"
                      >
                        <Text
                          style={{ fontSize: getResponsiveFontSize("xs") }}
                          className="font-bold text-neutral truncate flex-1 pr-2 capitalize"
                        >
                          {groupName}
                        </Text>
                        <View className="flex-row items-center gap-1.5">
                          <Badge
                            text={`Min: ${dv.minimum_variation_required}`}
                            containerClassName="bg-info/10 border rounded-full"
                            containerStyle={{ borderColor: COLORS.info }}
                            textClassName="text-info capitalize"
                            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
                          />
                          <Badge
                            text={`Max: ${dv.no_of_varation_allowed}`}
                            containerClassName="bg-info/10 border  rounded-full"
                            containerStyle={{ borderColor: COLORS.info }}
                            textClassName="text-info capitalize"
                            textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
                          />
                          <MaterialIcons
                            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                            size={WP("4%")}
                            color={COLORS.accent}
                          />
                        </View>
                      </TouchableOpacity>

                      {isExpanded && (
                        <View className="p-3 flex-row flex-wrap gap-2">
                          {optionsList.length > 0 ? (
                            optionsList.map((v: any) => {
                              const extraPriceText =
                                parseFloat(v.price) > 0 ? ` +${formatAmount(v.price, currencySymbol)}` : "";
                              return (
                                <Badge
                                  key={v.id}
                                  text={`${v.name}${extraPriceText}`}
                                  containerClassName="bg-primary/10 border border-primary/20 rounded-full"
                                  textClassName="text-primary capitalize"
                                  textStyle={{ fontSize: getResponsiveFontSize("xs") }}
                                />
                              );
                            })
                          ) : (
                            <Text
                              style={{ fontSize: getResponsiveFontSize("xs") }}
                              className="text-accent italic capitalize"
                            >
                              No options defined
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* 5. Dish Time Slots (if time-based) */}
          {Number(dish.is_time_based) === 1 &&
            Array.isArray(dish.time_slots) &&
            dish.time_slots.length > 0 && (
              <View className="mb-4">
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-bold text-accent capitalize tracking-wider mb-3"
                >
                  Dish Specific Time Limits
                </Text>
                <View className="gap-y-2">
                  {dish.time_slots.map((slot: any, idx: number) => {
                    const slotActive = Number(slot.is_active) === 1;
                    return (
                      <View
                        key={idx}
                        className="flex-row justify-between items-center bg-base-100 border border-base-200 p-2.5 rounded-xl"
                      >
                        <Text
                          style={{ fontSize: getResponsiveFontSize("xs") }}
                          className="font-bold text-neutral capitalize"
                        >
                          {slot.day_of_week} Days Of Week
                        </Text>
                        <Text
                          style={{ fontSize: getResponsiveFontSize("xs") }}
                          className={`font-bold ${slotActive ? "text-primary" : "text-accent/55"}`}
                        >
                          {formatTime(slot.start_time)} — {formatTime(slot.end_time)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
        </BottomSheetScrollView>
      </View>
    </BottomSheet>
  );
}
