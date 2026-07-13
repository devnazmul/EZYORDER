import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { useData } from "@/context/context/DataContext";

interface CustomerCardProps {
  customer: any;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  // Compute total spend
  const totalSpend = useMemo(() => {
    const takeaway = parseFloat(customer.total_revenue_takeaway) || 0;
    const delivery = parseFloat(customer.total_revenue_delivery) || 0;
    const eatIn = parseFloat(customer.total_revenue_eat_in) || 0;
    return takeaway + delivery + eatIn;
  }, [customer]);

  const initials = useMemo(() => {
    const first = customer.first_Name ? customer.first_Name.charAt(0) : "";
    const last = customer.last_Name ? customer.last_Name.charAt(0) : "";
    return (first + last).toUpperCase() || "?";
  }, [customer.first_Name, customer.last_Name]);

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}
        className="bg-base-300 rounded-xl border border-base-200 shadow-sm p-4 mb-4"
      >
        {/* Top Header Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            {/* Avatar Icon */}
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center mr-3 overflow-hidden">
              {customer.image ? (
                <Image source={{ uri: customer.image }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text className="text-primary font-bold text-sm">{initials}</Text>
              )}
            </View>

            {/* Customer Main Info */}
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral truncate" numberOfLines={1}>
                {customer.first_Name || ""} {customer.last_Name || ""}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text className="text-[10px] text-accent font-semibold uppercase tracking-wider mr-2">
                  {customer.type || "Guest User"}
                </Text>
                {customer.completed_orders_count > 0 && (
                  <Text className="text-[10px] text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">
                    {customer.completed_orders_count} Orders
                  </Text>
                )}
              </View>
            </View>
          </View>

          {/* Right side: Total Spend & Arrow */}
          <View className="flex-row items-center gap-2">
            <View className="items-end">
              <Text className="text-sm font-extrabold text-primary">
                {formatAmount(totalSpend, currencySymbol)}
              </Text>
              <Text className="text-[9px] text-accent mt-0.5 font-bold uppercase">
                Total Spend
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
          </View>
        </View>

        </TouchableOpacity>

      {/* Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          {/* Backdrop clickable to close */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
            className="absolute inset-0"
          />

          {/* Bottom Sheet Container */}
          <View className="bg-base-100 rounded-t-3xl max-h-[85%] border-t border-base-200">
            {/* Header Drag Indicator */}
            <View className="items-center py-3">
              <View className="w-12 h-1.5 bg-neutral/20 rounded-full" />
            </View>

            {/* Modal Title bar */}
            <View className="flex-row items-center justify-between px-6 pb-4 border-b border-base-200/50">
              <Text className="text-lg font-bold text-neutral">Customer Details</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="w-8 h-8 rounded-full bg-base-300 items-center justify-center"
              >
                <MaterialIcons name="close" size={18} color="#6E6E6E" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Main Header */}
              <View className="items-center mb-6">
                <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center overflow-hidden mb-3 border border-base-200">
                  {customer.image ? (
                    <Image source={{ uri: customer.image }} style={{ width: "100%", height: "100%" }} />
                  ) : (
                    <Text className="text-primary font-bold text-2xl">{initials}</Text>
                  )}
                </View>
                <Text className="text-lg font-extrabold text-neutral text-center">
                  {customer.first_Name || ""} {customer.last_Name || ""}
                </Text>
                <Text className="text-xs text-accent uppercase font-bold tracking-widest mt-1">
                  {customer.type || "Guest User"}
                </Text>
              </View>

              {/* Spend & Order KPI block */}
              <View className="flex-row justify-between mb-6 bg-base-300 p-4 rounded-xl border border-base-200">
                <View className="flex-1 items-center border-r border-base-200/80">
                  <Text className="text-lg font-extrabold text-primary">
                    {formatAmount(totalSpend, currencySymbol)}
                  </Text>
                  <Text className="text-[10px] text-accent uppercase font-bold mt-1">
                    Total Spend
                  </Text>
                </View>
                <View className="flex-1 items-center">
                  <Text className="text-lg font-extrabold text-neutral">
                    {customer.completed_orders_count || 0}
                  </Text>
                  <Text className="text-[10px] text-accent uppercase font-bold mt-1">
                    Completed Orders
                  </Text>
                </View>
              </View>

              {/* Details List */}
              <View className="gap-y-4">
                {/* Contact Info */}
                <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                  <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-3">
                    Contact Information
                  </Text>
                  {customer.phone ? (
                    <View className="flex-row items-center mb-2.5">
                      <MaterialIcons name="phone" size={16} color="#6E6E6E" />
                      <Text className="text-xs text-neutral ml-3">{customer.phone}</Text>
                    </View>
                  ) : null}
                  {customer.email ? (
                    <View className="flex-row items-center">
                      <MaterialIcons name="email" size={16} color="#6E6E6E" />
                      <Text className="text-xs text-neutral ml-3">{customer.email}</Text>
                    </View>
                  ) : null}
                </View>

                {/* Orders Breakdown */}
                <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                  <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-3">
                    Orders Breakdown
                  </Text>
                  <View className="flex-row flex-wrap gap-2">
                    {customer.take_away_order_count > 0 && (
                      <View className="bg-base-200 px-3 py-1.5 rounded-lg flex-row items-center">
                        <MaterialIcons name="shopping-bag" size={12} color="#6E6E6E" />
                        <Text className="text-xs text-neutral ml-1.5">
                          Takeaway: {customer.take_away_order_count}
                        </Text>
                      </View>
                    )}
                    {customer.delivery_order_count > 0 && (
                      <View className="bg-base-200 px-3 py-1.5 rounded-lg flex-row items-center">
                        <MaterialIcons name="delivery-dining" size={12} color="#6E6E6E" />
                        <Text className="text-xs text-neutral ml-1.5">
                          Delivery: {customer.delivery_order_count}
                        </Text>
                      </View>
                    )}
                    {customer.eat_in_order_count > 0 && (
                      <View className="bg-base-200 px-3 py-1.5 rounded-lg flex-row items-center">
                        <MaterialIcons name="restaurant" size={12} color="#6E6E6E" />
                        <Text className="text-xs text-neutral ml-1.5">
                          Eat-In: {customer.eat_in_order_count}
                        </Text>
                      </View>
                    )}
                    {customer.website_order_count > 0 && (
                      <View className="bg-base-200 px-3 py-1.5 rounded-lg flex-row items-center">
                        <MaterialIcons name="language" size={12} color="#6E6E6E" />
                        <Text className="text-xs text-neutral ml-1.5">
                          Web: {customer.website_order_count}
                        </Text>
                      </View>
                    )}
                    {customer.in_store_order_count > 0 && (
                      <View className="bg-base-200 px-3 py-1.5 rounded-lg flex-row items-center">
                        <MaterialIcons name="store" size={12} color="#6E6E6E" />
                        <Text className="text-xs text-neutral ml-1.5">
                          In-Store: {customer.in_store_order_count}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* Average Order Value */}
                {(customer.avg_order_value_takeaway || customer.avg_order_value_delivery || customer.avg_order_value_eat_in) && (
                  <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                    <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-3">
                      Average Order Value
                    </Text>
                    <View className="gap-y-2">
                      {customer.avg_order_value_takeaway && (
                        <View className="flex-row justify-between">
                          <Text className="text-xs text-accent">Takeaway</Text>
                          <Text className="text-xs font-bold text-neutral">
                            {formatAmount(customer.avg_order_value_takeaway, currencySymbol)}
                          </Text>
                        </View>
                      )}
                      {customer.avg_order_value_delivery && (
                        <View className="flex-row justify-between">
                          <Text className="text-xs text-accent">Delivery</Text>
                          <Text className="text-xs font-bold text-neutral">
                            {formatAmount(customer.avg_order_value_delivery, currencySymbol)}
                          </Text>
                        </View>
                      )}
                      {customer.avg_order_value_eat_in && (
                        <View className="flex-row justify-between">
                          <Text className="text-xs text-accent">Eat-In</Text>
                          <Text className="text-xs font-bold text-neutral">
                            {formatAmount(customer.avg_order_value_eat_in, currencySymbol)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}

                {/* Address Details */}
                {customer.Address ? (
                  <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                    <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-2">
                      Address Details
                    </Text>
                    <Text className="text-xs text-neutral leading-5">
                      {customer.Address}
                      {customer.post_code ? `\nPost Code: ${customer.post_code}` : ""}
                    </Text>
                  </View>
                ) : null}

                {/* Preferred Dishes */}
                {Array.isArray(customer.preferred_dishes) && customer.preferred_dishes.length > 0 && (
                  <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                    <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-2.5">
                      Preferred Dishes
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {customer.preferred_dishes.map((dish: string, index: number) => (
                        <View key={index} className="bg-primary/5 px-2.5 py-1 rounded-full border border-primary/10">
                          <Text className="text-[10px] font-semibold text-primary">{dish}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Reviews & Satisfaction */}
                {(customer.positive_reviews > 0 || customer.negative_reviews > 0 || customer.avg_satisfaction) && (
                  <View className="bg-base-300 p-4 rounded-xl border border-base-200">
                    <Text className="text-[10px] font-bold text-accent tracking-widest uppercase mb-3">
                      Reviews & Satisfaction
                    </Text>
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row items-center gap-x-4">
                        <View className="bg-green-50 px-2.5 py-1 rounded-full flex-row items-center">
                          <Text className="text-[11px] text-green-600 font-bold">
                            👍 {customer.positive_reviews} Positive
                          </Text>
                        </View>
                        <View className="bg-red-50 px-2.5 py-1 rounded-full flex-row items-center">
                          <Text className="text-[11px] text-red-600 font-bold">
                            👎 {customer.negative_reviews} Negative
                          </Text>
                        </View>
                      </View>
                      {customer.avg_satisfaction && (
                        <Text className="text-xs font-bold text-neutral">
                          Satisfaction: {customer.avg_satisfaction}%
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
