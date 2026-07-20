import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Button from "@/components/reuseable/Button";
import { DriverOrder } from "../types";

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
  if (!order) return null;

  const parsePrice = (val: any) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const parsed = parseFloat(String(val).replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "delivered" || s === "completed") {
      return { bg: "bg-emerald-50 border-emerald-100", text: "text-emerald-700" };
    }
    if (s === "cancelled" || s === "failed") {
      return { bg: "bg-rose-50 border-rose-100", text: "text-rose-700" };
    }
    return { bg: "bg-amber-50 border-amber-100", text: "text-amber-700" };
  };

  const statusColors = getStatusColor(order.status);
  const itemsCount = order.detail?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        {/* Backdrop Tap to close */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0 w-full h-full"
        />

        <View className="bg-base-300 w-full max-h-[85%] rounded-t-lg p-6 border-t border-slate-100/10 shadow-2xl">
          {/* Top Drag Handle */}
          <View className="w-12 h-1 bg-slate-200 rounded-full self-center mb-5" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-5">
            <View>
              <Text className="text-xl font-bold text-slate-900">#ORD-{order.id}</Text>
              <Text className="text-[10px] text-slate-400 font-semibold capitalize tracking-wider mt-0.5">
                Full order details
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className={`px-2.5 py-1 rounded-full border ${statusColors.bg}`}>
                <Text className={`text-[10px] font-bold capitalize tracking-wider ${statusColors.text}`}>
                  {order.status}
                </Text>
              </View>
              <TouchableOpacity
                onPress={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
              >
                <MaterialIcons name="close" size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="mb-6">
            {/* Customer Section */}
            <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mb-3 flex-row items-center gap-1">
                <MaterialIcons name="person-outline" size={12} color="#94a3b8" /> Customer info
              </Text>
              <View className="space-y-3.5">
                <View>
                  <Text className="text-[9px] font-semibold text-slate-400 capitalize tracking-wider">
                    Full name
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5">
                    {order.customer_name || "N/A"}
                  </Text>
                </View>
                <View>
                  <Text className="text-[9px] font-semibold text-slate-400 capitalize tracking-wider">
                    Phone number
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5">
                    {order.customer_phone || "N/A"}
                  </Text>
                </View>
                {order.customer_note ? (
                  <View>
                    <Text className="text-[9px] font-semibold text-slate-400 capitalize tracking-wider">
                      Customer note
                    </Text>
                    <Text className="text-sm font-bold text-slate-800 mt-0.5 italic leading-4">
                      "{order.customer_note}"
                    </Text>
                  </View>
                ) : null}
                <View>
                  <Text className="text-[9px] font-semibold text-slate-400 capitalize tracking-wider">
                    Delivery address
                  </Text>
                  <Text className="text-sm font-bold text-slate-800 mt-0.5 leading-4">
                    {order.door_no ? `${order.door_no}, ` : ""}
                    {order.customer_address}
                    {order.customer_post_code ? ` — ${order.customer_post_code}` : ""}
                  </Text>
                </View>
              </View>
            </View>

            {/* Order Items Section */}
            <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
              <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mb-3">
                Items summary ({itemsCount} items)
              </Text>
              <View className="space-y-2">
                {order.detail?.map((item, idx) => {
                  const title = item.dish?.name || item.meal?.name || "Premium Item";
                  const qty = item.qty || 1;
                  const unitPrice = parsePrice(item.main_price ?? item.price ?? item.dish_price);
                  const totalPrice = unitPrice * qty;

                  return (
                    <View key={item.id || idx} className="bg-slate-50 border border-slate-100 rounded-lg p-3">
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
            </View>

            {/* Instruction / Note */}
            {order.initial_note ? (
              <View className="bg-white rounded-lg p-4 mb-4 border border-slate-100">
                <Text className="text-[10px] font-bold text-slate-400 capitalize tracking-widest mb-2">
                  Kitchen/delivery notes
                </Text>
                <Text className="text-xs font-bold text-slate-500 italic leading-4">
                  "{order.initial_note}"
                </Text>
              </View>
            ) : null}

            {/* Totals Section */}
            <View className="bg-slate-900 rounded-lg p-4 border border-slate-950">
              <View className="flex-row justify-between items-center pb-3 border-b border-white/10 mb-3">
                <Text className="text-[9px] font-semibold text-white/50 capitalize tracking-wider">
                  Payment status
                </Text>
                <Text className="text-[10px] font-bold text-emerald-400 capitalize tracking-wider">
                  {order.payment_status || "Unpaid"}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-[9px] font-semibold text-white/40 capitalize tracking-widest mb-0.5">
                    Total amount
                  </Text>
                  <Text className="text-2xl font-bold text-white tracking-tight">
                    {formatAmount(order.amount || order.total_due_amount || "0", currencySymbol)}
                  </Text>
                </View>
                <View className="w-10 h-10 bg-white/10 rounded-lg items-center justify-center">
                  <MaterialIcons name="payment" size={20} color="white" />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Action Button */}
          <Button label="Close Details" onPress={onClose} variant="primary" />
        </View>
      </View>
    </Modal>
  );
}
