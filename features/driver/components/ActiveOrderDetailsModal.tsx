import Button from "@/components/reuseable/Button";
import { useAuth } from "@/context/AuthContext";
import { formatAmount } from "@/utils/formatters";
import formatUtcToLocalTime from "@/utils/formatUtcToLocalTime";
import { MaterialIcons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { UseMutationResult } from "@tanstack/react-query";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ItemsSummarySkeleton from "../components/skeletons/ItemsSummarySkeleton";
import { useOrderDetailQuery } from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";

interface ActiveOrderDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  activeOrder: DriverOrder;
  currencySymbol: string;
  paymentMethod: "Cash" | "Prepaid";
  totalAmount: number;
  collectedAmount: string;
  setCollectedAmount: (val: string) => void;
  deliveryNote: string;
  setDeliveryNote: (val: string) => void;
  isNoteExpanded: boolean;
  setIsNoteExpanded: (val: boolean) => void;
  updateStatusMutation: UseMutationResult<
    unknown,
    unknown,
    { orderId: string | number; formData: FormData },
    unknown
  >;
  handleConfirmPayment: () => void;
  handleDirectGps: () => void;
  handleGetRoute: () => void;
  handleQuickSMS: (msg: string) => void;
}

export default function ActiveOrderDetailsModal({
  visible,
  onClose,
  activeOrder,
  currencySymbol,
  paymentMethod,
  totalAmount,
  collectedAmount,
  setCollectedAmount,
  deliveryNote,
  setDeliveryNote,
  isNoteExpanded,
  setIsNoteExpanded,
  updateStatusMutation,
  handleConfirmPayment,
  handleDirectGps,
  handleGetRoute,
  handleQuickSMS,
}: ActiveOrderDetailsModalProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();
  const isFirstRender = useRef(true);
  const isOpenRef = useRef(false);

  const snapPoints = useMemo(() => ["45%", "85%"], []);

  const { token } = useAuth();
  const { data: fullOrderDetail, isLoading: isLoadingDetails } = useOrderDetailQuery(
    token || "",
    activeOrder?.id || "",
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

  if (!activeOrder) return null;

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      onDismiss={handleDismiss}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: "#F3F4F6", borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: "#E2E8F0", width: 48 }}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pb-3 pt-1 border-b border-neutral/5 mb-2">
        <Text className="text-xl font-bold text-neutral">Order #{activeOrder.id}</Text>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={activeOrder?.latitude && activeOrder?.longitude ? handleDirectGps : handleGetRoute}
            className="w-9 h-9 rounded-md bg-primary/80 items-center justify-center"
          >
            <MaterialIcons name="near-me" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (activeOrder?.customer_phone && activeOrder?.customer_phone !== "N/A") {
                Linking.openURL(`tel:${activeOrder.customer_phone}`).catch(() => {});
              }
            }}
            className="w-9 h-9 rounded-md bg-primary/80 items-center justify-center"
          >
            <MaterialIcons name="phone" size={18} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickSMS("I am on my way with your order.")}
            className="w-9 h-9 rounded-md bg-primary/80 items-center justify-center"
          >
            <MaterialIcons name="message" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Delivery Address Section */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
          <View className="flex-row items-center gap-1.5 mb-3">
            <MaterialIcons name="place" size={16} color="#DC2D2A" />
            <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">
              Delivery Address
            </Text>
          </View>

          <View className="flex-row items-center justify-between gap-3">
            <Text numberOfLines={3} className="text-xs text-slate-500 font-semibold flex-1 leading-4">
              {activeOrder?.door_no ? `${activeOrder.door_no}, ` : ""}
              {activeOrder?.customer_address}
              {activeOrder?.customer_post_code ? ` — ${activeOrder.customer_post_code}` : ""}
            </Text>

            {activeOrder?.latitude && activeOrder?.longitude ? (
              <TouchableOpacity
                key="gps-directions-btn"
                onPress={handleDirectGps}
                className="w-7 h-7 rounded-lg bg-emerald-100 items-center justify-center shrink-0"
              >
                <MaterialIcons name="directions" size={16} color="#36d399" />
              </TouchableOpacity>
            ) : null}
          </View>

          {activeOrder?.initial_note ? (
            <TouchableOpacity
              key="delivery-instructions-toggle"
              onPress={() => setIsNoteExpanded(!isNoteExpanded)}
              activeOpacity={0.7}
              className="mt-3 border-t border-slate-100 pt-2"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-[10px] font-semibold text-slate-400 capitalize tracking-wider">
                  Delivery instructions
                </Text>
                <MaterialIcons
                  name={isNoteExpanded ? "expand-less" : "expand-more"}
                  size={14}
                  color="#94a3b8"
                />
              </View>
              {isNoteExpanded && (
                <Text
                  key="delivery-instructions-text"
                  className="text-[10px] text-slate-500 py-2 leading-4 italic"
                >
                  {activeOrder.initial_note}
                </Text>
              )}
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Customer Details Section */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
          <View className="flex-row items-center gap-1.5 mb-3">
            <MaterialIcons name="person" size={16} color="#DC2D2A" />
            <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">
              Customer Details
            </Text>
          </View>

          <View>
            <Text className="text-sm font-bold text-neutral">{activeOrder?.customer_name || "N/A"}</Text>
            <Text className="text-xs text-neutral/60 font-semibold mt-1">
              {activeOrder?.customer_phone || "N/A"}
            </Text>
          </View>
        </View>

        {/* Items Summary Section */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
          <View className="flex-row items-center gap-1.5 mb-3">
            <MaterialIcons name="restaurant-menu" size={16} color="#DC2D2A" />
            <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">
              Items Summary
            </Text>
          </View>

          {isLoadingDetails ? (
            <ItemsSummarySkeleton />
          ) : (
            (() => {
              const detailItems = fullOrderDetail?.detail || fullOrderDetail?.details || [];
              if (detailItems.length === 0) {
                return (
                  <View key="items-empty" className="py-2">
                    <Text className="text-xs text-slate-400 font-semibold italic">
                      No items found for this order.
                    </Text>
                  </View>
                );
              }

              return (
                <View key="items-list" className="gap-2.5">
                  {detailItems.map((item: any, idx: number) => {
                    const title = item.dish?.name || item.meal?.name || item.dish_name || "Premium Item";
                    const qty = item.qty || item.quantity || 1;
                    const unitPrice = parsePrice(
                      item.dish?.price || item.dish_price || item.main_price || item.price,
                    );
                    const totalPrice = unitPrice * qty;

                    return (
                      <View
                        key={item.id || idx}
                        className="bg-slate-50/50 border border-slate-100 rounded-lg p-3"
                      >
                        <View className="flex-row justify-between items-start">
                          <Text className="text-xs font-bold text-slate-800 flex-1 pr-2">{title}</Text>
                          <Text className="text-xs font-bold text-slate-900 shrink-0">
                            {formatAmount(totalPrice, currencySymbol)}
                          </Text>
                        </View>
                        <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-slate-200/40">
                          <Text className="text-[10px] text-slate-400 font-bold">
                            Qty: {qty} × {formatAmount(unitPrice, currencySymbol)}
                          </Text>
                          {item.variations && item.variations.length > 0 && (
                            <View className="flex-row gap-1">
                              {item.variations.map((v: Record<string, any>, vIdx: any) => (
                                <View
                                  key={vIdx}
                                  className="px-1.5 py-0.5 bg-slate-200/60 rounded border border-slate-200"
                                >
                                  <Text className="text-[8px] font-bold text-slate-600">
                                    {v?.variation?.name}
                                  </Text>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })()
          )}
        </View>

        {/* Order Summary Section */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
          <View className="flex-row items-center gap-1.5 mb-3 border-b border-slate-50 pb-2">
            <MaterialIcons name="receipt" size={16} color="#DC2D2A" />
            <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">
              Order Summary
            </Text>
          </View>

          <View className="gap-2">
            {activeOrder.order_time || activeOrder.created_at ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400 font-semibold">Order Placed</Text>
                <Text className="text-xs text-slate-600 font-bold">
                  {formatUtcToLocalTime(activeOrder.order_time || activeOrder.created_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.accepted_at ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400 font-semibold">Accepted At</Text>
                <Text className="text-xs text-slate-600 font-bold">
                  {formatUtcToLocalTime(activeOrder.accepted_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.picked_up_at ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400 font-semibold">Picked Up At</Text>
                <Text className="text-xs text-slate-600 font-bold">
                  {formatUtcToLocalTime(activeOrder.picked_up_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.type ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400 font-semibold">Order Type</Text>
                <Text className="text-xs text-slate-600 font-bold capitalize">{activeOrder.type}</Text>
              </View>
            ) : null}

            {activeOrder.delivery_otp ? (
              <View className="flex-row justify-between items-center">
                <Text className="text-[10px] text-slate-400 font-semibold">OTP Code</Text>
                <Text className="text-xs text-emerald-600 font-black">{activeOrder.delivery_otp}</Text>
              </View>
            ) : null}

            {parseFloat(activeOrder.tip_amount || "0") > 0 ? (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[10px] text-slate-400 font-semibold">Driver Tip</Text>
                <Text className="text-xs text-emerald-600 font-bold">
                  {currencySymbol}
                  {parseFloat(activeOrder.tip_amount).toFixed(2)}
                </Text>
              </View>
            ) : null}

            {activeOrder.customer_note ? (
              <View className="mt-2 pt-2 border-t border-slate-100">
                <Text className="text-[10px] text-slate-400 font-semibold mb-1">Customer Note</Text>
                <Text className="text-xs text-slate-600 leading-4 italic bg-slate-50/50 p-2 rounded border border-slate-100">
                  {activeOrder.customer_note}
                </Text>
              </View>
            ) : null}

            {activeOrder.remarks ? (
              <View className="mt-2 pt-2 border-t border-slate-100">
                <Text className="text-[10px] text-slate-400 font-semibold mb-1">Staff Remarks</Text>
                <Text className="text-xs text-slate-600 leading-4 italic bg-slate-50/50 p-2 rounded border border-slate-100">
                  {activeOrder.remarks}
                </Text>
              </View>
            ) : null}

            <View className="flex-row justify-between items-center mt-1 border-t border-slate-100 pt-2">
              <Text className="text-[10px] text-slate-400 font-bold">Total Bill</Text>
              <Text className="text-xs text-slate-800 font-extrabold">
                {currencySymbol}
                {totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Handling Section */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
          <View className="flex-row justify-between items-center mb-3">
            <View className="flex-row items-center gap-2">
              <View className="w-9 h-9 rounded-lg bg-slate-50 items-center justify-center">
                <MaterialIcons name="payment" size={18} color="#6E6E6E" />
              </View>
              <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest">
                Payment handling
              </Text>
            </View>
            <View
              className={`px-2 py-0.5 rounded-full ${
                paymentMethod === "Cash" ? "bg-amber-100" : "bg-emerald-100"
              }`}
            >
              <Text
                className={`text-[9px] font-bold capitalize tracking-wider ${
                  paymentMethod === "Cash" ? "text-amber-700" : "text-emerald-700"
                }`}
              >
                {paymentMethod === "Cash" ? "Cash on delivery" : "Prepaid"}
              </Text>
            </View>
          </View>

          {paymentMethod === "Cash" ? (
            <View
              key="cash-payment-container"
              className="bg-amber-50/50 border border-amber-100 rounded-lg p-3"
            >
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-[10px] font-semibold text-amber-800 capitalize tracking-wider">
                  Cash to collect
                </Text>
                <Text className="text-sm font-bold text-amber-800">
                  {currencySymbol}
                  {totalAmount.toFixed(2)}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => setCollectedAmount(totalAmount.toFixed(2))}
                activeOpacity={0.7}
                className="bg-amber-100/50 border border-amber-200/60 rounded-lg px-2.5 py-1.5 self-start mb-2 mt-1"
              >
                <Text className="text-[10px] font-semibold text-amber-800 capitalize">
                  Exact — {currencySymbol}
                  {totalAmount.toFixed(2)}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1">
                <Text className="font-semibold text-slate-400 mr-2 text-sm">{currencySymbol}</Text>
                <BottomSheetTextInput
                  value={collectedAmount}
                  onChangeText={setCollectedAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor="#94a3b8"
                  className="flex-1 text-slate-900 font-bold text-sm p-0 m-0"
                  editable={!updateStatusMutation.isPending}
                />
              </View>

              <View className="mt-3">
                <Button
                  label={updateStatusMutation.isPending ? "Confirming..." : "Confirm payment"}
                  onPress={handleConfirmPayment}
                  disabled={updateStatusMutation.isPending}
                  variant="primary"
                />
              </View>
            </View>
          ) : (
            <View
              key="prepaid-payment-container"
              className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex-row items-center gap-3"
            >
              <View className="w-8 h-8 rounded-lg bg-emerald-500 items-center justify-center">
                <MaterialIcons name="security" size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-emerald-800 text-[10px] capitalize tracking-wider">
                  Payment already collected
                </Text>
                <Text className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                  This order is prepaid and fully settled.
                </Text>
              </View>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
