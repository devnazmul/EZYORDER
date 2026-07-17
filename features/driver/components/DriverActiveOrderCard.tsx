import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { DriverOrder } from "../types";

interface DriverActiveOrderCardProps {
  activeOrder: DriverOrder;
  isLoading: boolean;
  updateStatusMutation: any;
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
}: DriverActiveOrderCardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [otpInput, setOtpInput] = useState("");
  const [collectedAmount, setCollectedAmount] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);

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
  }, [activeOrder]);

  const handleQuickSMS = (msg: string) => {
    const customerPhone = activeOrder?.customer_phone;
    if (customerPhone !== "N/A") {
      const url = `sms:${customerPhone}${Platform.OS === "ios" ? "&" : "?"}body=${encodeURIComponent(msg)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Could not launch SMS app.");
      });
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
      Alert.alert("Address Missing", "No delivery address available for route navigation.");
    }
  };

  const handleUpdateOrderStatus = () => {
    if (!activeOrder?.id || updateStatusMutation.isPending) return;
    if (currentStep < 3) {
      const nextApiStatus = DELIVERY_STATUS_KEYS[currentStep + 1];
      if (!nextApiStatus) return;
      const nextStatusInfo = DELIVERY_STATUSES_MAP[nextApiStatus];
      const displayLabel = nextStatusInfo?.title || "";

      Alert.alert("Update Status", `Confirm changing order status to "${displayLabel}"?`, [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            const orderId = activeOrder.id;
            const data = new FormData();
            data.append("status", nextApiStatus);

            updateStatusMutation.mutate(
              { orderId, formData: data },
              {
                onSuccess: () => {
                  Alert.alert("Success", `Status updated to ${displayLabel}`);
                },
                onError: (err: any) => {
                  const errMsg = err?.data?.message || err?.message || "Failed to update status";
                  Alert.alert("Error", errMsg);
                },
              },
            );
          },
        },
      ]);
    } else {
      if (!otpInput.trim()) {
        Alert.alert("OTP Required", "Please enter the customer validation OTP.");
        return;
      }

      Alert.alert("Confirm Delivery", "Mark this order as Delivered?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            const orderId = activeOrder.id;
            const data = new FormData();
            data.append("status", "delivered");

            if (otpInput.trim()) data.append("delivery_otp", otpInput.trim());
            if (deliveryNote.trim()) data.append("delivery_notes", deliveryNote.trim());
            if (collectedAmount) data.append("cash_collected", collectedAmount);

            updateStatusMutation.mutate(
              { orderId, formData: data },
              {
                onSuccess: () => {
                  setOtpInput("");
                  setCollectedAmount("");
                  setDeliveryNote("");
                  Alert.alert("Delivered", "Order has been marked as delivered successfully!");
                },
                onError: (err: any) => {
                  const errMsg =
                    err?.data?.message || err?.message || "Invalid OTP. Please check with customer.";
                  Alert.alert("Error", errMsg);
                },
              },
            );
          },
        },
      ]);
    }
  };

  if (isLoading) {
    const Bone = ({ className, style }: { className?: string; style?: any }) => (
      <View className={`bg-slate-200 rounded-md ${className || ""}`} style={style} />
    );

    return (
      <Animated.View key="loading" style={{ opacity: pulse }} className="w-full">
        {/* Header */}
        <View className="mb-2 flex-row items-start justify-between">
          <Bone className="h-4 w-24" />
          <Bone className="h-4 w-8" />
        </View>
        <View className="mb-4 flex-row items-start justify-between">
          <Bone className="h-3.5 w-16" />
          <Bone className="h-3.5 w-10" />
        </View>

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
          <Bone className="w-full h-14 rounded-md" />
        </View>

        {/* Payment banner */}
        <Bone className="w-full h-10 rounded-2xl mb-3" />

        {/* Customer info card */}
        <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <Bone className="w-9 h-9 rounded-full" />
              <View>
                <Bone className="h-3.5 w-28 mb-1.5" />
                <Bone className="h-2.5 w-20" />
              </View>
            </View>
            <View className="flex-row gap-2">
              <Bone className="w-10 h-10 rounded-full" />
              <Bone className="w-10 h-10 rounded-full" />
            </View>
          </View>
          <View className="flex-row gap-2">
            <Bone className="h-6 w-24 rounded-full" />
            <Bone className="h-6 w-20 rounded-full" />
            <Bone className="h-6 w-24 rounded-full" />
          </View>
        </View>

        {/* Address card */}
        <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
          <View className="flex-row items-start gap-3">
            <Bone className="w-9 h-9 rounded-full" />
            <View className="flex-1">
              <Bone className="h-2.5 w-28 mb-2" />
              <Bone className="h-3.5 w-full mb-1.5" />
              <Bone className="h-3.5 w-2/3" />
            </View>
          </View>
          <Bone className="w-full h-11 rounded-xl mt-4" />
        </View>
      </Animated.View>
    );
  }

  return (
    <View key="loaded" className="w-full">
      <View className="mb-6 px-1.5">
        <View className="flex-row justify-between items-center mb-4 relative">
          {/* Horizontal Line Connections */}
          <View className="absolute left-4 right-4 top-4 h-[2px] bg-slate-100 z-0" />
          <View
            style={{ width: `${currentStep * 25}%` }}
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
                  className={`text-[8px] font-black capitalize mt-1.5 tracking-wider ${
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

      {activeOrder?.payment_status !== "paid" && Number(activeOrder?.total_due_amount) > 0 && (
        <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-3 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="payments" size={16} color="#d97706" />
            <Text className="text-[11px] font-bold text-amber-700">Cash to Collect</Text>
          </View>
          <Text className="text-sm font-black text-amber-700">£{Number(activeOrder?.amount).toFixed(0)}</Text>
        </View>
      )}

      {/* Customer Call & SMS Panel */}
      <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <View className="w-9 h-9 rounded-full bg-blue-50 items-center justify-center">
              <MaterialIcons name="person" size={18} color="#3b82f6" />
            </View>
            <View>
              <Text className="font-bold text-sm text-neutral capitalize">{activeOrder?.customer_name}</Text>
              <Text className="text-[10px] text-slate-400 font-medium">{activeOrder?.customer_phone}</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => Linking.openURL(`tel:${activeOrder?.customer_phone}`)}
              className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center active:opacity-80"
            >
              <MaterialIcons name="phone" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleQuickSMS("I am on my way with your order.")}
              className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center active:opacity-80"
            >
              <MaterialIcons name="message" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {activeOrder?.customer_note ? (
          <View className="flex-row items-start gap-1.5 mb-3 px-3 py-2 bg-blue-50/50 rounded-lg">
            <MaterialIcons name="chat-bubble-outline" size={12} color="#3b82f6" style={{ marginTop: 1 }} />
            <Text className="text-[10px] text-blue-700 leading-4 flex-1">{activeOrder.customer_note}</Text>
          </View>
        ) : null}

        <View className="flex-row gap-2 flex-wrap">
          {["I am on my way.", "I have arrived.", "Please call back."].map((msg) => (
            <TouchableOpacity
              key={msg}
              onPress={() => handleQuickSMS(msg)}
              className="px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100 active:bg-slate-100"
            >
              <Text className="text-[9px] font-bold text-slate-500">{msg}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Address and Route Launch Panel */}
      <View className="bg-white rounded-2xl p-4 mb-4 border border-slate-100 shadow-sm">
        <View className="flex-row items-start gap-3 mb-1">
          <View className="w-9 h-9 rounded-full bg-rose-50 items-center justify-center mt-0.5">
            <MaterialIcons name="location-pin" size={18} color="#ef4444" />
          </View>
          <View className="flex-1">
            <View className="flex-row items-center justify-between">
              <Text className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Delivery Address
              </Text>
              {activeOrder?.latitude && activeOrder?.longitude && (
                <View className="flex-row items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded-full">
                  <MaterialIcons name="gps-fixed" size={9} color="#10b981" />
                  <Text className="text-[8px] font-bold text-emerald-600">GPS Pinned</Text>
                </View>
              )}
            </View>
            <Text className="font-bold text-xs text-neutral mt-1 leading-4">
              {activeOrder?.door_no ? `${activeOrder.door_no}, ` : ""}
              {activeOrder?.customer_address}
              {activeOrder?.customer_post_code ? ` — ${activeOrder.customer_post_code}` : ""}
            </Text>
          </View>
        </View>

        {activeOrder?.initial_note ? (
          <TouchableOpacity
            onPress={() => setIsNoteExpanded(!isNoteExpanded)}
            activeOpacity={0.7}
            className="mt-3 ml-12 border border-slate-100 rounded-xl overflow-hidden"
          >
            <View className="flex-row items-center justify-between px-3 py-2 bg-slate-50">
              <Text className="text-[9px] font-black text-slate-500 uppercase tracking-wider">
                Delivery Instructions
              </Text>
              <MaterialIcons
                name={isNoteExpanded ? "expand-less" : "expand-more"}
                size={16}
                color="#94a3b8"
              />
            </View>
            {isNoteExpanded && (
              <Text className="text-[10px] text-slate-500 px-3 py-2.5 leading-4 italic bg-white">
                {activeOrder.initial_note}
              </Text>
            )}
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={handleGetRoute}
          className="w-full mt-4 py-3 bg-primary rounded-xl flex-row items-center justify-center gap-2 active:opacity-80"
        >
          <MaterialIcons name="navigation" size={16} color="white" />
          <Text className="text-xs font-bold text-white">Get Route Navigation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

DriverActiveOrderCard.displayName = "Driver Active Order Card";
export default DriverActiveOrderCard;
