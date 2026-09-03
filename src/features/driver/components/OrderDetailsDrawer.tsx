import OrderItemList from "@/components/bottomsheet/OrderItemList";
import Badge from "@/components/reuseable/Badge";
import BottomSheet from "@/components/reuseable/BottomSheet";
import { formatLabel } from "@/utils/formatLabel";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getStatusBadgeConfig } from "@/utils/getStatusBadgeConfig";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React from "react";
import { Linking, Platform, Text, TouchableOpacity, View } from "react-native";
import { useOrderDetailQuery } from "../hooks/queries/useDriverQueries";
import { DriverOrder } from "../types";
import PickupDetailsSkeleton from "./skeletons/PickupDetailsSkeleton";

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
  const { data: fullOrderDetail, isLoading: isLoadingDetails } =
    useOrderDetailQuery(order?.id || "", visible);

  if (!order) return null;

  const handleCallPhone = (phone: string) => {
    Linking.openURL(`tel:${phone}`).catch(() => {});
  };

  const handleOpenMaps = (
    address: string,
    lat?: string | null,
    lng?: string | null,
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

  const detailItems = fullOrderDetail?.detail || fullOrderDetail?.details || [];
  const restaurant = fullOrderDetail?.restaurant;
  const statusConfig = getStatusBadgeConfig(order.status || "pending");
  const payConfig = getStatusBadgeConfig(order.payment_status || "unpaid");

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["50%", "75%"]}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
    >
      {/* Header */}
      <View className="flex-row justify-between items-center border-b border-base-200 pb-3 px-6 pt-2">
        <View className="flex-row items-center gap-3">
          <View className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center">
            <MaterialIcons name="receipt-long" size={20} color="#DC2D2A" />
          </View>
          <View>
            <Text className="text-base font-bold text-neutral">
              Order #{order.id}
            </Text>
            <Text className="text-[11px] text-accent font-medium mt-0.5">
              Assigned Delivery Details
            </Text>
          </View>
        </View>

        <Badge
          text={formatLabel(order.status) || "Pending"}
          icon={
            <MaterialIcons
              name={statusConfig.iconName}
              size={12}
              color={statusConfig.iconColor}
            />
          }
          iconPosition="left"
          containerClassName={statusConfig.containerClass}
          textClassName={statusConfig.textClass}
        />
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Restaurant Pickup Section */}
        <DriverPickupSection
          isLoadingDetails={isLoadingDetails}
          restaurant={restaurant}
          fullOrderDetail={fullOrderDetail}
          order={order}
          handleCallPhone={handleCallPhone}
          handleOpenMaps={handleOpenMaps}
        />

        <DriverCustomerSection
          order={order}
          handleCallPhone={handleCallPhone}
          handleOpenMaps={handleOpenMaps}
        />

        {/* Instructions Section */}
        {order.initial_note ? (
          <View className="gap-y-2 mt-4">
            <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
              Instructions
            </Text>
            <View className="bg-primary/5 border border-primary/20 rounded-lg p-3.5 flex-row items-start gap-2.5">
              <MaterialIcons name="assignment-late" size={18} color="#DC2D2A" />
              <Text className="text-xs text-neutral italic font-semibold leading-5 flex-1">
                {order.initial_note}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Order Items Section */}
        <OrderItemList
          items={detailItems}
          isLoading={isLoadingDetails}
          currencySymbol={currencySymbol}
        />

        {/* Bill Summary Section */}
        <DriverBillSummarySection
          order={order}
          fullOrderDetail={fullOrderDetail}
          payConfig={payConfig}
          currencySymbol={currencySymbol}
        />
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

interface DriverPickupSectionProps {
  isLoadingDetails: boolean;
  restaurant: any;
  fullOrderDetail: any;
  order: any;
  handleCallPhone: (phone: string) => void;
  handleOpenMaps: (
    address: string,
    lat?: string | null,
    lng?: string | null,
  ) => void;
}

function DriverPickupSection({
  isLoadingDetails,
  restaurant,
  fullOrderDetail,
  order,
  handleCallPhone,
  handleOpenMaps,
}: Readonly<DriverPickupSectionProps>) {
  if (isLoadingDetails) {
    return <PickupDetailsSkeleton />;
  }
  if (!restaurant) return null;

  return (
    <View key="pickup-loaded" className="gap-y-2 mb-4">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
        Pickup Details
      </Text>
      <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="storefront" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Restaurant:</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {restaurant.Name}
          </Text>
        </View>

        {fullOrderDetail?.created_at || order?.created_at ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="schedule" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Placed On:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatDateTime(fullOrderDetail?.created_at || order?.created_at)}
            </Text>
          </View>
        ) : null}

        {restaurant.PhoneNumber ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="phone" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Phone:</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCallPhone(restaurant.PhoneNumber!)}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-xs text-primary font-bold">(</Text>
              <MaterialIcons
                name="phone"
                size={11}
                color="#DC2D2A"
                style={{
                  transform: [{ rotate: "10deg" }],
                  marginHorizontal: -1,
                }}
              />
              <Text className="text-xs text-primary font-bold">) </Text>
              <Text className="text-xs text-primary font-bold">
                {restaurant.PhoneNumber}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {restaurant.Address ? (
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Address:</Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                handleOpenMaps(
                  `${restaurant.Address} ${restaurant.PostCode || ""}`,
                  restaurant.latitude,
                  restaurant.longitude,
                )
              }
              activeOpacity={0.7}
              className="flex-1 ml-4"
            >
              <Text
                className="text-xs font-bold text-primary text-right"
                numberOfLines={3}
              >
                {restaurant.Address}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

interface DriverCustomerSectionProps {
  order: any;
  handleCallPhone: (phone: string) => void;
  handleOpenMaps: (
    address: string,
    lat?: string | null,
    lng?: string | null,
  ) => void;
}

function DriverCustomerSection({
  order,
  handleCallPhone,
  handleOpenMaps,
}: Readonly<DriverCustomerSectionProps>) {
  return (
    <View className="gap-y-2">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
        Customer Details
      </Text>
      <View className="bg-slate-50 rounded-lg p-3.5 gap-y-3 border border-base-200 shadow-sm">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="person-outline" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Name:</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {order.customer_name || "N/A"}
          </Text>
        </View>

        {order.customer_phone && order.customer_phone !== "N/A" ? (
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="phone" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Phone:</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleCallPhone(order.customer_phone!)}
              activeOpacity={0.7}
              className="flex-row items-center"
            >
              <Text className="text-xs text-primary font-bold">(</Text>
              <MaterialIcons
                name="phone"
                size={11}
                color="#DC2D2A"
                style={{
                  transform: [{ rotate: "10deg" }],
                  marginHorizontal: -1,
                }}
              />
              <Text className="text-xs text-primary font-bold">) </Text>
              <Text className="text-xs text-primary font-bold">
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
                color="#DC2D2A"
              />
              <Text className="text-xs text-accent">Customer Note:</Text>
            </View>
            <Text className="text-xs font-semibold text-neutral italic max-w-[60%] text-right">
              &quot;{order.customer_note}&quot;
            </Text>
          </View>
        ) : null}

        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="location-on" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Address:</Text>
          </View>
          <TouchableOpacity
            onPress={() =>
              handleOpenMaps(
                `${order.customer_address} ${order.customer_post_code || ""}`,
                order.latitude,
                order.longitude,
              )
            }
            activeOpacity={0.7}
            className="flex-1 ml-4"
          >
            <Text
              className="text-xs font-bold text-primary text-right"
              numberOfLines={3}
            >
              {order.door_no ? `${order.door_no}, ` : ""}
              {order.customer_address}
              {order.customer_post_code ? ` - ${order.customer_post_code}` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

interface DriverBillSummarySectionProps {
  order: any;
  fullOrderDetail: any;
  payConfig: any;
  currencySymbol: string;
}

function DriverBillSummarySection({
  order,
  fullOrderDetail,
  payConfig,
  currencySymbol,
}: Readonly<DriverBillSummarySectionProps>) {
  const subtotal = parseFloat(
    fullOrderDetail?.final_price ||
      fullOrderDetail?.amount ||
      order.amount ||
      "0",
  );
  const tax = parseFloat(fullOrderDetail?.tax || order.tax || "0");
  const tip = parseFloat(
    fullOrderDetail?.tip_amount || order.tip_amount || "0",
  );
  const discount = parseFloat(
    fullOrderDetail?.discount || order.discount || "0",
  );

  return (
    <View className="gap-y-2 mt-4 mb-2">
      <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
        Bill Summary
      </Text>
      <View className="bg-slate-50 rounded-lg p-3.5 border border-base-200 shadow-sm gap-y-3">
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialIcons
              name="check-circle-outline"
              size={16}
              color="#DC2D2A"
            />
            <Text className="text-xs text-accent">Payment Status:</Text>
          </View>
          <Badge
            text={formatLabel(order.payment_status) || "Unpaid"}
            icon={
              <MaterialIcons
                name={payConfig.iconName}
                size={12}
                color={payConfig.iconColor}
              />
            }
            iconPosition="left"
            containerClassName={payConfig.containerClass}
            textClassName={payConfig.textClass}
          />
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="credit-card" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Payment Method:</Text>
          </View>
          <Badge
            text={
              order.payment_method
                ? order.payment_method.toLowerCase() === "cod"
                  ? "COD"
                  : formatLabel(order.payment_method)
                : "N/A"
            }
            containerClassName="bg-secondary/10 border border-secondary/25"
            textClassName="text-neutral font-semibold"
          />
        </View>

        <View className="flex-row justify-between items-center border-t border-base-200/60 pt-2.5">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="receipt" size={16} color="#DC2D2A" />
            <Text className="text-xs text-accent">Subtotal:</Text>
          </View>
          <Text className="text-xs font-bold text-neutral">
            {formatAmount(subtotal, currencySymbol)}
          </Text>
        </View>

        {tax > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="account-balance" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Tax:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatAmount(tax, currencySymbol)}
            </Text>
          </View>
        ) : null}

        {tip > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name="volunteer-activism"
                size={16}
                color="#DC2D2A"
              />
              <Text className="text-xs text-accent">Tip:</Text>
            </View>
            <Text className="text-xs font-bold text-neutral">
              {formatAmount(tip, currencySymbol)}
            </Text>
          </View>
        ) : null}

        {discount > 0 ? (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="local-offer" size={16} color="#DC2D2A" />
              <Text className="text-xs text-accent">Discount:</Text>
            </View>
            <Text className="text-xs font-bold text-primary">
              -{formatAmount(discount, currencySymbol)}
            </Text>
          </View>
        ) : null}

        <View className="border-t border-base-200 pt-2.5 mt-1 flex-row justify-between items-center">
          <View className="flex-row items-center gap-2">
            <MaterialIcons name="payments" size={16} color="#DC2D2A" />
            <Text className="text-xs font-bold text-neutral">
              Total Amount:
            </Text>
          </View>
          <Text className="text-base font-bold text-primary">
            {formatAmount(
              parseFloat(order.amount || order.total_due_amount || "0"),
              currencySymbol,
            )}
          </Text>
        </View>
      </View>
    </View>
  );
}
