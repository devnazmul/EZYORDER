import { useAuth } from "@/context/AuthContext";
import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useOrderDetailQuery } from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";
import ItemsSummarySkeleton from "./skeletons/ItemsSummarySkeleton";

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
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const isFirstRender = useRef(true);
  const isOpenRef = useRef(false);

  const snapPoints = useMemo(() => ["50%", "85%"], []);

  const { token } = useAuth();
  const { data: fullOrderDetail, isLoading: isLoadingDetails } = useOrderDetailQuery(
    token || "",
    order?.id || "",
    visible,
  );

  const parsePrice = (val: any) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleClose = () => {
    bottomSheetRef.current?.dismiss();
  };

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.6} />
    ),
    [],
  );

  const handleDismiss = useCallback(() => {
    isOpenRef.current = false;
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!visible) return;
    }

    if (visible) {
      if (!isOpenRef.current) {
        isOpenRef.current = true;
        const timer = setTimeout(() => {
          bottomSheetRef.current?.present();
        }, 50);
        return () => clearTimeout(timer);
      }
    } else {
      if (isOpenRef.current) {
        isOpenRef.current = false;
        bottomSheetRef.current?.dismiss();
      }
    }
  }, [visible]);

  if (!order) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: "#E2E8F0", width: 48 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center border-b border-base-200 pb-3 px-6 pt-2">
        <View className="gap-y-1">
          <Text className="text-lg font-bold text-neutral">Order #{order.id}</Text>
          <Text className="text-xs text-accent">
            Status: <Text className="font-bold uppercase text-primary">{order.status}</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          className="w-8 h-8 rounded-full bg-base-100 items-center justify-center"
        >
          <MaterialIcons name="close" size={18} color="#6E6E6E" />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Customer Information */}
        <View className="gap-y-2">
          <Text className="text-xs font-bold text-accent uppercase tracking-wider">Customer Details</Text>
          <View className="bg-base-100 rounded-xl p-4 gap-y-2 border border-base-200">
            <View className="flex-row justify-between">
              <Text className="text-xs text-accent">Name:</Text>
              <Text className="text-xs font-bold text-neutral">{order.customer_name || "N/A"}</Text>
            </View>

            {order.customer_phone && order.customer_phone !== "N/A" ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Phone:</Text>
                <Text className="text-xs font-bold text-neutral">{order.customer_phone}</Text>
              </View>
            ) : null}

            {order.customer_note ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Customer Note:</Text>
                <Text className="text-xs font-bold text-neutral italic">"{order.customer_note}"</Text>
              </View>
            ) : null}

            <View className="flex-row justify-between items-start">
              <Text className="text-xs text-accent">Delivery Address:</Text>
              <Text className="text-xs font-bold text-neutral text-right flex-1 ml-4" numberOfLines={3}>
                {order.door_no ? `${order.door_no}, ` : ""}
                {order.customer_address}
                {order.customer_post_code ? ` — ${order.customer_post_code}` : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* Order Items Section */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-accent uppercase tracking-wider">Order Items</Text>
          <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-0">
            {isLoadingDetails ? (
              <ItemsSummarySkeleton />
            ) : (
              (() => {
                const detailItems = fullOrderDetail?.detail || fullOrderDetail?.details || [];
                if (detailItems.length === 0) {
                  return (
                    <View key="items-empty" className="py-2">
                      <Text className="text-xs text-accent text-center italic">
                        No items found for this order.
                      </Text>
                    </View>
                  );
                }

                return (
                  <View key="items-list">
                    {detailItems.map((item: any, index: number) => {
                      const dishName = item.dish?.name || item.meal?.name || item.dish_name || "Item";
                      const qty = item.qty || item.quantity || 1;
                      const price = parsePrice(
                        item.dish?.price || item.dish_price || item.main_price || item.price,
                      );

                      return (
                        <View
                          key={item.id || index}
                          className={`flex-row justify-between items-center py-2.5 ${
                            index < detailItems.length - 1 ? "border-b border-base-200" : ""
                          }`}
                        >
                          <View className="flex-row items-center gap-2 flex-1">
                            <View className="bg-primary/10 w-6 h-6 rounded-md items-center justify-center">
                              <Text className="text-[10px] font-black text-primary">{qty}x</Text>
                            </View>
                            <View className="flex-1">
                              <Text className="text-xs font-semibold text-neutral" numberOfLines={1}>
                                {dishName}
                              </Text>
                              <Text className="text-[10px] text-accent mt-0.5">
                                {formatAmount(price, currencySymbol)} each
                              </Text>
                              {item.variations && item.variations.length > 0 ? (
                                <Text
                                  className="text-[9px] text-secondary font-semibold mt-0.5"
                                  numberOfLines={1}
                                >
                                  {item.variations
                                    .map((v: any) => v.variation?.name || v.name || "")
                                    .filter(Boolean)
                                    .join(", ")}
                                </Text>
                              ) : null}
                            </View>
                          </View>
                          <Text className="text-xs font-bold text-neutral ml-2">
                            {formatAmount(qty * price, currencySymbol)}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                );
              })()
            )}
          </View>
        </View>

        {/* Instructions Section */}
        {order.initial_note ? (
          <View className="gap-y-2 mt-4">
            <Text className="text-xs font-bold text-accent uppercase tracking-wider">Instructions</Text>
            <View className="bg-base-100 rounded-xl p-4 border border-base-200">
              <Text className="text-xs text-neutral/70 italic font-medium leading-4">
                {order.initial_note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Bill Summary Section */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-accent uppercase tracking-wider">Bill Summary</Text>
          <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-accent">Payment Status:</Text>
              <Text className="text-xs font-semibold text-neutral uppercase">
                {order.payment_status || "Unpaid"}
              </Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-xs text-accent">Payment Method:</Text>
              <Text className="text-xs font-semibold text-neutral uppercase">
                {order.payment_method || "N/A"}
              </Text>
            </View>

            <View className="border-t border-base-200 pt-2 mt-1 flex-row justify-between items-center">
              <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
              <Text className="text-md font-bold text-neutral">
                {formatAmount(parseFloat(order.amount || order.total_due_amount || "0"), currencySymbol)}
              </Text>
            </View>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
