import Badge from "@/components/reuseable/Badge";
import COLORS from "@/constants/colors";
import { useData } from "@/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CustomerDetailsBottomSheet from "./CustomerDetailsBottomSheet";

interface CustomerCardProps {
  customer: any;
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
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
        onPress={() => setBottomSheetVisible(true)}
        style={{ padding: WP("3.5%") }}
        className="bg-base-300 rounded-lg border border-base-200 shadow-sm mb-3"
      >
        {/* Top Header Row */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            {/* Avatar Icon */}
            <View
              style={{ width: WP("10%"), height: WP("10%") }}
              className="rounded-full bg-primary/10 items-center justify-center mr-3 overflow-hidden border border-base-200"
            >
              {customer.image ? (
                <Image source={{ uri: customer.image }} style={{ width: "100%", height: "100%" }} />
              ) : (
                <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="text-primary font-bold">
                  {initials}
                </Text>
              )}
            </View>

            {/* Customer Main Info */}
            <View className="flex-1">
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className=" font-bold text-neutral truncate"
                numberOfLines={2}
              >
                {customer.first_Name || ""} {customer.last_Name || ""}
              </Text>
              <View className="flex-row items-center mt-0.5">
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                  className="text-accent font-semibold capitalize tracking-wide mr-2"
                >
                  {customer.type || "Guest User"}
                </Text>
                {customer.completed_orders_count > 0 && (
                  <Badge
                    text={`${customer.completed_orders_count} Orders`}
                    containerClassName="bg-success/10 border border-success/30 px-1.5 py-0.5 "
                    textClassName="text-success font-semibold"
                    textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
                  />
                )}
              </View>
            </View>
          </View>

          {/* Right side: Total Spend & Arrow */}
          <View className="flex-row items-center gap-2">
            <View className="items-end">
              <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-primary">
                {formatAmount(totalSpend, currencySymbol)}
              </Text>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                className="text-accent mt-0.5 font-semibold capitalize"
              >
                Total Spend
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={COLORS.accent} />
          </View>
        </View>
      </TouchableOpacity>

      <CustomerDetailsBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        customer={customer}
      />
    </>
  );
}
