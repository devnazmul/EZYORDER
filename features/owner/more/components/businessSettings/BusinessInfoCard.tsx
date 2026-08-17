import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ServiceCard } from "@/components/reuseable";
import ENV from "@/config/env";

interface BusinessInfoCardProps {
  settings: any;
}

// Helper to resolve absolute URLs for relative assets
const resolveImageUrl = (path?: string) => {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const mediaBase = ENV.API_BASE_URL.replace("/api", "");
  return `${mediaBase}/${path}`;
};

export default function BusinessInfoCard({ settings }: BusinessInfoCardProps) {
  if (!settings) return null;

  // Render a single key-value info item
  const renderDetailItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    value: string | number | undefined | null,
  ) => {
    if (value === undefined || value === null || String(value).trim() === "") return null;
    return (
      <View className="flex-row items-start gap-3 py-3 border-b border-base-200/50">
        <View className="bg-primary/10 p-2 rounded-lg mt-0.5">
          <MaterialIcons name={icon} size={18} color="#DC2D2A" />
        </View>
        <View className="flex-1">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">{label}</Text>
          <Text className="text-sm font-bold text-neutral mt-0.5">{value}</Text>
        </View>
      </View>
    );
  };

  // Render a small enabled/disabled toggle block
  const renderToggleStatus = (label: string, isEnabled: boolean | number) => {
    const enabled = !!isEnabled;
    return (
      <View className="flex-row items-center justify-between py-2 border-b border-base-200/40">
        <Text className="text-xs font-semibold text-neutral">{label}</Text>
        <View
          className={`flex-row items-center px-2 py-0.5 rounded-full ${enabled ? "bg-green-50 border border-green-200" : "bg-neutral/5 border border-neutral/10"}`}
        >
          <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${enabled ? "bg-success" : "bg-accent/40"}`} />
          <Text className={`text-[10px] font-bold ${enabled ? "text-green-700" : "text-neutral/40"}`}>
            {enabled ? "ENABLED" : "DISABLED"}
          </Text>
        </View>
      </View>
    );
  };



  const addressString = [settings?.Address, settings?.PostCode].filter(Boolean).join(", ");
  const logoUri = resolveImageUrl(settings?.Logo);

  return (
    <View className="gap-y-6">
      {/* 1. Brand & Logo Header (Unified Row, No Cover Image) */}
      <View className="flex-row items-center gap-4 bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm">
        <View className="w-20 h-20 rounded-full border-2 border-primary/20 bg-base-200 overflow-hidden items-center justify-center">
          {logoUri ? (
            <Image source={{ uri: logoUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <Text className="text-2xl font-black text-primary">
              {(settings?.Name || "R").charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-xl font-black text-neutral">{settings?.Name || "Restaurant Name"}</Text>
          {settings?.business_type && (
            <View className="bg-secondary/15 self-start px-2.5 py-0.5 rounded-full mt-1.5">
              <Text className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                {settings.business_type}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* 3. About Description */}
      {settings?.About && (
        <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1.5">
            About The Restaurant
          </Text>
          <Text className="text-sm text-neutral/80 leading-relaxed font-semibold">{settings.About}</Text>
        </View>
      )}

      {/* 4. Contact Details */}
      <View className="bg-base-300 border border-base-200 rounded-xl px-4 py-1 shadow-sm">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest pt-3 pb-1">
          Contact Details
        </Text>
        {renderDetailItem("place", "Address", addressString)}
        {renderDetailItem("phone", "Phone Number", settings?.PhoneNumber)}
        {renderDetailItem("email", "Email Address", settings?.EmailAddress)}
        {renderDetailItem("language", "Webpage", settings?.Webpage)}
      </View>

      {/* 5. Services and Payment Methods */}
      <View>
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 px-1">
          Services & Payment Methods
        </Text>
        <ServiceCard
          icon="restaurant"
          title="Eat In / Dine-In"
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
      </View>

      {/* 6. Ordering Controls */}
      <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2">
          Ordering Options
        </Text>
        {renderToggleStatus("Customer Ordering Enabled", settings?.is_customer_order_enabled)}
        {renderToggleStatus("Customer Ordering Payments Allowed", settings?.enable_customer_order_payment)}
        {renderToggleStatus("Schedule Orders Allowed", settings?.is_customer_schedule_order)}
        {renderToggleStatus("Review Slider Enabled", settings?.is_review_silder)}
        {renderToggleStatus("Guest Checkout Allowed", settings?.Is_guest_user)}
      </View>

      {/* 7. Restaurant Configuration */}
      <View className="bg-base-300 border border-base-200 rounded-xl px-4 py-1 shadow-sm">
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest pt-3 pb-1">
          General Configurations
        </Text>
        {renderDetailItem("table-restaurant", "Total Tables", settings?.totalTables)}
        {renderDetailItem(
          "percent",
          "Tax Percentage",
          settings?.tax_percentage !== undefined ? `${settings.tax_percentage}%` : null,
        )}
        {renderDetailItem(
          "schedule",
          "Average Collection Time",
          settings?.average_collection_time ? `${settings.average_collection_time} minutes` : null,
        )}
        {renderDetailItem(
          "local-shipping",
          "Average Delivery Time",
          settings?.average_delivery_time ? `${settings.average_delivery_time} minutes` : null,
        )}
        {renderDetailItem(
          "map",
          "Delivery Radius",
          settings?.delivery_radius ? `${settings.delivery_radius} KM` : null,
        )}
        {renderDetailItem(
          "attach-money",
          "Minimum Delivery Amount",
          settings?.minimum_delivery_amount
            ? `${settings?.currency || ""} ${settings.minimum_delivery_amount}`
            : null,
        )}
        {renderDetailItem("currency-exchange", "Default Currency", settings?.currency)}
        {renderDetailItem("event-busy", "License Expiry Date", settings?.expiry_date)}
        {renderDetailItem("grid-view", "Layout View Mode", settings?.Layout)}
      </View>
    </View>
  );
}

