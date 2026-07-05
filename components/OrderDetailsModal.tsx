import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "./reuseable/Button";

interface OrderDetailsModalProps {
  visible: boolean;
  order: any;
  onClose: () => void;
}

export default function OrderDetailsModal({
  visible,
  order,
  onClose,
}: OrderDetailsModalProps) {
  if (!order) return null;

  // Helper to extract items description
  const getOrderItemsText = (o: any) => {
    if (!o) return "";
    if (o.items_summary) return o.items_summary;
    const detailList = o.detail || o.details;
    if (Array.isArray(detailList) && detailList.length > 0) {
      return detailList
        .map((d: any) => `${d.qty || d.quantity || 1}x ${d.dish?.name || d.dish_name || "Item"}`)
        .join(", ");
    }
    return o.description || "";
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
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
            <TouchableOpacity onPress={onClose} className="p-1 hover:bg-base-200 rounded-full">
              <MaterialIcons name="close" size={24} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          {/* Modal Body Scroll View */}
          <ScrollView showsVerticalScrollIndicator={false} className="gap-y-4">
            {/* Customer Information */}
            <View className="gap-y-2">
              <Text className="text-xs font-bold text-accent uppercase tracking-wider">
                Customer Details
              </Text>
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
                {(order.customer_phone || order.user?.phone) && (
                  <View className="flex-row justify-between">
                    <Text className="text-xs text-accent">Phone:</Text>
                    <Text className="text-xs font-bold text-neutral">
                      {order.customer_phone || order.user?.phone}
                    </Text>
                  </View>
                )}
                <View className="flex-row justify-between">
                  <Text className="text-xs text-accent">Time:</Text>
                  <Text className="text-xs font-bold text-neutral">
                    {order.created_at || "--:--"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Items details list */}
            <View className="gap-y-2 mt-4">
              <Text className="text-xs font-bold text-accent uppercase tracking-wider">Order Items</Text>
              <View className="bg-base-100 rounded-xl p-4 border border-base-200 gap-y-3">
                <View className="border-b border-base-200 pb-2">
                  <Text className="text-xs text-neutral leading-5 font-semibold">
                    {getOrderItemsText(order)}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center pt-1">
                  <Text className="text-xs font-bold text-neutral">Total Amount:</Text>
                  <Text className="text-md font-bold text-primary">
                    £{parseFloat(order.amount || order.final_price || "0").toFixed(2)}
                  </Text>
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
