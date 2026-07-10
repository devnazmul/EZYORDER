import Button from "@/components/reuseable/Button";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface OrderDetailsModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({ visible, order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  const detailItems = order.detail || order.details || [];

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-neutral/50">
        <View className="bg-base-300 rounded-t-3xl p-6 max-h-[80%] border-t border-base-200 shadow-2xl gap-y-4">
          {/* Modal Header */}
          <View className="flex-row justify-between items-center border-b border-base-200 pb-3">
            <View className="gap-y-1">
              <Text className="text-lg font-bold text-neutral">Order #{order.id}</Text>
              <Text className="text-xs text-accent">
                Type: <Text className="font-bold uppercase text-primary">{order.type}</Text>
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} className="p-1 rounded-full">
              <MaterialIcons name="close" size={24} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          {/* Modal Body Scroll View */}
          <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
            {/* Customer Information */}
            <View className="gap-y-2">
              <Text className="text-xs font-bold text-accent uppercase tracking-wider">Customer Details</Text>
              <View className="bg-base-100 rounded-xl p-4 gap-y-2 border border-base-200">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-accent">Name:</Text>
                  <Text className="text-xs font-bold text-neutral">
                    {order.customer_name ||
                      order.user?.first_Name ||
                      (order.table_number && parseFloat(order.table_number) > 0
                        ? `Table ${parseFloat(order.table_number)}`
                        : "Walk-in Customer")}
                  </Text>
                </View>
                {order.customer_phone || order.user?.phone ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Phone:</Text>
                    <Text className="text-xs font-bold text-neutral">
                      {order.customer_phone || order.user?.phone}
                    </Text>
                  </View>
                ) : null}
                <View className="flex-row justify-between">
                  <Text className="text-xs text-accent">Date & Time:</Text>
                  <Text className="text-xs font-bold text-neutral">
                    {order.created_at ? formatDateTime(order.created_at) : "--:--"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Itemized Order Items List */}
            <View className="gap-y-2 mt-4">
              <Text className="text-xs font-bold text-accent uppercase tracking-wider">Order Items</Text>
              <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-0">
                {detailItems.length > 0 ? (
                  detailItems.map((item: any, index: number) => {
                    const dishName = item.dish?.name || item.dish_name || "Item";
                    const qty = item.qty || item.quantity || 1;
                    const price = item.dish?.price || item.dish_price || "0";

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
                            <Text className="text-[10px] text-accent mt-0.5">{formatAmount(price)} each</Text>
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
                          {formatAmount(String(qty * parseFloat(String(price))))}
                        </Text>
                      </View>
                    );
                  })
                ) : (
                  <Text className="text-xs text-accent text-center py-2">No items </Text>
                )}
              </View>
            </View>

            {/* Bill Summary */}
            <View className="gap-y-2 mt-4">
              <Text className="text-xs font-bold text-accent uppercase tracking-wider">Bill Summary</Text>
              <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-xs text-accent">Subtotal:</Text>
                  <Text className="text-xs font-semibold text-neutral">
                    {formatAmount(order.final_price || "0")}
                  </Text>
                </View>

                {order.tax && parseFloat(order.tax) > 0 ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Tax:</Text>
                    <Text className="text-xs font-semibold text-neutral">{formatAmount(order.tax)}</Text>
                  </View>
                ) : null}

                {order.tip_amount && parseFloat(order.tip_amount) > 0 ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Tip:</Text>
                    <Text className="text-xs font-semibold text-neutral">
                      {formatAmount(order.tip_amount)}
                    </Text>
                  </View>
                ) : null}

                {order.discount && parseFloat(order.discount) > 0 ? (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Discount:</Text>
                    <Text className="text-xs font-semibold text-green-600">
                      -{formatAmount(order.discount)}
                    </Text>
                  </View>
                ) : null}

                <View className="border-t border-base-200 pt-2 mt-1 flex-row justify-between items-center">
                  <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
                  <Text className="text-md font-bold text-primary">{formatAmount(order.amount || "0")}</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Close Action Button */}
          <Button label="Close Details" onPress={onClose} variant="primary" containerClassName="mt-2" />
        </View>
      </View>
    </Modal>
  );
}
