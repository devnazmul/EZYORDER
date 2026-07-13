import { formatAmount, formatDateTime } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface PartnerSaleCardProps {
  item: {
    id: number | string;
    eat_in_orders: number;
    eat_in_orders_amount: string | number;
    takeaway_orders: number;
    takeaway_orders_amount: string | number;
    notes?: string | null;
    bank_payment?: string | number | null;
    cash_payment?: string | number | null;
    delivery_orders: number;
    delivery_orders_amount?: string | number;
    created_at?: string;
    restaurant_partner_id?: number | string;
    restaurant_partner?: {
      name: string;
    } | null;
  };
}

export default function PartnerSaleCard({ item }: PartnerSaleCardProps) {
  const partnerName = item.restaurant_partner?.name || `Unnamed Partner`;

  return (
    <View className="bg-base-200 border border-base-300 rounded-2xl p-4 overflow-hidden">
      {/* Header: Partner Name & Creation Date */}
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-secondary/10 p-2 rounded-xl">
            <MaterialIcons name="trending-up" size={20} color="#00677F" />
          </View>
          <View>
            <Text className="text-sm font-bold text-neutral">{partnerName}</Text>
            {item.created_at ? (
              <Text className="text-[9px] text-accent font-semibold mt-0.5">
                {formatDateTime(item.created_at)}
              </Text>
            ) : null}
          </View>
        </View>
      </View>

      {/* Orders Channels Details Grid */}
      <View className="bg-base-100 border border-base-300 rounded-xl p-3 mb-3 gap-y-3">
        {/* Eat In Orders */}
        {item.eat_in_orders !== 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="store" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Eat In</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">
                {item.eat_in_orders} {item.eat_in_orders === 1 ? "Order" : "Orders"}
              </Text>
              <Text className="text-[10px] text-accent font-semibold mt-0.5">
                Value: {formatAmount(item.eat_in_orders_amount)}
              </Text>
            </View>
          </View>
        )}

        {/* Takeaway Orders */}
        {item.takeaway_orders !== 0 && (
          <View className="flex-row justify-between items-center border-t border-base-300/50 pt-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="shopping-bag" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Takeaway</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">
                {item.takeaway_orders} {item.takeaway_orders === 1 ? "Order" : "Orders"}
              </Text>
              <Text className="text-[10px] text-accent font-semibold mt-0.5">
                Value: {formatAmount(item.takeaway_orders_amount)}
              </Text>
            </View>
          </View>
        )}

        {/* Delivery Orders */}
        {item.delivery_orders !== 0 && (
          <View className="flex-row justify-between items-center border-t border-base-300/50 pt-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="delivery-dining" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Delivery</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">
                {item.delivery_orders} {item.delivery_orders === 1 ? "Order" : "Orders"}
              </Text>
              {item.delivery_orders_amount !== undefined ? (
                <Text className="text-[10px] text-accent font-semibold mt-0.5">
                  Value: {formatAmount(item.delivery_orders_amount)}
                </Text>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* Payment Details & Notes Block */}
      <View className="px-1 gap-y-2">
        {/* Bank & Cash Payments */}

        <View className="flex-row items-center justify-between bg-base-300/50 rounded-lg p-2">
          {item.bank_payment ? (
            <View className="flex-1 flex-row items-center gap-1">
              <MaterialIcons name="account-balance" size={12} color="#6E6E6E" />
              <Text className="text-[10px] font-bold text-accent">Bank:</Text>
              <Text className="text-[10px] text-neutral font-semibold">
                {formatAmount(item.bank_payment)}
              </Text>
            </View>
          ) : null}
          {item.cash_payment ? (
            <View
              className={`flex-1 flex-row items-center gap-1 ${
                item.bank_payment ? "border-l border-base-300 pl-3" : ""
              }`}
            >
              <MaterialIcons name="payments" size={12} color="#6E6E6E" />
              <Text className="text-[10px] font-bold text-accent">Cash:</Text>
              <Text className="text-[10px] text-neutral font-semibold">
                {formatAmount(item.cash_payment)}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Notes */}
        {item.notes && item.notes.trim() !== "" ? (
          <View className="bg-primary-container border border-neutral/30 rounded-lg p-2 mt-1">
            <Text className="text-[9px] font-black text-neutral uppercase tracking-wider mb-0.5">Notes</Text>
            <Text className="text-[10px] text-neutral font-semibold leading-relaxed">{item.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
