import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Linking,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { useDriverActiveAssignedOrdersQuery } from "../hooks/queries/useDriverQueries";
import { useUpdateDriverOrderStatusMutation } from "../hooks/mutations/useDriverMutations";
import ExceptionModal from "./ExceptionModal";

export default function DriverActiveOrder() {
  const { token } = useAuth();

  // 1. QUERY & MUTATION
  const { data: ordersList, isLoading, refetch } = useDriverActiveAssignedOrdersQuery(token || "");
  const updateStatusMutation = useUpdateDriverOrderStatusMutation(token || "");

  // 2. STATE VARIABLES
  const [otpInput, setOtpInput] = useState("");
  const [collectedAmount, setCollectedAmount] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [isNoteExpanded, setIsNoteExpanded] = useState(false);
  const [exceptionType, setExceptionType] = useState<string | null>(null);

  // Take the most recent order assigned to this driver
  const order = Array.isArray(ordersList) ? ordersList[0] : null;

  // COMPUTE DETAILS
  const orderId = order?.id || "";
  const customerName = order?.customer_name || order?.customer?.name || "N/A";
  const customerPhone = order?.customer_phone || order?.phone || "N/A";
  const customerAddress = order?.customer_address || order?.address || "N/A";
  const deliveryNoteText = order?.initial_note || order?.note || "No specific instructions provided.";

  const isPrepaid = order?.payment_status?.toLowerCase() === "paid";
  const paymentMethod =
    order?.payment_method?.toLowerCase() === "cod" ||
    order?.payment_method?.toLowerCase() === "cash" ||
    !isPrepaid
      ? "Cash"
      : "Prepaid";

  const totalAmount = parseFloat(order?.amount || order?.total_due_amount || 0);
  const details = order?.detail || [];
  const itemCount = details.reduce((sum: number, item: any) => sum + (item.qty || 1), 0) || 1;

  // LIFECYCLE STEP CALCULATION
  const apiStatusSequence = ["accepted", "picked_up", "on_route", "arrived", "delivered"];
  const orderStatus = order?.status?.toLowerCase() || "";

  const statusToStep: Record<string, number> = {
    accepted: 0,
    picked_up: 1,
    "picked up": 1,
    on_route: 2,
    "en route": 2,
    arrived: 3,
    delivered: 4,
    completed: 4,
  };
  const currentStep = statusToStep[orderStatus] ?? 0;
  const isAtArrived = currentStep === 3;

  // HANDLERS
  const handleLifecycleNext = () => {
    if (!orderId || updateStatusMutation.isPending) return;

    const nextApiStatus = apiStatusSequence[currentStep + 1];
    if (!nextApiStatus || currentStep >= 3) return; // step 4 is delivered, handled by handleConfirmDelivery

    const displayLabel = ["Picked Up", "On Route", "Arrived", "Delivered"][currentStep];

    Alert.alert("Update Status", `Confirm changing order status to "${displayLabel}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Update",
        onPress: () => {
          const fd = new FormData();
          fd.append("status", nextApiStatus);
          updateStatusMutation.mutate(
            { orderId, formData: fd },
            {
              onSuccess: () => {
                Alert.alert("Success", `Status updated to ${displayLabel}`);
              },
              onError: (err: any) => {
                const errMsg = err?.data?.message || err?.message || "Failed to update status";
                Alert.alert("Error", errMsg);
              },
            }
          );
        },
      },
    ]);
  };

  const handleConfirmDelivery = () => {
    if (!orderId || updateStatusMutation.isPending) return;

    if (isAtArrived && !otpInput.trim()) {
      Alert.alert("OTP Required", "Please enter the customer validation OTP.");
      return;
    }

    Alert.alert("Confirm Delivery", "Mark this order as Delivered?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Confirm",
        onPress: () => {
          const fd = new FormData();
          fd.append("status", "delivered");
          if (otpInput.trim()) fd.append("delivery_otp", otpInput.trim());
          if (deliveryNote.trim()) fd.append("delivery_notes", deliveryNote.trim());
          if (collectedAmount) fd.append("cash_collected", collectedAmount);

          updateStatusMutation.mutate(
            { orderId, formData: fd },
            {
              onSuccess: () => {
                setOtpInput("");
                setCollectedAmount("");
                setDeliveryNote("");
                Alert.alert("Delivered", "Order has been marked as delivered successfully!");
              },
              onError: (err: any) => {
                const errMsg = err?.data?.message || err?.message || "Invalid OTP. Please check with customer.";
                Alert.alert("Error", errMsg);
              },
            }
          );
        },
      },
    ]);
  };

  const handleExceptionSubmit = (reason: string, description: string = "") => {
    if (!orderId || updateStatusMutation.isPending) return;

    const statusMap: Record<string, string> = {
      "Delivery Failed": "failed",
      "Cancellation Requested": "cancel_requested",
      "Order Damaged": "failed",
    };

    const targetStatus = statusMap[exceptionType || ""] || "failed";

    const fd = new FormData();
    fd.append("status", targetStatus);
    fd.append("failure_reason", reason);
    if (description) fd.append("failure_description", description);

    updateStatusMutation.mutate(
      { orderId, formData: fd },
      {
        onSuccess: () => {
          setExceptionType(null);
          Alert.alert("Success", `Reported exception successfully: ${reason}`);
        },
        onError: (err: any) => {
          setExceptionType(null);
          const errMsg = err?.data?.message || err?.message || "Failed to submit exception";
          Alert.alert("Error", errMsg);
        },
      }
    );
  };

  const handleRetry = () => {
    if (!orderId || updateStatusMutation.isPending) return;

    Alert.alert("Reset Delivery", "Reset status back to On Route?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Reset",
        onPress: () => {
          const fd = new FormData();
          fd.append("status", "on_route");
          updateStatusMutation.mutate(
            { orderId, formData: fd },
            {
              onSuccess: () => {
                Alert.alert("Reset Completed", "Delivery status reset to On Route");
              },
              onError: (err: any) => {
                const errMsg = err?.data?.message || err?.message || "Failed to reset status";
                Alert.alert("Error", errMsg);
              },
            }
          );
        },
      },
    ]);
  };

  const handleGetRoute = () => {
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
            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`
          );
        }
      });
    } else {
      Alert.alert("Address Missing", "No delivery address available for route navigation.");
    }
  };

  const handleQuickSMS = (msg: string) => {
    if (customerPhone !== "N/A") {
      const url = `sms:${customerPhone}${Platform.OS === "ios" ? "&" : "?"}body=${encodeURIComponent(msg)}`;
      Linking.openURL(url).catch(() => {
        Alert.alert("Error", "Could not launch SMS app.");
      });
    }
  };

  // 3. RENDER STATES
  // SKELETON/LOADING STATE
  if (isLoading) {
    return (
      <View key="loading" className="bg-base-300 border border-base-200 rounded-2xl p-6 shadow-sm min-h-[300px] items-center justify-center">
        <ActivityIndicator size="large" color="#DC2D2A" />
        <Text className="text-xs font-semibold text-accent mt-3">Loading Active Delivery Task...</Text>
      </View>
    );
  }

  // EMPTY STATE
  if (!order) {
    return (
      <View key="empty" className="bg-base-300 border border-base-200 rounded-2xl p-8 shadow-sm items-center justify-center min-h-[250px]">
        <View className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center mb-4">
          <Feather name="box" size={24} color="#6E6E6E" />
        </View>
        <Text className="text-sm font-black text-slate-800 uppercase tracking-wider mb-1">
          No Active Task Assigned
        </Text>
        <Text className="text-xs text-accent text-center max-w-[240px] leading-5">
          New delivery tasks assigned by the kitchen will appear here automatically. Keep availability set to "Available".
        </Text>
      </View>
    );
  }

  // LOADED STATE
  return (
    <View key="loaded" className="flex-col gap-6">
      {/* EXCEPTION MODAL */}
      <ExceptionModal
        visible={!!exceptionType}
        title={exceptionType || "Exception"}
        onClose={() => setExceptionType(null)}
        onSubmit={handleExceptionSubmit}
        isLoading={updateStatusMutation.isPending}
      />

      {/* Main Task Box */}
      <View className="bg-base-300 border border-base-200 rounded-2xl p-5 shadow-sm">
        {/* Header Title Info */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 bg-slate-900 rounded-xl items-center justify-center shadow-md">
              <Feather name="navigation" size={18} color="white" />
            </View>
            <View>
              <Text className="text-md font-black text-neutral">#ORD-{order.id}</Text>
              <Text className="text-[9px] font-bold text-accent uppercase tracking-wider mt-0.5">
                Active Delivery Task
              </Text>
            </View>
          </View>
          <View className="px-3 py-1 bg-amber-50 rounded-full border border-amber-100 flex-row items-center gap-1.5">
            <View className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <Text className="text-[9px] font-black text-amber-600 uppercase tracking-wide">Live</Text>
          </View>
        </View>

        {/* SECTION: Delivery Steps Pipeline */}
        <View className="mb-6 px-1.5">
          <View className="flex-row justify-between items-center mb-4 relative">
            {/* Horizontal Line Connections */}
            <View className="absolute left-4 right-4 top-4 h-[2px] bg-slate-100 z-0" />
            <View
              style={{ width: `${currentStep * 25}%` }}
              className="absolute left-4 top-4 h-[2px] bg-emerald-500 z-0"
            />

            {["Accepted", "Picked Up", "En Route", "Arrived", "Delivered"].map((step, idx) => {
              const isPassed = idx < currentStep;
              const isActive = idx === currentStep;

              return (
                <View key={step} className="items-center flex-1">
                  <View
                    className={`w-8 h-8 rounded-full items-center justify-center z-10 border-2 ${
                      isPassed
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : isActive
                        ? "bg-slate-900 border-slate-900 text-white"
                        : "bg-base-300 border-slate-100 text-slate-400"
                    }`}
                  >
                    {isPassed ? (
                      <Feather name="check" size={12} color="white" />
                    ) : (
                      <Text className="text-[10px] font-black">{idx + 1}</Text>
                    )}
                  </View>
                  <Text
                    className={`text-[8px] font-black uppercase mt-1.5 tracking-wider ${
                      isActive ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {step}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* OTP pad rendering */}
          {isAtArrived && (
            <View className="bg-amber-50/50 border border-amber-100 rounded-xl p-3 mb-4">
              <Text className="text-[9px] font-black text-amber-700 uppercase tracking-widest mb-1.5">
                Verification: Enter Customer OTP
              </Text>
              <TextInput
                value={otpInput}
                onChangeText={(val) => setOtpInput(val.replace(/\D/g, ""))}
                placeholder="4-digit OTP"
                placeholderTextColor="#9ca3af"
                maxLength={4}
                keyboardType="number-pad"
                className="bg-white border border-amber-200 rounded-lg py-2 px-3 text-center font-black text-md tracking-[0.4em] text-slate-800"
              />
            </View>
          )}

          {/* Core progression action button */}
          <TouchableOpacity
            onPress={isAtArrived ? handleConfirmDelivery : handleLifecycleNext}
            disabled={currentStep >= 4 || updateStatusMutation.isPending}
            activeOpacity={0.8}
            className={`w-full py-3.5 rounded-xl flex-row justify-center items-center gap-1.5 shadow-sm ${
              updateStatusMutation.isPending || currentStep >= 4 ? "bg-slate-200" : "bg-slate-900"
            }`}
          >
            {updateStatusMutation.isPending ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <>
                <Text className="text-white text-xs font-black uppercase tracking-wider">
                  {currentStep >= 4
                    ? "Delivery Completed"
                    : isAtArrived
                    ? "Confirm Delivery"
                    : `Next: ${["Picked Up", "On Route", "Arrived"][currentStep]}`}
                </Text>
                {currentStep < 3 && <Feather name="arrow-right" size={14} color="white" />}
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Customer Call & SMS Panel */}
        <View className="bg-base-200 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center">
              <Feather name="user" size={16} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Customer Info
              </Text>
              <View className="flex-row justify-between items-center mt-1">
                <Text className="font-bold text-sm text-neutral">{customerName}</Text>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => Linking.openURL(`tel:${customerPhone}`)}
                    className="w-8 h-8 rounded-lg bg-emerald-50 items-center justify-center border border-emerald-100"
                  >
                    <Feather name="phone" size={13} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleQuickSMS("I am on my way with your order.")}
                    className="w-8 h-8 rounded-lg bg-blue-50 items-center justify-center border border-blue-100"
                  >
                    <Feather name="message-square" size={13} color="#3b82f6" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row gap-2 mt-4 flex-wrap">
            {["I am on my way.", "I have arrived.", "Please call back."].map((msg) => (
              <TouchableOpacity
                key={msg}
                onPress={() => handleQuickSMS(msg)}
                className="px-3 py-2 bg-white rounded-lg border border-slate-100 active:bg-slate-50"
              >
                <Text className="text-[9px] font-black text-slate-500 uppercase tracking-wide">
                  {msg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address and Route Launch Panel */}
        <View className="bg-base-200 rounded-2xl p-4 mb-4">
          <View className="flex-row items-start gap-3">
            <View className="w-8 h-8 rounded-lg bg-rose-50 items-center justify-center">
              <Feather name="map-pin" size={16} color="#ef4444" />
            </View>
            <View className="flex-1">
              <Text className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
                Delivery Address
              </Text>
              <Text className="font-bold text-xs text-neutral mt-1 leading-4">
                {customerAddress}
              </Text>

              <TouchableOpacity
                onPress={() => setIsNoteExpanded(!isNoteExpanded)}
                className="mt-2 flex-row items-center gap-1"
              >
                <Text className="text-[8px] font-black text-primary uppercase tracking-wider">
                  {isNoteExpanded ? "Hide Instructions" : "View Instructions"}
                </Text>
                <Feather name={isNoteExpanded ? "chevron-up" : "chevron-down"} size={10} color="#DC2D2A" />
              </TouchableOpacity>

              {isNoteExpanded && (
                <Text className="text-[10px] text-slate-500 mt-2 bg-white p-3 rounded-lg border border-slate-100 italic leading-4">
                  "{deliveryNoteText}"
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleGetRoute}
            className="w-full mt-4 py-2.5 bg-white border border-slate-200 rounded-xl flex-row items-center justify-center gap-1.5 active:bg-slate-50"
          >
            <Feather name="navigation" size={14} color="#000000" />
            <Text className="text-xs font-bold text-neutral">Get Route Navigation</Text>
          </TouchableOpacity>
        </View>

        {/* Dish Items Breakdown Panel */}
        <View className="bg-base-200 rounded-2xl p-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-[9px] font-black text-slate-400 uppercase tracking-wider">
              Order Items ({itemCount})
            </Text>
            <View className="flex-row items-center gap-1.5">
              <Text className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                paymentMethod === "Cash" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
              }`}>
                {paymentMethod}
              </Text>
              <Text className="font-black text-xs text-slate-800">
                £{totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="flex-col gap-1.5">
            {details.map((item: any, idx: number) => {
              const title = item.dish?.name || item.meal?.name || "Unknown Dish Item";
              const qty = item.qty || 1;
              return (
                <View
                  key={item.id || idx}
                  className="flex-row justify-between items-center bg-white border border-slate-100 rounded-xl p-2.5"
                >
                  <Text className="text-[10px] font-bold text-slate-700 flex-1 mr-2 truncate">
                    {title}
                  </Text>
                  <View className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
                    <Text className="text-[9px] font-black text-slate-600">{qty}x</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* SECTION: Cash Collection / Tip Input Drawer */}
      <View className="bg-base-300 border border-base-200 rounded-2xl p-5 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm font-black text-neutral uppercase tracking-wider">
            Payment Handling
          </Text>
          {paymentMethod === "Cash" ? (
            <View className="bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              <Text className="text-[8px] font-black text-amber-600 uppercase">Cash On Delivery</Text>
            </View>
          ) : (
            <View className="bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <Text className="text-[8px] font-black text-emerald-600 uppercase">Prepaid</Text>
            </View>
          )}
        </View>

        {paymentMethod === "Cash" ? (
          <View className="bg-amber-50/20 border border-amber-100 rounded-xl p-4">
            <Text className="text-xs font-semibold text-amber-800 mb-2">Record Collected Cash</Text>
            <View className="relative justify-center">
              <Text className="absolute left-3 font-black text-slate-400 text-sm">£</Text>
              <TextInput
                value={collectedAmount}
                onChangeText={setCollectedAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor="#9ca3af"
                className="bg-white border border-slate-200 rounded-xl py-3 pl-8 pr-4 text-slate-800 font-black text-sm"
              />
            </View>
            <TouchableOpacity
              onPress={handleConfirmDelivery}
              disabled={updateStatusMutation.isPending || !collectedAmount}
              className="w-full mt-3 bg-slate-900 py-3 rounded-xl items-center"
            >
              <Text className="text-white text-xs font-black uppercase tracking-wider">Confirm Payment</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="p-4 bg-emerald-50/20 border border-emerald-100 rounded-xl items-center gap-2">
            <Feather name="shield" size={20} color="#10b981" />
            <Text className="text-xs font-black text-emerald-700 uppercase tracking-wide">
              Payment Already Collected
            </Text>
          </View>
        )}
      </View>

      {/* SECTION: Exception Action list drawer */}
      <View className="bg-base-300 border border-base-200 rounded-2xl p-5 shadow-sm">
        <View className="flex-row items-center gap-2 mb-4">
          <Feather name="alert-circle" size={16} color="#ef4444" />
          <Text className="text-sm font-black text-slate-800 uppercase tracking-wider">
            Help & Delivery Exceptions
          </Text>
        </View>

        <View className="flex-row flex-wrap gap-2">
          <TouchableOpacity
            onPress={() => setExceptionType("Delivery Failed")}
            className="flex-1 min-w-[100px] p-3.5 bg-rose-50 border border-rose-100 rounded-xl items-center gap-1.5"
          >
            <Feather name="slash" size={16} color="#ef4444" />
            <Text className="text-[9px] font-black text-rose-600 uppercase text-center">Failed Task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => Alert.alert("Wrong Address", "Please call the customer to verify details.")}
            className="flex-1 min-w-[100px] p-3.5 bg-amber-50 border border-amber-100 rounded-xl items-center gap-1.5"
          >
            <Feather name="map-pin" size={16} color="#f59e0b" />
            <Text className="text-[9px] font-black text-amber-600 uppercase text-center">Wrong Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setExceptionType("Order Damaged")}
            className="flex-1 min-w-[100px] p-3.5 bg-orange-50 border border-orange-100 rounded-xl items-center gap-1.5"
          >
            <Feather name="box" size={16} color="#f97316" />
            <Text className="text-[9px] font-black text-orange-600 uppercase text-center">Damaged</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleRetry}
            className="flex-1 min-w-[100px] p-3.5 bg-blue-50 border border-blue-100 rounded-xl items-center gap-1.5"
          >
            <Feather name="refresh-cw" size={16} color="#3b82f6" />
            <Text className="text-[9px] font-black text-blue-600 uppercase text-center">Reset Step</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setExceptionType("Cancellation Requested")}
            className="flex-1 min-w-[100px] p-3.5 bg-slate-50 border border-slate-200 rounded-xl items-center gap-1.5"
          >
            <Feather name="x" size={16} color="#6E6E6E" />
            <Text className="text-[9px] font-black text-slate-500 uppercase text-center">Cancel Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
