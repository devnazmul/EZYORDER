import BottomSheet from "@/components/reuseable/BottomSheet";
import Button from "@/components/reuseable/Button";
import { useAuth } from "@/context/AuthContext";
import { formatLabel } from "@/utils/formatLabel";
import { formatAmount } from "@/utils/formatters";
import formatUtcToLocalTime from "@/utils/formatUtcToLocalTime";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView, BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
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
  const insets = useSafeAreaInsets();

  const { token } = useAuth();
  const { data: fullOrderDetail, isLoading: isLoadingDetails } = useOrderDetailQuery(
    token || "",
    activeOrder?.id || "",
    visible,
  );

  if (!activeOrder) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["55%", "75%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center border-b border-base-200 pb-3 px-6 pt-2">
        <View className="gap-y-1">
          <Text className="text-lg font-bold text-neutral">Order #{activeOrder.id}</Text>
          <Text className="text-xs text-accent">
            Type:{" "}
            <Text className="font-bold capitalize text-primary">
              {activeOrder.type ? formatLabel(activeOrder.type) : "Delivery"}
            </Text>
          </Text>
        </View>
        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={activeOrder?.latitude && activeOrder?.longitude ? handleDirectGps : handleGetRoute}
            className="h-9 w-9 flex items-center justify-center rounded-md  bg-primary"
          >
            <MaterialIcons name="near-me" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (activeOrder?.customer_phone && activeOrder?.customer_phone !== "N/A") {
                Linking.openURL(`tel:${activeOrder.customer_phone}`).catch(() => {});
              }
            }}
            className="h-9 w-9 flex items-center justify-center rounded-md  bg-primary"
          >
            <MaterialIcons name="phone" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickSMS("I am on my way with your order.")}
            className="h-9 w-9 flex items-center justify-center rounded-md  bg-primary"
          >
            <MaterialIcons name="message" size={19} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
      >
        {/* Customer Information */}
        <View className="gap-y-2">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Customer Details</Text>
          <View className="bg-base-100 rounded-xl p-4 gap-y-2 border border-base-200">
            <View className="flex-row justify-between">
              <Text className="text-xs text-accent">Name:</Text>
              <Text className="text-xs font-bold text-neutral">{activeOrder.customer_name || "N/A"}</Text>
            </View>

            {activeOrder.customer_phone && activeOrder.customer_phone !== "N/A" ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Phone:</Text>
                <Text className="text-xs font-bold text-neutral">{activeOrder.customer_phone}</Text>
              </View>
            ) : null}

            {activeOrder.customer_note ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Customer Note:</Text>
                <Text className="text-xs font-bold text-neutral italic">"{activeOrder.customer_note}"</Text>
              </View>
            ) : null}

            <View className="flex-row justify-between items-start">
              <Text className="text-xs text-accent">Delivery Address:</Text>
              <View className="flex-row items-center gap-1.5 flex-1 justify-end ml-4">
                <Text className="text-xs font-bold text-neutral text-right flex-1" numberOfLines={2}>
                  {activeOrder.door_no ? `${activeOrder.door_no}, ` : ""}
                  {activeOrder.customer_address}
                  {activeOrder.customer_post_code ? ` — ${activeOrder.customer_post_code}` : ""}
                </Text>
                {activeOrder?.latitude && activeOrder?.longitude ? (
                  <TouchableOpacity
                    key="gps-directions-btn"
                    onPress={handleDirectGps}
                    className="w-5 h-5 rounded bg-emerald-100 items-center justify-center shrink-0"
                  >
                    <MaterialIcons name="directions" size={12} color="#36d399" />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {activeOrder.initial_note ? (
              <TouchableOpacity
                key="delivery-instructions-toggle"
                onPress={() => setIsNoteExpanded(!isNoteExpanded)}
                activeOpacity={0.7}
                className="border-t border-base-200 pt-2 mt-1"
              >
                <View className="flex-row items-center justify-between">
                  <Text className="text-xs text-accent">Delivery instructions</Text>
                  <MaterialIcons
                    name={isNoteExpanded ? "expand-less" : "expand-more"}
                    size={16}
                    color="#6E6E6E"
                  />
                </View>
                {isNoteExpanded && (
                  <Text
                    key="delivery-instructions-text"
                    className="text-xs text-neutral/70 mt-1 italic font-medium leading-4"
                  >
                    {activeOrder.initial_note}
                  </Text>
                )}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Order Items Section */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Order Items</Text>
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
                      const rawPrice =
                        item.dish?.price || item.dish_price || item.main_price || item.price || 0;
                      const price = typeof rawPrice === "number" ? rawPrice : parseFloat(rawPrice) || 0;

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

        {/* Order Details Section */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Order Details</Text>
          <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-2">
            {activeOrder.order_time || activeOrder.created_at ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Order Placed:</Text>
                <Text className="text-xs font-bold text-neutral">
                  {formatUtcToLocalTime(activeOrder.order_time || activeOrder.created_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.accepted_at ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Accepted At:</Text>
                <Text className="text-xs font-bold text-neutral">
                  {formatUtcToLocalTime(activeOrder.accepted_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.picked_up_at ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Picked Up At:</Text>
                <Text className="text-xs font-bold text-neutral">
                  {formatUtcToLocalTime(activeOrder.picked_up_at)}
                </Text>
              </View>
            ) : null}

            {activeOrder.delivery_otp ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">OTP Code:</Text>
                <Text className="text-xs font-bold text-emerald-600">{activeOrder.delivery_otp}</Text>
              </View>
            ) : null}

            {activeOrder.remarks ? (
              <View className="border-t border-base-200 pt-2 mt-1">
                <Text className="text-[10px] font-bold text-neutral capitalize tracking-wider mb-1">
                  Staff Remarks
                </Text>
                <Text className="text-xs text-neutral/70 italic leading-4 bg-white/50 p-2.5 rounded border border-base-200">
                  {activeOrder.remarks}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Bill Summary */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Bill Summary</Text>
          <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-2">
            <View className="flex-row justify-between">
              <Text className="text-xs text-accent">Subtotal:</Text>
              <Text className="text-xs font-semibold text-neutral">
                {formatAmount(totalAmount - parseFloat(activeOrder.tip_amount || "0"), currencySymbol)}
              </Text>
            </View>

            {parseFloat(activeOrder.tip_amount || "0") > 0 ? (
              <View className="flex-row justify-between">
                <Text className="text-xs text-accent">Driver Tip:</Text>
                <Text className="text-xs font-semibold text-neutral">
                  {formatAmount(parseFloat(activeOrder.tip_amount), currencySymbol)}
                </Text>
              </View>
            ) : null}

            <View className="border-t border-base-200 pt-2 mt-1 flex-row justify-between items-center">
              <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
              <Text className="text-md font-bold text-primary">
                {formatAmount(totalAmount, currencySymbol)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Handling Section */}
        <View className="gap-y-2 mt-4">
          <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Payment handling</Text>
          <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-accent">Payment Method:</Text>
              <Text className="text-xs font-semibold text-neutral">
                {paymentMethod === "Cash" ? "Cash on delivery" : "Prepaid"}
              </Text>
            </View>

            {paymentMethod === "Cash" ? (
              <View key="cash-payment-container" className="gap-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xs text-accent">Cash to collect:</Text>
                  <Text className="text-sm font-bold text-neutral">
                    {formatAmount(totalAmount, currencySymbol)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => setCollectedAmount(totalAmount.toFixed(2))}
                  activeOpacity={0.7}
                  className="bg-primary border border-primary rounded-lg px-2.5 py-1.5 self-start"
                >
                  <Text className="text-[10px] font-semibold text-white capitalize">
                    Exact — {formatAmount(totalAmount, currencySymbol)}
                  </Text>
                </TouchableOpacity>

                <View className="flex-row items-center bg-white border border-base-200 rounded-lg px-3 py-2.5">
                  <Text className="font-semibold text-accent mr-2 text-sm">{currencySymbol}</Text>
                  <BottomSheetTextInput
                    value={collectedAmount}
                    onChangeText={setCollectedAmount}
                    placeholder="0.00"
                    keyboardType="numeric"
                    placeholderTextColor="#6E6E6E"
                    className="flex-1 text-neutral font-bold text-sm p-0 m-0"
                    editable={!updateStatusMutation.isPending}
                  />
                </View>

                <Button
                  label={updateStatusMutation.isPending ? "Confirming..." : "Confirm payment"}
                  onPress={handleConfirmPayment}
                  disabled={updateStatusMutation.isPending}
                  variant="primary"
                  containerClassName="mt-2"
                />
              </View>
            ) : (
              <View
                key="prepaid-payment-container"
                className="bg-emerald-50 border border-emerald-100 rounded-lg p-3.5 flex-row items-center gap-3"
              >
                <MaterialIcons name="security" size={18} color="#059669" />
                <View className="flex-1">
                  <Text className="font-bold text-emerald-800 text-[11px] capitalize tracking-wider">
                    Payment already collected
                  </Text>
                  <Text className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                    This order is prepaid and fully settled.
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
