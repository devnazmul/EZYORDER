import BrandAlertModal, { BrandAlertConfig } from "@/components/reuseable/BrandAlertModal";
import Button from "@/components/reuseable/Button";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Linking, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DriverOrder } from "../types";

interface DriverActiveOrderCardProps {
  activeOrder: DriverOrder;
  isLoading: boolean;
  updateStatusMutation: any;
  refetchActiveOrders?: () => void;
  onOpenDetails: () => void;
  onOpenHelp: () => void;
}

const DELIVERY_STATUSES_MAP: Record<string, Record<string, any>> = {
  accepted: {
    icon: "thumb-up",
    title: "Accepted",
    description: "Accept Order",
  },
  picked_up: {
    icon: "thumb-up",
    title: "Picked Up",
    description: "Pickup Order",
  },
  on_route: {
    icon: "shopping-bag",
    title: "En Route",
    description: "Start Ride To Destination",
  },
  arrived: {
    icon: "local-shipping",
    title: "Arrived",
    description: "Arrived At Location",
  },
  delivered: {
    icon: "place",
    title: "Delivered",
    description: "Deliver To Customer",
  },
  failed: {
    icon: "check-circle",
    title: "Failed",
    description: "Order Failed",
  },
};
const DELIVERY_STATUS_KEYS = Object.keys(DELIVERY_STATUSES_MAP).filter((key) => key !== "failed");

const DriverActiveOrderCard: React.FC<DriverActiveOrderCardProps> = ({
  activeOrder,
  isLoading,
  updateStatusMutation,
  refetchActiveOrders,
  onOpenDetails,
  onOpenHelp,
}: DriverActiveOrderCardProps) => {
  const { settings } = useData();
  const currencySymbol = React.useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  const isPrepaid = activeOrder?.payment_status?.toLowerCase() === "paid";
  const paymentMethod =
    activeOrder?.payment_method?.toLowerCase() === "cod" ||
    activeOrder?.payment_method?.toLowerCase() === "cash" ||
    !isPrepaid
      ? "Cash"
      : "Prepaid";
  const totalAmount = parseFloat(activeOrder?.amount || activeOrder?.total_due_amount || "0");

  const [currentStep, setCurrentStep] = useState(0);
  const [collectedAmount, setCollectedAmount] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

  const [alertConfig, setAlertConfig] = useState<BrandAlertConfig>({
    visible: false,
    title: "",
    description: "",
    type: "info",
  });

  const showAlert = (
    title: string,
    description: string,
    type: "info" | "success" | "error" | "confirm" = "info",
    onConfirm?: () => void,
    confirmText?: string,
    cancelText?: string,
  ) => {
    setAlertConfig({
      visible: true,
      title,
      description,
      type,
      confirmText,
      cancelText,
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
    });
  };

  const pulse = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    if (!isLoading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isLoading, pulse]);

  useEffect(() => {
    if (activeOrder) {
      const step = DELIVERY_STATUS_KEYS.indexOf(activeOrder.delivery_status);
      if (step != -1) {
        setCurrentStep(step);
      }
    }
  }, [activeOrder?.delivery_status, activeOrder?.id]);

  const handleQuickSMS = (msg: string) => {
    const customerPhone = activeOrder?.customer_phone;
    if (customerPhone !== "N/A") {
      const url = `sms:${customerPhone}${Platform.OS === "ios" ? "&" : "?"}body=${encodeURIComponent(msg)}`;
      Linking.openURL(url).catch(() => {
        showAlert("Error", "Could not launch SMS app.", "error");
      });
    }
  };

  const handleDirectGps = () => {
    const lat = activeOrder?.latitude;
    const lng = activeOrder?.longitude;
    if (lat && lng) {
      const url =
        Platform.select({
          ios: `maps://app?daddr=${lat},${lng}&saddr=Current%20Location`,
          android: `google.navigation:q=${lat},${lng}`,
        }) || `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      Linking.openURL(url).catch(() => {
        showAlert("Error", "Could not open map navigation.", "error");
      });
    } else {
      showAlert("GPS Missing", "No lat/long coordinates available for this order.", "error");
    }
  };

  const handleGetRoute = () => {
    const customerAddress = activeOrder?.customer_address;
    if (customerAddress && customerAddress !== "N/A") {
      const url =
        Platform.select({
          ios: `maps://app?q=${encodeURIComponent(customerAddress)}`,
          android: `geo:0,0?q=${encodeURIComponent(customerAddress)}`,
        }) || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;

      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`,
          );
        }
      });
    } else {
      showAlert("Address Missing", "No delivery address available for route navigation.", "error");
    }
  };

  const handleUpdateOrderStatus = () => {
    if (!activeOrder?.id || updateStatusMutation.isPending) return;
    if (currentStep < 3) {
      const nextApiStatus = DELIVERY_STATUS_KEYS[currentStep + 1];
      if (!nextApiStatus) return;
      const nextStatusInfo = DELIVERY_STATUSES_MAP[nextApiStatus];
      const displayLabel = nextStatusInfo?.title || "";

      showAlert(
        "Update Status",
        `Confirm changing order status to "${displayLabel}"?`,
        "confirm",
        () => {
          const orderId = activeOrder.id;
          const data = new FormData();
          data.append("status", nextApiStatus);

          updateStatusMutation.mutate(
            { orderId, formData: data },
            {
              onSuccess: () => {
                refetchActiveOrders?.();
                showAlert("Success", `Status updated to ${displayLabel}`, "success");
              },
              onError: (err: any) => {
                const errMsg = err?.data?.message || err?.message || "Failed to update status";
                showAlert("Error", errMsg, "error");
              },
            },
          );
        },
        "Confirm",
        "Cancel",
      );
    } else {
      showAlert(
        "Confirm Delivery",
        "Mark this order as Delivered?",
        "confirm",
        () => {
          const orderId = activeOrder.id;
          const data = new FormData();
          data.append("status", "delivered");

          if (deliveryNote.trim()) data.append("delivery_notes", deliveryNote.trim());
          if (collectedAmount) data.append("cash_collected", collectedAmount);

          updateStatusMutation.mutate(
            { orderId, formData: data },
            {
              onSuccess: () => {
                setCollectedAmount("");
                setDeliveryNote("");
                refetchActiveOrders?.();
                showAlert("Delivered", "Order has been marked as delivered successfully!", "success");
              },
              onError: (err: any) => {
                const errMsg =
                  err?.data?.message || err?.message || "Invalid OTP. Please check with customer.";
                showAlert("Error", errMsg, "error");
              },
            },
          );
        },
        "Confirm",
        "Cancel",
      );
    }
  };

  const handleConfirmPayment = () => {
    if (!collectedAmount || isNaN(Number(collectedAmount)) || Number(collectedAmount) <= 0) {
      showAlert("Invalid Amount", "Please enter a valid amount.", "error");
      return;
    }
    if (!activeOrder?.id || updateStatusMutation.isPending) return;

    const orderId = activeOrder.id;
    const data = new FormData();
    data.append("status", activeOrder.delivery_status || "on_route");
    data.append("cash_collected", collectedAmount);

    updateStatusMutation.mutate(
      { orderId, formData: data },
      {
        onSuccess: (res: any) => {
          if (res?.success) {
            refetchActiveOrders?.();
            showAlert(
              "Success",
              `Payment of ${formatAmount(collectedAmount, currencySymbol)} recorded!`,
              "success",
            );
            setCollectedAmount("");
          } else {
            showAlert(
              "Error",
              res?.message || "Payment could not be recorded. Please contact support.",
              "error",
            );
          }
        },
        onError: (err: any) => {
          const errMsg = err?.data?.message || err?.message || "Failed to confirm payment.";
          showAlert("Error", errMsg, "error");
        },
      },
    );
  };

  if (isLoading) {
    const Bone = ({ className, style }: { className?: string; style?: any }) => (
      <View className={`bg-slate-200 rounded-lg ${className || ""}`} style={style} />
    );

    return (
      <Animated.View key="loading" style={{ opacity: pulse }} className="w-full">
        {/* Step tracker */}
        <View className="mb-6 px-1.5">
          <View className="flex-row justify-between items-center mb-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} className="items-center flex-1">
                <Bone className="w-8 h-8 rounded-full" />
                <Bone className="h-2 w-10 mt-1.5" />
              </View>
            ))}
          </View>
          <Bone className="w-full h-14 rounded-lg" />
        </View>

        {/* Payment banner */}
        <Bone className="w-full h-10 rounded-lg mb-3" />

        {/* Customer info card */}
        <View className="bg-white rounded-lg p-4 mb-3 border border-slate-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Bone className="w-9 h-9 rounded-lg" />
              <View>
                <Bone className="h-3.5 w-28 mb-1.5" />
                <Bone className="h-2.5 w-20" />
              </View>
            </View>
            <View className="flex-row gap-2">
              <Bone className="w-10 h-10 rounded-lg" />
              <Bone className="w-10 h-10 rounded-lg" />
            </View>
          </View>
        </View>

        {/* Address card */}
        <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100 shadow-sm">
          <View className="flex-row items-start gap-3">
            <Bone className="w-9 h-9 rounded-lg" />
            <View className="flex-1">
              <Bone className="h-2.5 w-28 mb-2" />
              <Bone className="h-3.5 w-full mb-1.5" />
              <Bone className="h-3.5 w-2/3" />
            </View>
          </View>
          <Bone className="w-full h-11 rounded-lg mt-4" />
        </View>
      </Animated.View>
    );
  }

  return (
    <View key="loaded" className="w-full">
      {/* Steps Progress Tracker */}
      <View className="mb-6 px-1.5">
        <View className="flex-row justify-between items-center mb-4 relative">
          {/* Horizontal Line Connections */}
          <View className="absolute left-4 right-4 top-4 h-[2px] bg-slate-100 z-0" />
          <View
            style={{ width: `${currentStep * (100 / Math.max(1, DELIVERY_STATUS_KEYS.length - 1))}%` }}
            className="absolute left-4 top-4 h-[2px] bg-emerald-500 z-0"
          />

          {DELIVERY_STATUS_KEYS.map((key, _id) => {
            const stepInfo = DELIVERY_STATUSES_MAP[key];
            const isPassed = _id <= currentStep;
            const isActive = _id === currentStep + 1;

            return (
              <View key={key} className="items-center flex-1">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center z-10 border-2 ${
                    isPassed
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : isActive
                        ? "bg-primary border-primary text-white"
                        : "bg-base-300 border-slate-100 text-slate-400"
                  }`}
                >
                  <MaterialIcons
                    name={stepInfo.icon}
                    size={14}
                    color={isPassed || isActive ? "white" : "#00000025"}
                  />
                </View>
                <Text
                  className={`text-[8px] font-semibold capitalize mt-1.5 tracking-wider ${
                    isActive ? "text-primary" : isPassed ? "text-emerald-500" : "text-slate-400"
                  }`}
                >
                  {stepInfo.title}
                </Text>
              </View>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleUpdateOrderStatus}
          activeOpacity={0.8}
          className={`w-full py-3.5 px-4 rounded-md shadow-sm flex-row items-center justify-between bg-primary/80`}
        >
          <View>
            <Text className="text-white text-xs font-semibold ">Next Step</Text>
            <Text className="text-white text-xs font-black Capitalize tracking-wider">
              {(() => {
                const nextApiStatus = DELIVERY_STATUS_KEYS[currentStep + 1];
                return DELIVERY_STATUSES_MAP[nextApiStatus]?.description || "";
              })()}
            </Text>
          </View>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Address and Route Launch Panel */}
      <View className="mb-4">
        <Text>Delivery Address</Text>

        <View className="flex-row items-center justify-between gap-3">
          <Text numberOfLines={2} className="text-xs text-slate-500 font-semibold flex-1 leading-4">
            {activeOrder?.door_no ? `${activeOrder.door_no}, ` : ""}
            {activeOrder?.customer_address}
            {activeOrder?.customer_post_code ? ` — ${activeOrder.customer_post_code}` : ""}
          </Text>

          {activeOrder?.latitude && activeOrder?.longitude && (
            <TouchableOpacity
              onPress={handleDirectGps}
              className="w-7 h-7 rounded-lg bg-emerald-100 items-center justify-center shrink-0"
            >
              <MaterialIcons name="directions" size={16} color="#10b981" />
            </TouchableOpacity>
          )}
        </View>

        {activeOrder?.initial_note ? (
          <TouchableOpacity
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
              <Text className="text-[10px] text-slate-500 py-2 leading-4 italic">
                {activeOrder.initial_note}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        <View className="mt-3">
          <Button label="Get Route Navigation" onPress={handleGetRoute} variant="primary" />
        </View>
      </View>

      {/* Customer Contact Panel */}
      <View className="mb-3">
        <View className="flex-row gap-2.5">
          {/* Call Button containing the number */}
          <View className="flex-1">
            <Button
              label={`Call: ${activeOrder?.customer_phone || "N/A"}`}
              onPress={() => {
                if (activeOrder?.customer_phone && activeOrder?.customer_phone !== "N/A") {
                  Linking.openURL(`tel:${activeOrder.customer_phone}`);
                }
              }}
              variant="secondary"
            />
          </View>

          {/* Message Button */}
          <View className="flex-1">
            <Button
              label="Message"
              onPress={() => handleQuickSMS("I am on my way with your order.")}
              variant="secondary"
            />
          </View>
        </View>

        {/* Quick Messages Section below the message button */}
        <View className="mt-4 pt-4 border-t border-slate-100">
          <Text className="text-[10px] font-semibold text-slate-400 capitalize tracking-wider mb-2">
            Quick message
          </Text>
          <View className="flex-row gap-2 flex-wrap">
            {["I am on my way.", "I have arrived.", "Please call back."].map((msg) => (
              <TouchableOpacity
                key={msg}
                onPress={() => handleQuickSMS(msg)}
                className="px-3.5 py-2 bg-slate-50 rounded-lg border border-slate-200/60 active:bg-slate-100"
              >
                <Text className="text-[10px] font-semibold text-slate-600 capitalize">{msg}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Payment Handling Section */}
      <View className="bg-white rounded-lg p-4 mb-3 border border-slate-100 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-9 h-9 rounded-lg bg-slate-50 items-center justify-center">
              <MaterialIcons name="payment" size={18} color="#475569" />
            </View>
            <Text className="text-[10px] font-semibold text-slate-400 capitalize tracking-wider">
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
          <View className="bg-amber-50/50 border border-amber-100 rounded-lg p-3">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-[10px] font-semibold text-amber-800 capitalize tracking-wider">
                Cash to collect
              </Text>
              <Text className="text-sm font-bold text-amber-800">
                {formatAmount(totalAmount, currencySymbol)}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setCollectedAmount(totalAmount.toFixed(2))}
              activeOpacity={0.7}
              className="bg-amber-100/50 border border-amber-200/60 rounded-lg px-2.5 py-1.5 self-start mb-2 mt-1"
            >
              <Text className="text-[10px] font-semibold text-amber-800 capitalize">
                Exact — {formatAmount(totalAmount, currencySymbol)}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 mt-1">
              <Text className="font-semibold text-slate-400 mr-2 text-sm">{currencySymbol}</Text>
              <TextInput
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
          <View className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 flex-row items-center gap-3">
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

      {/* Drawer Action Triggers */}
      <View className="flex-row gap-2.5 mt-3">
        <View className="flex-1">
          <Button label="View Details" onPress={onOpenDetails} variant="secondary" />
        </View>
        <View className="flex-1">
          <Button label="Get Help" onPress={onOpenHelp} variant="outline" />
        </View>
      </View>

      <BrandAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm || (() => {})}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

DriverActiveOrderCard.displayName = "Driver Active Order Card";
export default DriverActiveOrderCard;
