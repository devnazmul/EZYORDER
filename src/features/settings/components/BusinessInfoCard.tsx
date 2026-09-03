// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 4. Shared components & utils
import {
  ActionCard,
  Avatar,
  Badge,
  CustomText,
  DetailItem,
  ServiceCard,
  StatusBadge,
} from "@/components/reuseable";
import { formatAmount, getCurrencySymbol } from "@/utils";

// 6. Types
import { IRestaurant } from "@/types";

export interface IBusinessInfoCardProps {
  settings: IRestaurant;
}

interface IOrderStatusItemProps {
  label: string;
  isEnabled: boolean | number | undefined;
}

function OrderStatusItem({
  label,
  isEnabled,
}: Readonly<IOrderStatusItemProps>) {
  const enabled = !!isEnabled;
  return (
    <View className="flex-row items-center justify-between py-2.5">
      <CustomText variant="secondary" size="sm" weight="semibold">
        {label}
      </CustomText>
      <StatusBadge status={enabled ? "active" : "inactive"} />
    </View>
  );
}

export default function BusinessInfoCard({
  settings,
}: Readonly<IBusinessInfoCardProps>) {
  if (!settings) return null;

  const addressString = [settings?.Address, settings?.PostCode]
    .filter(Boolean)
    .join(", ");

  const currencySymbol = getCurrencySymbol(settings?.currency);

  return (
    <View className="gap-y-3">
      {/* 1. Brand & Logo Header */}
      <View className="flex-row items-center gap-3 bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm">
        <Avatar imageUri={settings?.Logo} name={settings?.Name} />
        <View className="flex-1 flex-col items-start gap-y-1">
          {Boolean(settings?.Name) && (
            <CustomText variant="primary" size="lg" weight="bold">
              {settings.Name}
            </CustomText>
          )}
          {Boolean(settings?.business_type) && (
            <View className="self-start">
              <Badge
                text={settings.business_type.trim()}
                containerClassName="bg-secondary/15"
                textClassName="text-secondary capitalize"
              />
            </View>
          )}
        </View>
      </View>

      {/* 2. About Description */}
      {Boolean(settings?.About) && (
        <ActionCard title="About The Business" bodyClassName="p-4">
          <CustomText
            variant="secondary"
            size="sm"
            weight="semibold"
            className="leading-relaxed"
          >
            {settings.About}
          </CustomText>
        </ActionCard>
      )}

      {/* 3. Contact Details */}
      <ActionCard title="Contact Details" bodyClassName="p-4">
        {Boolean(addressString) && (
          <DetailItem
            icon="place"
            label="Address"
            value={addressString}
            labelType="address"
          />
        )}
        {Boolean(settings?.PhoneNumber) && (
          <DetailItem
            icon="phone"
            label="Phone Number"
            value={settings?.PhoneNumber}
            labelType="phone"
          />
        )}
        {Boolean(settings?.EmailAddress) && (
          <DetailItem
            icon="email"
            label="Email Address"
            value={settings?.EmailAddress}
            labelType="email"
          />
        )}
        {Boolean(settings?.Webpage) && (
          <DetailItem
            icon="language"
            label="Webpage"
            value={settings?.Webpage}
            labelType="url"
            isLast
          />
        )}
      </ActionCard>

      {/* 4. Services & Payment Methods */}
      <ActionCard
        title="Services & Payment Methods"
        bodyClassName="p-4 gap-y-3"
      >
        <ServiceCard
          icon="restaurant"
          title="Eat In"
          isEnabled={settings?.is_eat_in}
          paymentMode={settings?.eat_in_payment_mode}
        />
        <ServiceCard
          icon="takeout-dining"
          title="Takeaway"
          isEnabled={settings?.is_take_away}
          paymentMode={settings?.takeaway_payment_mode}
        />
        <ServiceCard
          icon="local-shipping"
          title="Delivery"
          isEnabled={settings?.is_delivery}
          paymentMode={settings?.delivery_payment_mode}
        />
      </ActionCard>

      {/* 5. Ordering Controls */}
      <ActionCard title="Is taking orders in customer end" bodyClassName="p-4">
        <OrderStatusItem label="Eat In" isEnabled={settings?.is_eat_in} />
        <OrderStatusItem label="Takeaway" isEnabled={settings?.is_take_away} />
        <OrderStatusItem label="Delivery" isEnabled={settings?.is_delivery} />
      </ActionCard>

      {/* 6. General Configurations */}
      <ActionCard title="General Configurations" bodyClassName="p-4">
        {Boolean(settings?.totalTables) && (
          <DetailItem
            icon="table-restaurant"
            label="Total Tables"
            value={settings?.totalTables}
          />
        )}
        {Boolean(settings?.tax_percentage) && (
          <DetailItem
            icon="percent"
            label="Tax Percentage"
            value={`${settings.tax_percentage}%`}
          />
        )}
        {Boolean(settings?.average_collection_time) && (
          <DetailItem
            icon="schedule"
            label="Average Collection Time"
            value={settings?.average_collection_time}
          />
        )}
        {Boolean(settings?.average_delivery_time) && (
          <DetailItem
            icon="local-shipping"
            label="Average Delivery Time"
            value={settings?.average_delivery_time}
          />
        )}
        {Boolean(settings?.delivery_radius) && (
          <DetailItem
            icon="map"
            label="Delivery Radius"
            value={settings?.delivery_radius}
          />
        )}
        {Boolean(settings?.minimum_delivery_amount) && (
          <DetailItem
            icon="attach-money"
            label="Minimum Delivery Amount"
            value={formatAmount(
              settings?.minimum_delivery_amount as string,
              currencySymbol,
            )}
          />
        )}
        {Boolean(settings?.currency) && (
          <DetailItem
            icon="currency-exchange"
            label="Default Currency"
            value={settings?.currency}
          />
        )}
        {Boolean(settings?.expiry_date) && (
          <DetailItem
            icon="event-busy"
            label="License Expiry Date"
            value={settings?.expiry_date}
          />
        )}
      </ActionCard>
    </View>
  );
}
