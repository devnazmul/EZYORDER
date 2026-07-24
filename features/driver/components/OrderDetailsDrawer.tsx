import Badge from "@/components/reuseable/Badge";
import BottomSheet from "@/components/reuseable/BottomSheet";
import { useAuth } from "@/context/AuthContext";
import { formatLabel } from "@/utils/formatLabel";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getStatusBadgeConfig } from "@/utils/getStatusBadgeConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { useOrderDetailQuery } from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";
import ItemsSummarySkeleton from "./skeletons/ItemsSummarySkeleton";
import PickupDetailsSkeleton from "./skeletons/PickupDetailsSkeleton";

interface OrderDetailsDrawerProps {
  order: DriverOrder | null;
  visible: boolean;
  onClose: () => void;
  currencySymbol: string;
}

export default function OrderDetailsDrawer({
  order,
  visible,
  onClose,
  currencySymbol,
}: OrderDetailsDrawerProps) {
  const { token } = useAuth();
  const [expandedItems, setExpandedItems] = useState<Record<string | number, boolean>>({});
  const [isAllExpanded, setIsAllExpanded] = useState(false);

  const { data: fullOrderDetail, isLoading: isLoadingDetails } = useOrderDetailQuery(
    token || "",
    order?.id || "",
    visible,
  );

  if (!order) return null;

  const toggleVariations = (itemId: string | number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const handleCallPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleOpenMaps = (address: string, lat?: string | null, lng?: string | null) => {
    let url = "";
    if (lat && lng) {
      url =
        Platform.select({
          ios: `maps:0,0?q=${lat},${lng}`,
          android: `geo:0,0?q=${lat},${lng}`,
        }) || `https://maps.google.com/?q=${lat},${lng}`;
    } else {
      const encoded = encodeURIComponent(address);
      url =
        Platform.select({
          ios: `maps:0,0?q=${encoded}`,
          android: `geo:0,0?q=${encoded}`,
        }) || `https://maps.google.com/?q=${encoded}`;
    }
    Linking.openURL(url).catch(() => {});
  };

  const detailItems = fullOrderDetail?.detail || fullOrderDetail?.details || [];
  const restaurant = fullOrderDetail?.restaurant;
  const statusConfig = getStatusBadgeConfig(order.status || "pending");
  const payConfig = getStatusBadgeConfig(order.payment_status || "unpaid");

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "75%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center border-b border-base-200 pb-3 px-6 pt-2">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center">
            <MaterialIcons name="receipt-long" size={20} color="#DC2D2A" />
          </View>
          <View>
            <Text className="text-base font-bold text-neutral">Order #{order.id}</Text>
            <Text className="text-[11px] text-accent font-medium mt-0.5">
              Assigned Delivery Details
            </Text>
          </View>
        </View>

        <Badge
          text={formatLabel(order.status) || "Pending"}
          icon={<MaterialIcons name={statusConfig.iconName} size={12} color={statusConfig.iconColor} />}
          iconPosition="left"
          containerClassName={statusConfig.containerClass}
          textClassName={statusConfig.textClass}
        />
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Restaurant Pickup Section */}
        {isLoadingDetails ? (
          <PickupDetailsSkeleton />
        ) : restaurant ? (
          <View key="pickup-loaded" className="gap-y-2 mb-4">
            <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
              Pickup Details
            </Text>
            <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="storefront" size={16} color="#DC2D2A" />
                  <Text className="text-xs text-accent">Restaurant:</Text>
                </View>
                <Text className="text-xs font-bold text-neutral">{restaurant.Name}</Text>
              </View>

              {fullOrderDetail?.created_at || order?.created_at ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="schedule" size={16} color="#DC2D2A" />
                    <Text className="text-xs text-accent">Placed On:</Text>
                  </View>
                  <Text className="text-xs font-bold text-neutral">
                    {formatDateTime(fullOrderDetail?.created_at || order?.created_at)}
                  </Text>
                </View>
              ) : null}

              {restaurant.PhoneNumber ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="phone" size={16} color="#DC2D2A" />
                    <Text className="text-xs text-accent">Phone:</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleCallPhone(restaurant.PhoneNumber!)}
                    activeOpacity={0.7}
                    className="flex-row items-center"
                  >
                    <Text className="text-xs text-primary font-medium">(</Text>
                    <MaterialIcons
                      name="phone"
                      size={11}
                      color="#DC2D2A"
                      style={{ transform: [{ rotate: "10deg" }], marginHorizontal: -1 }}
                    />
                    <Text className="text-xs text-primary font-medium">) </Text>
                    <Text className="text-xs text-primary font-medium">{restaurant.PhoneNumber}</Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {restaurant.Address ? (
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
                    <Text className="text-xs text-accent">Address:</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleOpenMaps(
                        `${restaurant.Address} ${restaurant.PostCode || ""}`,
                        restaurant.latitude,
                        restaurant.longitude,
                      )
                    }
                    activeOpacity={0.7}
                    className="flex-1 ml-4"
                  >
                    <Text className="text-xs font-semibold text-primary text-right" numberOfLines={3}>
                      {restaurant.Address}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Customer Information Section */}
        <View className="gap-y-2">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
            Customer Details
          </Text>
          <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="person-outline" size={16} color="#DC2D2A" />
                <Text className="text-xs text-accent">Name:</Text>
              </View>
              <Text className="text-xs font-bold text-neutral">{order.customer_name || "N/A"}</Text>
            </View>

            {order.customer_phone && order.customer_phone !== "N/A" ? (
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="phone" size={16} color="#DC2D2A" />
                  <Text className="text-xs text-accent">Phone:</Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleCallPhone(order.customer_phone!)}
                  activeOpacity={0.7}
                  className="flex-row items-center"
                >
                  <Text className="text-xs text-primary font-medium">(</Text>
                  <MaterialIcons
                    name="phone"
                    size={11}
                    color="#DC2D2A"
                    style={{ transform: [{ rotate: "10deg" }], marginHorizontal: -1 }}
                  />
                  <Text className="text-xs text-primary font-medium">) </Text>
                  <Text className="text-xs text-primary font-medium">{order.customer_phone}</Text>
                </TouchableOpacity>
              </View>
            ) : null}

            {order.customer_note ? (
              <View className="flex-row items-start justify-between">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="chat-bubble-outline" size={16} color="#DC2D2A" />
                  <Text className="text-xs text-accent">Customer Note:</Text>
                </View>
                <Text className="text-xs font-semibold text-neutral italic max-w-[60%] text-right">
                  "{order.customer_note}"
                </Text>
              </View>
            ) : null}

            <View className="flex-row items-start justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
                <Text className="text-xs text-accent">Address:</Text>
              </View>
              <TouchableOpacity
                onPress={() =>
                  handleOpenMaps(
                    `${order.customer_address} ${order.customer_post_code || ""}`,
                    order.latitude,
                    order.longitude,
                  )
                }
                activeOpacity={0.7}
                className="flex-1 ml-4"
              >
                <Text className="text-xs font-semibold text-primary text-right" numberOfLines={3}>
                  {order.door_no ? `${order.door_no}, ` : ""}
                  {order.customer_address}
                  {order.customer_post_code ? ` — ${order.customer_post_code}` : ""}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Instructions Section */}
        {order.initial_note ? (
          <View className="gap-y-2 mt-4">
            <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Instructions</Text>
            <View className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 flex-row items-start gap-2.5">
              <MaterialIcons name="assignment-late" size={18} color="#DC2D2A" />
              <Text className="text-xs text-neutral italic font-semibold leading-5 flex-1">
                {order.initial_note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Order Items Section */}
        <View className="gap-y-2 mt-4">
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
              Order Items
            </Text>
            {detailItems.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  const nextState = !isAllExpanded;
                  setIsAllExpanded(nextState);
                  const updated: Record<string | number, boolean> = {};
                  detailItems.forEach((item: any, idx: number) => {
                    updated[item.id || idx] = nextState;
                  });
                  setExpandedItems(updated);
                }}
                activeOpacity={0.7}
              >
                <Text className="text-[10px] font-bold text-primary">
                  {isAllExpanded ? "Collapse All" : "Expand All"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-0">
            {isLoadingDetails ? (
              <ItemsSummarySkeleton />
            ) : detailItems.length === 0 ? (
              <View key="items-empty" className="py-3 items-center justify-center">
                <Text className="text-xs text-accent italic">No items found for this order.</Text>
              </View>
            ) : (
              <View key="items-list">
                {detailItems.map((item: any, index: number) => {
                  const dishName = item.dish?.name || item.meal?.name || item.dish_name || "Item";
                  const dishDesc = item.dish?.description || item.description || "";
                  const qty = item.qty || item.quantity || 1;
                  const rawPrice = item.dish?.price || item.dish_price || item.main_price || item.price || 0;
                  const price = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;
                  const variations = item.variations || item.options || [];

                  return (
                    <View
                      key={item.id || index}
                      className={`py-3 ${index < detailItems.length - 1 ? "border-b border-base-200" : ""}`}
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

                        <Text className="text-xs font-semibold text-neutral">
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
                                const varPriceText = varPrice > 0 ? ` (+${formatAmount(varPrice, currencySymbol)})` : "";

                                return (
                                  <View
                                    key={v.id || vIdx}
                                    className="bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg"
                                  >
                                    <Text className="text-[10px] font-semibold text-neutral">
                                      {varName}{varPriceText}
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

        {/* Bill Summary Section */}
        <View className="gap-y-2 mt-4 mb-2">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Bill Summary</Text>
          <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-2.5">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-accent">Payment Status:</Text>
              <Badge
                text={formatLabel(order.payment_status) || "Unpaid"}
                icon={<MaterialIcons name={payConfig.iconName} size={12} color={payConfig.iconColor} />}
                iconPosition="left"
                containerClassName={payConfig.containerClass}
                textClassName={payConfig.textClass}
              />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-accent">Payment Method:</Text>
              <Badge
                text={
                  order.payment_method
                    ? order.payment_method.toLowerCase() === "cod"
                      ? "COD"
                      : formatLabel(order.payment_method)
                    : "N/A"
                }
                containerClassName="bg-secondary/10 border border-secondary/25"
                textClassName="text-neutral font-semibold"
              />
            </View>

            <View className="border-t border-base-200 pt-2.5 mt-1 flex-row justify-between items-center">
              <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
              <Text className="text-base font-bold text-neutral">
                {formatAmount(parseFloat(order.amount || order.total_due_amount || "0"), currencySymbol)}
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
