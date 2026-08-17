import OrderItemList from "@/components/bottomsheet/OrderItemList";
import PaymentCollectionSection from "@/components/bottomsheet/PaymentCollectionSection";
import BottomSheet from "@/components/reuseable/BottomSheet";
import { useAuth } from "@/context/AuthContext";
import { formatAmount } from "@/utils/formatters";
import formatUtcToLocalTime from "@/utils/formatUtcToLocalTime";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { UseMutationResult } from "@tanstack/react-query";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center">
            <MaterialIcons name="receipt-long" size={20} color="#DC2D2A" />
          </View>
          <View>
            <Text className="text-base font-bold text-neutral">Order #{activeOrder.id}</Text>
            <Text className="text-[11px] text-accent font-medium mt-0.5">
              Assigned Delivery Details
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-3">
          <TouchableOpacity
            onPress={activeOrder?.latitude && activeOrder?.longitude ? handleDirectGps : handleGetRoute}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-primary"
          >
            <MaterialIcons name="near-me" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (activeOrder?.customer_phone && activeOrder?.customer_phone !== "N/A") {
                Linking.openURL(`tel:${activeOrder.customer_phone}`).catch(() => {});
              }
            }}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-primary"
          >
            <MaterialIcons name="phone" size={20} color="#ffffff" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleQuickSMS("I am on my way with your order.")}
            className="h-9 w-9 flex items-center justify-center rounded-md bg-primary"
          >
            <MaterialIcons name="message" size={19} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 }}
      >
        <ActiveCustomerSection
          activeOrder={activeOrder}
          handleDirectGps={handleDirectGps}
        />

        {/* Instructions Section */}
        {activeOrder.initial_note ? (
          <View className="gap-y-2 mt-4">
            <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Instructions</Text>
            <View className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 flex-row items-start gap-2.5">
              <MaterialIcons name="assignment-late" size={18} color="#DC2D2A" />
              <Text className="text-xs text-neutral italic font-semibold leading-5 flex-1">
                {activeOrder.initial_note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Order Items Section */}
        <OrderItemList
          items={fullOrderDetail?.detail || fullOrderDetail?.details || []}
          isLoading={isLoadingDetails}
          currencySymbol={currencySymbol}
        />

        <ActiveOrderSection activeOrder={activeOrder} />

        <ActiveBillSection
          activeOrder={activeOrder}
          totalAmount={totalAmount}
          currencySymbol={currencySymbol}
        />

        {/* Reusable Payment Handling Component */}
        <PaymentCollectionSection
          paymentMethod={paymentMethod}
          totalAmount={totalAmount}
          collectedAmount={collectedAmount}
          setCollectedAmount={setCollectedAmount}
          currencySymbol={currencySymbol}
          isPending={updateStatusMutation.isPending}
          onConfirmPayment={handleConfirmPayment}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

interface ActiveCustomerSectionProps {
  activeOrder: DriverOrder;
  handleDirectGps: () => void;
}

function ActiveCustomerSection({ activeOrder, handleDirectGps }: Readonly<ActiveCustomerSectionProps>) {
  return (
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
          <Text className="text-xs font-bold text-neutral">{activeOrder.customer_name || "N/A"}</Text>
        </View>

        {activeOrder.customer_phone && activeOrder.customer_phone !== "N/A" ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="phone" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Phone:</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(`tel:${activeOrder.customer_phone}`).catch(() => {});
              }}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-xs text-primary font-bold">(</Text>
              <MaterialIcons
                name="phone"
                size={11}
                color="#DC2D2A"
                style={{ transform: [{ rotate: "10deg" }], marginHorizontal: -1 }}
              />
              <Text className="text-xs text-primary font-bold">) </Text>
              <Text className="text-xs text-primary font-bold">{activeOrder.customer_phone}</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {activeOrder.customer_note ? (
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="chat-bubble-outline" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Customer Note:</Text>
            </View>
            <Text className="text-xs font-semibold text-neutral italic max-w-[60%] text-right">
              "{activeOrder.customer_note}"
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Address:</Text>
          </View>
          <TouchableOpacity
            onPress={handleDirectGps}
            activeOpacity={0.7}
            className="flex-1 ml-4"
          >
            <Text className="text-xs font-bold text-primary text-right" numberOfLines={3}>
              {activeOrder.door_no ? `${activeOrder.door_no}, ` : ""}
              {activeOrder.customer_address}
              {activeOrder.customer_post_code ? ` — ${activeOrder.customer_post_code}` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface ActiveOrderSectionProps {
  activeOrder: DriverOrder;
}

function ActiveOrderSection({ activeOrder }: Readonly<ActiveOrderSectionProps>) {
  return (
    <View className="gap-y-2 mt-4">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Order Details</Text>
      <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-3">
        {activeOrder.order_time || activeOrder.created_at ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="schedule" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Order Placed:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatUtcToLocalTime(activeOrder.order_time || activeOrder.created_at)}
            </Text>
          </View>
        ) : null}

        {activeOrder.accepted_at ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="done-all" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Accepted At:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatUtcToLocalTime(activeOrder.accepted_at)}
            </Text>
          </View>
        ) : null}

        {activeOrder.picked_up_at ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="local-shipping" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Picked Up At:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatUtcToLocalTime(activeOrder.picked_up_at)}
            </Text>
          </View>
        ) : null}

        {activeOrder.delivery_otp ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="verified" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">OTP Code:</Text>
            </View>
            <Text className="text-xs font-bold text-primary">{activeOrder.delivery_otp}</Text>
          </View>
        ) : null}

        {activeOrder.remarks ? (
          <View className="border-t border-base-200 pt-2.5 mt-1">
            <Text className="text-[10px] font-bold text-neutral capitalize tracking-wider mb-1">
              Staff Remarks
            </Text>
            <Text className="text-xs text-neutral/70 italic leading-4 bg-white p-2.5 rounded border border-base-200">
              {activeOrder.remarks}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

interface ActiveBillSectionProps {
  activeOrder: DriverOrder;
  totalAmount: number;
  currencySymbol: string;
}

function ActiveBillSection({ activeOrder, totalAmount, currencySymbol }: Readonly<ActiveBillSectionProps>) {
  const tip = parseFloat(activeOrder.tip_amount || "0");
  const discount = parseFloat(activeOrder.discount || "0");
  const tax = parseFloat(activeOrder.tax || "0");

  return (
    <View className="gap-y-2 mt-4">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Bill Summary</Text>
      <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="receipt" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Subtotal:</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {formatAmount(totalAmount - tip, currencySymbol)}
          </Text>
        </View>

        {discount > 0 ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="local-offer" size={16} color="#059669" />
              <Text className="text-xs text-accent">Discount:</Text>
            </View>
            <Text className="text-xs font-bold text-emerald-600">
              -{formatAmount(discount, currencySymbol)}
            </Text>
          </View>
        ) : null}

        {tax > 0 ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="account-balance" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Tax:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatAmount(tax, currencySymbol)}
            </Text>
          </View>
        ) : null}

        {tip > 0 ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="volunteer-activism" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Driver Tip:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatAmount(tip, currencySymbol)}
            </Text>
          </View>
        ) : null}

        <View className="border-t border-base-200 pt-2.5 mt-1 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="payments" size={16} color="#DC2D2A" />
            <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
          </View>
          <Text className="text-base font-bold text-neutral">
            {formatAmount(totalAmount, currencySymbol)}
          </Text>
        </View>
      </View>
    </View>
  );
}
