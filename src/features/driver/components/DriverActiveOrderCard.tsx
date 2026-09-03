import BrandAlertModal, { BrandAlertConfig } from "@/components/reuseable/BrandAlertModal";
import BrandPopupModal from "@/components/reuseable/BrandPopupModal";
import Button from "@/components/reuseable/Button";
import StatusBadge from "@/components/reuseable/StatusBadge";
import { useData } from "@/src/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import { UseMutationResult } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { Animated, Linking, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import { DriverOrder } from "../types";
import ActiveOrderDetailsModal from "./ActiveOrderDetailsModal";
import DriverActiveOrderCardSkeleton from "./skeletons/DriverActiveOrderCardSkeleton";

interface DriverActiveOrderCardProps {
  activeOrder: DriverOrder;
  isLoading: boolean;
  updateStatusMutation: UseMutationResult<
    unknown,
    unknown,
    { orderId: string | number; formData: FormData },
    unknown
  >;
  refetchActiveOrders?: () => void;
  onOpenHelp: () => void;
  onCancelOrder: () => void;
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
  onOpenHelp,
  onCancelOrder,
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
  const progressAnim = React.useRef(new Animated.Value(0)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ]),
    );
    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulseAnim]);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentStep,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  const lineWidth = progressAnim.interpolate({
    inputRange: [0, Math.max(1, DELIVERY_STATUS_KEYS.length - 1)],
    outputRange: ["0%", "100%"],
  });
  const [collectedAmount, setCollectedAmount] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [isActiveDetailsOpen, setIsActiveDetailsOpen] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otpInput, setOtpInput] = useState("");

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

  const handleVerifyOtpAndDeliver = () => {
    if (!otpInput.trim()) {
      showAlert("OTP Required", "Please enter the OTP provided by the customer.", "error");
      return;
    }

    setIsOtpModalVisible(false);

    const orderId = activeOrder.id;
    const data = new FormData();
    data.append("status", "delivered");

    if (deliveryNote.trim()) data.append("delivery_notes", deliveryNote.trim());
    if (collectedAmount) data.append("cash_collected", collectedAmount);

    data.append("otp", otpInput.trim());
    data.append("delivery_otp", otpInput.trim());

    updateStatusMutation.mutate(
      { orderId, formData: data },
      {
        onSuccess: () => {
          setCollectedAmount("");
          setDeliveryNote("");
          setOtpInput("");
          refetchActiveOrders?.();
          showAlert("Delivered", "Order has been marked as delivered successfully!", "success");
        },
        onError: (err: any) => {
          const errMsg = err?.data?.message || err?.message || "Invalid OTP. Please check with customer.";
          showAlert("Error", errMsg, "error");
        },
      },
    );
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
      if (activeOrder.delivery_otp) {
        setOtpInput("");
        setIsOtpModalVisible(true);
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
                  const errMsg = err?.data?.message || err?.message || "Failed to deliver order.";
                  showAlert("Error", errMsg, "error");
                },
              },
            );
          },
          "Confirm",
          "Cancel",
        );
      }
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

  const handleQuickReply = (msg: string) => {
    if (activeOrder.customer_phone && activeOrder.customer_phone !== "N/A") {
      const url = `sms:${activeOrder.customer_phone}${Platform.OS === "ios" ? "&" : "?"}body=${encodeURIComponent(msg)}`;
      Linking.openURL(url).catch(() => {});
    }
  };

  if (isLoading) {
    return <DriverActiveOrderCardSkeleton />;
  }

  return (
    <>
      <View
        key="loaded-2"
        className="w-full p-4 bg-base-200 border border-base-100/50 rounded-2xl shadow-sm mb-2 flex-col gap-6 overflow-hidden"
      >
        {/* Header showing Order ID */}
        <View className="flex-row justify-between items-center pb-3 border-b border-slate-200/40">
          <View>
            <Text className="text-md font-semibold text-slate-400 capitalize tracking-wider">Order ID</Text>
            <Text className="text-xl font-bold text-neutral/80 mt-0.5">#{activeOrder?.id}</Text>
          </View>
          <TouchableOpacity
            onPress={onOpenHelp}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 bg-white"
          >
            <MaterialIcons name="help-outline" size={13} color="#6E6E6E" />
            <Text className="text-[10px] font-bold text-slate-600 capitalize tracking-wider">Help</Text>
          </TouchableOpacity>
        </View>
        {/* Steps Progress Tracker */}
        <View className="">
          <View className="flex-row justify-between items-center mb-4 relative">
            {/* Horizontal Line Connections */}
            <View className="absolute left-4 right-4 top-4 h-[2px] bg-slate-100 z-0" />
            <Animated.View
              style={{ width: lineWidth }}
              className="absolute left-4 top-4 h-[2px] bg-emerald-500 z-0"
            />

            {DELIVERY_STATUS_KEYS.map((key, _id) => {
              const stepInfo = DELIVERY_STATUSES_MAP[key];
              const isPassed = _id <= currentStep;
              const isActive = _id === currentStep + 1;

              return (
                <View key={key} className="items-center flex-1 relative">
                  {isActive && (
                    <Animated.View
                      style={{ opacity: pulseAnim }}
                      className="absolute top-0 w-8 h-8 rounded-full bg-primary/20 border border-primary/40 z-0"
                    />
                  )}
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center z-10 border ${
                      isPassed
                        ? "bg-emerald-500 border-emerald-500 text-white "
                        : isActive
                          ? " border-primary text-primary"
                          : "bg-base-300 border-slate-100 text-slate-400"
                    }`}
                  >
                    <MaterialIcons
                      name={isPassed ? "check" : stepInfo.icon}
                      size={isPassed ? 18 : 14}
                      color={isPassed ? "white" : isActive ? "#DC2D2A" : "#00000025"}
                    />
                  </View>
                  <Text
                    className={`text-[8px] font-semibold capitalize mt-1.5 tracking-wider ${
                      isActive ? "text-primary font-bold" : isPassed ? "text-emerald-500" : "text-slate-400"
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
            activeOpacity={0.85}
            className="w-full py-3.5 px-4 rounded-lg shadow-md flex-row items-center justify-between bg-primary border border-primary/50"
          >
            <View>
              <Text className="text-white text-[9px] font-medium capitalize tracking-wider">Next Step</Text>
              <Text className="text-white text-xs font-bold capitalize mt-0.5 tracking-wider">
                {(() => {
                  const nextApiStatus = DELIVERY_STATUS_KEYS[currentStep + 1];
                  return DELIVERY_STATUSES_MAP[nextApiStatus]?.description || "";
                })()}
              </Text>
            </View>
            <View className="w-8 h-8 rounded-full bg-white/10 items-center justify-center border border-white/20">
              <MaterialIcons name="arrow-forward" size={18} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        {/* Visual Route Path Section */}
        <View style={{ gap: 24 }} className="border-t  border-b border-slate-200/40 py-4 relative">
          {/* Pickup Address */}
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center border border-blue-100">
              <MaterialIcons name="storefront" size={16} color="#2563EB" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-medium text-slate-400 capitalize tracking-wider">
                Pickup From
              </Text>
              <Text className="text-sm font-semibold text-neutral mt-0.5">
                Restaurant #{activeOrder.restaurant_id}
              </Text>
            </View>
          </View>

          {/* Vertical Connecting Line */}
          <View
            style={{
              position: "absolute",
              left: 12,
              top: 50,
              bottom: 48,
              width: 2,
              borderWidth: 1,
              borderColor: "#cbd5e1",
              borderStyle: "solid",
            }}
          />

          {/* Delivery Address */}
          <View className="flex-row items-center gap-3">
            <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center border border-primary/20">
              <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-medium text-slate-400 capitalize tracking-wider">
                Deliver To
              </Text>
              <Text className="text-sm font-semibold text-neutral mt-0.5 leading-4" numberOfLines={2}>
                {activeOrder.door_no ? `${activeOrder.door_no}, ` : ""}
                {activeOrder.customer_address}
              </Text>
            </View>
            {activeOrder.customer_address && activeOrder.customer_address !== "N/A" && (
              <TouchableOpacity
                onPress={handleGetRoute}
                activeOpacity={0.7}
                className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center"
              >
                <MaterialIcons name="near-me" size={15} color="#DC2D2A" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Customer & Payment Information Row */}
        <View className="flex-row items-start justify-between ">
          {/* Customer Details */}
          <View className="flex-row items-start gap-2.5 flex-1 pr-4">
            <View className="w-9 h-9 rounded-full bg-slate-100 items-center justify-center border border-slate-200/50">
              <MaterialIcons name="person" size={18} color="#64748B" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral" numberOfLines={1}>
                {activeOrder.customer_name}
              </Text>
              {activeOrder.customer_phone && activeOrder.customer_phone !== "N/A" ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(`tel:${activeOrder.customer_phone}`).catch(() => {});
                  }}
                  activeOpacity={0.7}
                  className="flex-row items-center mt-0.5"
                >
                  <Text className="text-xs text-primary font-medium">(</Text>
                  <MaterialIcons
                    name="phone"
                    size={11}
                    color="#DC2D2A"
                    style={{ transform: [{ rotate: "10deg" }], marginHorizontal: -1 }}
                  />
                  <Text className="text-xs text-primary font-medium">) </Text>
                  <Text className="text-xs text-primary font-medium">{activeOrder.customer_phone}</Text>
                </TouchableOpacity>
              ) : (
                <Text className="text-xs text-neutral/30 font-medium mt-0.5">(No phone)</Text>
              )}
              {/* Modern Quick Message Chips */}
              {activeOrder.customer_phone && activeOrder.customer_phone !== "N/A" && (
                <View className="flex-row flex-wrap gap-2 mt-3">
                  {["On my way", "Arrived", "Call me back"].map((msg) => (
                    <TouchableOpacity
                      key={msg}
                      onPress={() => handleQuickReply(msg)}
                      activeOpacity={0.7}
                      className="px-3 py-1.5 rounded-full bg-primary/5 border border-slate-200/50"
                    >
                      <Text className="text-[9px] text-neutral/60 font-semibold capitalize">{msg}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Payment Status & Amount */}
          <View className="items-end gap-y-1.5 shrink-0">
            <Text className="text-lg font-black text-neutral">
              {formatAmount(activeOrder.amount || activeOrder.total_due_amount || "0", currencySymbol)}
            </Text>
            <StatusBadge
              status={activeOrder?.payment_status.toLocaleLowerCase() === "paid" ? "paid" : "unpaid"}
            />
          </View>
        </View>
        {/* Active Order Actions Modal */}
        <ActiveOrderDetailsModal
          visible={isActiveDetailsOpen}
          onClose={() => setIsActiveDetailsOpen(false)}
          activeOrder={activeOrder}
          currencySymbol={currencySymbol}
          paymentMethod={paymentMethod}
          totalAmount={totalAmount}
          collectedAmount={collectedAmount}
          setCollectedAmount={setCollectedAmount}
          deliveryNote={deliveryNote}
          setDeliveryNote={setDeliveryNote}
          isNoteExpanded={isNoteExpanded}
          setIsNoteExpanded={setIsNoteExpanded}
          updateStatusMutation={updateStatusMutation}
          handleConfirmPayment={handleConfirmPayment}
          handleDirectGps={handleDirectGps}
          handleGetRoute={handleGetRoute}
          handleQuickSMS={handleQuickSMS}
        />
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
        <BrandPopupModal
          visible={isOtpModalVisible}
          onClose={() => setIsOtpModalVisible(false)}
          title="Verify Delivery OTP"
          description="Enter the OTP code provided by the customer to confirm delivery."
          icon="lock-outline"
          iconColor="#10b981"
          bgColor="bg-emerald-50"
          borderColor="border-emerald-100"
        >
          <View className="w-full gap-4 mt-2">
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-xl px-3 h-12">
              <MaterialIcons name="vpn-key" size={18} color="#94a3b8" />
              <TextInput
                value={otpInput}
                onChangeText={setOtpInput}
                placeholder="Enter Delivery OTP"
                placeholderTextColor="#94a3b8"
                keyboardType="number-pad"
                maxLength={8}
                className="flex-1 text-slate-900 font-bold text-sm ml-2.5"
              />
            </View>

            <View className="flex-row gap-3 w-full mt-2">
              <View className="flex-1">
                <Button label="Cancel" onPress={() => setIsOtpModalVisible(false)} variant="secondary" />
              </View>
              <View className="flex-1">
                <Button label="Confirm" onPress={handleVerifyOtpAndDeliver} variant="primary" />
              </View>
            </View>
          </View>
        </BrandPopupModal>
        <View className="flex-row gap-2">
          <View className="flex-1">
            <Button
              label="Cancel This Order"
              onPress={onCancelOrder}
              variant="secondary"
              buttonClassName="!text-primary "
            />
          </View>
          <View className="flex-1">
            <Button label="View Details" onPress={() => setIsActiveDetailsOpen(true)} variant="primary" />
          </View>
        </View>
      </View>
    </>
  );
};

DriverActiveOrderCard.displayName = "Driver Active Order Card";
export default DriverActiveOrderCard;
