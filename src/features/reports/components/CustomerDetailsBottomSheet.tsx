import Badge from "@/components/reuseable/Badge";
import BottomSheet from "@/components/reuseable/BottomSheet";
import COLORS from "@/constants/colors";
import { useData } from "@/src/context/context/DataContext";
import { formatAmount } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { handleCallPhone } from "@/utils/handleCallPhone";
import { handleOpenMaps } from "@/utils/handleOpenMaps";
import { handleSendEmail } from "@/utils/handleSendEmail";
import { getOrderTypeColor } from "@/utils/orderTypeColors";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

interface CustomerDetailsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  customer: any;
}

export default function CustomerDetailsBottomSheet({
  visible,
  onClose,
  customer,
}: CustomerDetailsBottomSheetProps) {
  const { settings } = useData();

  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  // Compute total spend
  const totalSpend = useMemo(() => {
    const takeaway = parseFloat(customer?.total_revenue_takeaway) || 0;
    const delivery = parseFloat(customer?.total_revenue_delivery) || 0;
    const eatIn = parseFloat(customer?.total_revenue_eat_in) || 0;
    return takeaway + delivery + eatIn;
  }, [customer]);

  const initials = useMemo(() => {
    const first = customer?.first_Name ? customer.first_Name.charAt(0) : "";
    const last = customer?.last_Name ? customer.last_Name.charAt(0) : "";
    return (first + last).toUpperCase() || "?";
  }, [customer?.first_Name, customer?.last_Name]);

  if (!customer) return null;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["85%"]}
      backgroundStyle={{ backgroundColor: COLORS.base300, borderRadius: 24 }}
      handleIndicatorStyle={{ backgroundColor: COLORS.accent + "33", width: 48 }}
    >
      {/* Modal Title bar */}
      <View
        style={{ paddingHorizontal: WP("5%"), paddingBottom: HP("1.5%") }}
        className="flex-row items-center justify-between border-b border-base-200/50"
      >
        <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
          Customer Details
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={{ width: WP("8%"), height: WP("8%") }}
          className="rounded-full bg-base-100 items-center justify-center border border-base-200"
        >
          <MaterialIcons name="close" size={18} color={COLORS.accent} />
        </TouchableOpacity>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{
          paddingHorizontal: WP("5%"),
          paddingVertical: HP("2.5%"),
          paddingBottom: HP("7%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Main Header */}
        <View className="items-center mb-6">
          <View
            style={{ width: WP("18%"), height: WP("18%") }}
            className="rounded-full bg-primary/10 items-center justify-center overflow-hidden mb-3 border border-base-200"
          >
            {customer.image ? (
              <Image source={{ uri: customer.image }} style={{ width: "100%", height: "100%" }} />
            ) : (
              <Text style={{ fontSize: getResponsiveFontSize("xl") }} className="text-primary font-bold">
                {initials}
              </Text>
            )}
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="font-extrabold text-neutral text-center"
          >
            {customer.first_Name || ""} {customer.last_Name || ""}
          </Text>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="text-accent capitalize font-bold mt-1"
          >
            {customer.type || "Guest User"}
          </Text>
        </View>

        {/* Spend & Order KPI block */}
        <View
          style={{ padding: WP("3.5%") }}
          className="flex-row justify-between mb-6 bg-base-100 rounded-xl border border-base-200"
        >
          <View className="flex-1 items-center border-r border-base-200/80">
            <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-extrabold text-primary">
              {formatAmount(totalSpend, currencySymbol)}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 2 }}
              className="text-accent capitalize font-bold mt-1"
            >
              Total Spend
            </Text>
          </View>
          <View className="flex-1 items-center">
            <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-extrabold text-neutral">
              {customer.completed_orders_count || 0}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") - 2 }}
              className="text-accent capitalize font-bold mt-1"
            >
              Completed Orders
            </Text>
          </View>
        </View>

        {/* Details List */}
        <View className="gap-y-5">
          {/* Contact Info */}
          <View className="gap-y-2">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-neutral capitalize tracking-wider"
            >
              Contact Information
            </Text>
            <View
              style={{ padding: WP("3.5%") }}
              className="bg-base-100 rounded-xl border border-base-200 gap-y-3"
            >
              {customer.phone ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="phone" size={16} color={COLORS.primary} />
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-semibold text-accent capitalize"
                    >
                      Phone:
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleCallPhone(customer.phone)} activeOpacity={0.7}>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-bold text-primary"
                    >
                      {customer.phone}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {customer.email ? (
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons name="email" size={16} color={COLORS.primary} />
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-semibold text-accent capitalize"
                    >
                      Email:
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => handleSendEmail(customer.email)} activeOpacity={0.7}>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-bold text-primary"
                    >
                      {customer.email}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}

              {customer.Address ? (
                <View className="flex-row items-start justify-between">
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons
                      name="location-on"
                      size={16}
                      color={COLORS.primary}
                      style={{ marginTop: 1 }}
                    />
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-semibold text-accent capitalize"
                    >
                      Address:
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleOpenMaps(`${customer.Address} ${customer.post_code || ""}`)}
                    activeOpacity={0.7}
                    className="flex-1 items-end ml-4"
                  >
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-bold text-primary text-right capitalize leading-5"
                    >
                      {customer.Address}
                      {customer.post_code ? `- ${customer.post_code}` : ""}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          </View>

          {/* Orders Breakdown */}
          <View className="gap-y-2">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-neutral capitalize tracking-wider"
            >
              Orders Breakdown
            </Text>
            <View
              style={{ padding: WP("3.5%") }}
              className="bg-base-100 rounded-xl border border-base-200 gap-y-3"
            >
              {/* Takeaway */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="shopping-bag" size={16} color={getOrderTypeColor("take_away")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Takeaway:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {customer.take_away_order_count || 0}
                </Text>
              </View>

              {/* Delivery */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="delivery-dining" size={16} color={getOrderTypeColor("delivery")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Delivery:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {customer.delivery_order_count || 0}
                </Text>
              </View>

              {/* Eat-In */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="restaurant" size={16} color={getOrderTypeColor("eat_in")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Eat-In:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {customer.eat_in_order_count || 0}
                </Text>
              </View>

              {/* Web */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="language" size={16} color={getOrderTypeColor("web")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Web:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {customer.website_order_count || 0}
                </Text>
              </View>

              {/* In-Store */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="store" size={16} color={getOrderTypeColor("walk_in")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    In-Store:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {customer.in_store_order_count || 0}
                </Text>
              </View>
            </View>
          </View>

          {/* Average Order Value */}
          <View className="gap-y-2">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-neutral capitalize tracking-wider"
            >
              Average Order Value
            </Text>
            <View
              style={{ padding: WP("3.5%") }}
              className="bg-base-100 rounded-xl border border-base-200 gap-y-3"
            >
              {/* Takeaway */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="shopping-bag" size={16} color={getOrderTypeColor("take_away")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Takeaway:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {formatAmount(customer.avg_order_value_takeaway || 0, currencySymbol)}
                </Text>
              </View>

              {/* Delivery */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="delivery-dining" size={16} color={getOrderTypeColor("delivery")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Delivery:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {formatAmount(customer.avg_order_value_delivery || 0, currencySymbol)}
                </Text>
              </View>

              {/* Eat-In */}
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center gap-2">
                  <MaterialIcons name="restaurant" size={16} color={getOrderTypeColor("eat_in")} />
                  <Text
                    style={{ fontSize: getResponsiveFontSize("xs") }}
                    className="font-semibold text-accent capitalize"
                  >
                    Eat-In:
                  </Text>
                </View>
                <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-bold text-neutral">
                  {formatAmount(customer.avg_order_value_eat_in || 0, currencySymbol)}
                </Text>
              </View>
            </View>
          </View>

          {/* Preferred Dishes */}
          {Array.isArray(customer.preferred_dishes) && customer.preferred_dishes.length > 0 && (
            <View className="gap-y-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-bold text-neutral capitalize tracking-wider"
              >
                Preferred Dishes
              </Text>
              <View style={{ padding: WP("3.5%") }} className="bg-base-100 rounded-xl border border-base-200">
                <View className="flex-row flex-wrap gap-2">
                  {customer.preferred_dishes.map((dish: string, index: number) => (
                    <Badge
                      key={index}
                      text={dish}
                      containerClassName="bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full"
                      textClassName="text-primary font-semibold"
                      textStyle={{ fontSize: getResponsiveFontSize("xs") - 1 }}
                    />
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Reviews & Satisfaction */}
          {(customer.positive_reviews > 0 || customer.negative_reviews > 0 || customer.avg_satisfaction) && (
            <View className="gap-y-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-bold text-neutral capitalize tracking-wider"
              >
                Reviews & Satisfaction
              </Text>
              <View style={{ padding: WP("3.5%") }} className="bg-base-100 rounded-xl border border-base-200">
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center gap-2">
                    <Badge
                      text={`👍 ${customer.positive_reviews} Positive`}
                      containerClassName="bg-success/15 border border-success/20 px-2.5 py-1 rounded-full"
                      textClassName="text-success font-bold"
                      textStyle={{ fontSize: getResponsiveFontSize("xs") }}
                    />
                    <Badge
                      text={`👎 ${customer.negative_reviews} Negative`}
                      containerClassName="bg-error/15 border border-error/20 px-2.5 py-1 rounded-full"
                      textClassName="text-error font-bold"
                      textStyle={{ fontSize: getResponsiveFontSize("xs") }}
                    />
                  </View>
                  {customer.avg_satisfaction && (
                    <Text
                      style={{ fontSize: getResponsiveFontSize("xs") }}
                      className="font-bold text-neutral"
                    >
                      Satisfaction: {customer.avg_satisfaction}%
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
