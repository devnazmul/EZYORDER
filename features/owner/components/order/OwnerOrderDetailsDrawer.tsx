import OrderItemList from "@/components/bottomsheet/OrderItemList";
import { Badge, BottomSheet } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { useData } from "@/context/context/DataContext";
import { IOrder } from "@/features/owner/reports/types";
import { getCustomerFullAddress } from "@/features/owner/utils";
import {
  formatAmount,
  formatDateTime,
  formatLabel,
  getCurrencySymbol,
  getOrderTypeColor,
  getResponsiveFontSize,
  getStatusBadgeConfig,
  HP,
  WP,
} from "@/utils";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";

export type IMapCoordinate = string | number | null | undefined;

export interface IOwnerOrderDetailsDrawerProps {
  visible: boolean;
  order: IOrder | null;
  onClose: () => void;
  currencySymbol?: string;
}

export default function OwnerOrderDetailsDrawer({
  visible,
  order,
  onClose,
  currencySymbol: customCurrencySymbol,
}: Readonly<IOwnerOrderDetailsDrawerProps>) {
  const { settings } = useData();

  if (!order) return null;

  const resolvedCurrencySymbol =
    customCurrencySymbol || getCurrencySymbol(settings?.currency);

  const detailItems = order.detail || [];
  const statusConfig = getStatusBadgeConfig(order.status || "pending");
  const payConfig = getStatusBadgeConfig(order.payment_status || "unpaid");
  const orderTypeColor = getOrderTypeColor(order.type as string);
  const formattedType = (order.type || "Delivery").replaceAll("_", " ");

  const handleCallPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleOpenMaps = (
    address: string,
    lat?: IMapCoordinate,
    lng?: IMapCoordinate,
  ) => {
    let url = "";
    if (lat && lng) {
      url =
        Platform.select({
          ios: `maps:0,0?q=${lat},${lng}`,
          android: `geo:0,0?q=${lat},${lng}`,
        }) || `https://maps.google.com/?q=${lat},${lng}`;
    } else {
      const encoded = encodeURIComponent(address);
      url =
        Platform.select({
          ios: `maps:0,0?q=${encoded}`,
          android: `geo:0,0?q=${encoded}`,
        }) || `https://maps.google.com/?q=${encoded}`;
    }
    Linking.openURL(url).catch(() => {});
  };

  // Staff assignment text helper
  const assignedText =
    order.driver?.first_Name ||
    order.driver?.name ||
    order.waiter?.first_Name ||
    order.waiter?.name ||
    "Unassigned";

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "75%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Drawer Header */}
      <View
        style={{ paddingHorizontal: WP("6%") }}
        className="flex-row justify-between items-center border-b border-base-200 pb-3 pt-2"
      >
        <View className="flex-row items-center gap-3">
          <View className=" rounded-lg bg-primary/10 border border-primary/20 items-center justify-center p-1.5">
            <MaterialIcons
              name="receipt-long"
              size={WP("5%")}
              color={COLORS.primary}
            />
          </View>
          <View>
            <View className="flex-row items-center gap-2">
              <Text
                style={{ fontSize: getResponsiveFontSize("md") }}
                className="font-bold text-neutral"
              >
                Order #{order.id}
              </Text>
              <Badge
                text={formattedType}
                containerStyle={{
                  backgroundColor: `${orderTypeColor}15`,
                  borderColor: `${orderTypeColor}30`,
                  borderWidth: 1,
                }}
                textStyle={{ color: orderTypeColor }}
              />
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="text-accent font-medium mt-0.5"
            >
              Owner Management Overview
            </Text>
          </View>
        </View>

        <Badge
          text={formatLabel(order.status || "") || "Pending"}
          icon={
            <MaterialIcons
              name={statusConfig.iconName}
              size={12}
              color={statusConfig.iconColor}
            />
          }
          iconPosition="left"
          containerStyle={{
            backgroundColor: statusConfig.backgroundColor,
            borderColor: statusConfig.borderColor,
            borderWidth: 1,
          }}
          textStyle={{
            color: statusConfig.textColor,
          }}
        />
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: WP("6%"),
          paddingTop: 16,
          paddingBottom: HP("6%"),
        }}
      >
        <OwnerCustomerDetailsSection
          order={order}
          assignedText={assignedText}
          handleCallPhone={handleCallPhone}
          handleOpenMaps={handleOpenMaps}
        />

        {/* Instructions Section */}
        {order.initial_note ? (
          <View className="gap-y-2 mb-4">
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-bold text-neutral capitalize tracking-wider"
            >
              Instructions
            </Text>
            <View className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 flex-row items-start gap-2.5">
              <MaterialIcons
                name="assignment-late"
                size={18}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-neutral italic font-semibold leading-5 flex-1"
              >
                {order.initial_note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Order Items Section */}
        <OrderItemList
          items={detailItems}
          currencySymbol={resolvedCurrencySymbol}
          containerClassName="mb-4"
        />

        <OwnerBillSummarySection
          order={order}
          payConfig={payConfig}
          resolvedCurrencySymbol={resolvedCurrencySymbol}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

interface IOwnerCustomerDetailsSectionProps {
  order: IOrder;
  assignedText: string;
  handleCallPhone: (phone: string) => void;
  handleOpenMaps: (
    address: string,
    lat?: IMapCoordinate,
    lng?: IMapCoordinate,
  ) => void;
}

function OwnerCustomerDetailsSection({
  order,
  assignedText,
  handleCallPhone,
  handleOpenMaps,
}: Readonly<IOwnerCustomerDetailsSectionProps>) {
  const customerName =
    order.customer_name ||
    (order.table_number && Number.parseFloat(order.table_number) > 0
      ? `Table ${Number.parseFloat(order.table_number)}`
      : "Walk-in Customer");

  const fullDisplayAddress = getCustomerFullAddress(order);
  let streetAddress = "";
  if (typeof order.customer_address === "string") {
    streetAddress = order.customer_address;
  } else if (typeof order.address === "string") {
    streetAddress = order.address;
  }

  let postCode = "";
  if (typeof order.customer_post_code === "string") {
    postCode = order.customer_post_code;
  } else if (typeof order.post_code === "string") {
    postCode = order.post_code;
  }

  const mapsSearchQuery = `${streetAddress} ${postCode}`.trim();

  return (
    <View className="gap-y-2 mb-4">
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="font-bold text-neutral capitalize tracking-wider"
      >
        Customer Details
      </Text>
      <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="person-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Customer:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral"
          >
            {customerName}
          </Text>
        </View>

        {order.customer_phone ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="phone" size={16} color={COLORS.primary} />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Phone:
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCallPhone(order.customer_phone!)}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-primary font-semibold"
              >
                (
              </Text>
              <MaterialIcons
                name="phone"
                size={11}
                color={COLORS.primary}
                style={{
                  transform: [{ rotate: "10deg" }],
                  marginHorizontal: -1,
                }}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-primary font-semibold"
              >
                ){" "}
              </Text>
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="text-primary font-semibold"
              >
                {order.customer_phone}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {order.customer_note ? (
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="chat-bubble-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Customer Note:
              </Text>
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral italic max-w-[60%] text-right"
            >
              &ldquo;{order.customer_note}&rdquo;
            </Text>
          </View>
        ) : null}

        {fullDisplayAddress ? (
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="location-on"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Address:
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleOpenMaps(mapsSearchQuery, order.latitude, order.longitude)
              }
              activeOpacity={0.7}
              className="flex-1 ml-4"
            >
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-primary text-right"
                numberOfLines={3}
              >
                {fullDisplayAddress}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {order.table_number && Number.parseFloat(order.table_number) > 0 ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="restaurant"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Table:
              </Text>
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral"
            >
              Table {Number.parseFloat(order.table_number)}
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="schedule" size={16} color={COLORS.primary} />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Placed On:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral"
          >
            {order.created_at ? formatDateTime(order.created_at) : "--:--"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="devices" size={16} color={COLORS.primary} />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Source:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral capitalize"
          >
            {String(order.order_app || "").toLowerCase() === "pos"
              ? "POS"
              : "Client App"}
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="badge" size={16} color={COLORS.primary} />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Assigned Staff:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral"
          >
            {assignedText}
          </Text>
        </View>
      </View>
    </View>
  );
}

interface IOwnerBillSummarySectionProps {
  order: IOrder;
  payConfig: {
    iconName: keyof typeof MaterialIcons.glyphMap;
    iconColor: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
  };
  resolvedCurrencySymbol: string;
}

function OwnerBillSummarySection({
  order,
  payConfig,
  resolvedCurrencySymbol,
}: Readonly<IOwnerBillSummarySectionProps>) {
  return (
    <View className="gap-y-2 mb-2">
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") }}
        className="font-bold text-neutral capitalize tracking-wider"
      >
        Bill Summary
      </Text>
      <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="check-circle-outline"
              size={16}
              color={COLORS.primary}
            />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Payment Status:
            </Text>
          </View>
          <Badge
            text={formatLabel(order.payment_status as string) || "Unpaid"}
            icon={
              <MaterialIcons
                name={payConfig.iconName}
                size={12}
                color={payConfig.iconColor}
              />
            }
            iconPosition="left"
            containerStyle={{
              backgroundColor: payConfig.backgroundColor,
              borderColor: payConfig.borderColor,
              borderWidth: 1,
            }}
            textStyle={{
              color: payConfig.textColor,
            }}
          />
        </View>

        {order.payment_method ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="credit-card"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Payment Method:
              </Text>
            </View>
            <Badge
              text={
                order.payment_method.toLowerCase() === "cod"
                  ? "COD"
                  : formatLabel(order.payment_method)
              }
              containerClassName="bg-secondary/10 border border-secondary/25"
              textClassName="text-neutral font-semibold"
            />
          </View>
        ) : null}

        <View className="flex-row justify-between items-center border-t border-base-200/60 pt-2.5">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="receipt" size={16} color={COLORS.primary} />
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent"
            >
              Subtotal:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className="font-semibold text-neutral"
          >
            {formatAmount(
              order.final_price || order.amount || "0",
              resolvedCurrencySymbol,
            )}
          </Text>
        </View>

        {order.tax && Number.parseFloat(String(order.tax)) > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="account-balance"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Tax:
              </Text>
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral"
            >
              {formatAmount(order.tax, resolvedCurrencySymbol)}
            </Text>
          </View>
        ) : null}

        {order.tip_amount && Number.parseFloat(String(order.tip_amount)) > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="volunteer-activism"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Tip:
              </Text>
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-neutral"
            >
              {formatAmount(order.tip_amount, resolvedCurrencySymbol)}
            </Text>
          </View>
        ) : null}

        {order.discount && Number.parseFloat(String(order.discount)) > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="local-offer"
                size={16}
                color={COLORS.primary}
              />
              <Text
                style={{ fontSize: getResponsiveFontSize("xs") }}
                className="font-semibold text-accent"
              >
                Discount:
              </Text>
            </View>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-primary"
            >
              -{formatAmount(order.discount, resolvedCurrencySymbol)}
            </Text>
          </View>
        ) : null}

        <View className="border-t border-base-200 pt-2.5 mt-1 flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="payments"
              size={WP("3.75%")}
              color={COLORS.primary}
            />
            <Text
              style={{ fontSize: getResponsiveFontSize("md") }}
              className="font-bold text-neutral"
            >
              Total Amount:
            </Text>
          </View>
          <Text
            style={{ fontSize: getResponsiveFontSize("md") }}
            className="font-bold text-primary"
          >
            {formatAmount(order.amount || "0", resolvedCurrencySymbol)}
          </Text>
        </View>
      </View>
    </View>
  );
}
