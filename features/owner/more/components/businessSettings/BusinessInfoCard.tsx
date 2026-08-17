import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
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

  // Render payment options block for services (Eat-In, Takeaway, Delivery)
  const renderServiceCard = (
    icon: keyof typeof MaterialIcons.glyphMap,
    title: string,
    isEnabled: boolean | number,
    paymentMode?: { cash: number; stripe: number },
  ) => {
    const enabled = !!isEnabled;
    return (
      <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4">
        <View className="flex-row items-center justify-between pb-3 border-b border-base-200/50 mb-3">
          <View className="flex-row items-center gap-2">
            <View className={`p-1.5 rounded-lg ${enabled ? "bg-primary/10" : "bg-neutral/5"}`}>
              <MaterialIcons name={icon} size={18} color={enabled ? "#DC2D2A" : "#6E6E6E"} />
            </View>
            <Text className="text-md font-bold text-neutral">{title}</Text>
          </View>
          <View
            className={`px-2.5 py-0.5 rounded-full border ${enabled ? "bg-green-50 border-green-100" : "bg-neutral/5 border-neutral/10"}`}
          >
            <Text className={`text-[9px] font-bold ${enabled ? "text-green-700" : "text-neutral/40"}`}>
              {enabled ? "ACTIVE" : "INACTIVE"}
            </Text>
          </View>
        </View>

        {enabled ? (
          <View className="space-y-2">
            <Text className="text-[10px] font-bold text-accent uppercase tracking-wider mb-1">
              Accepted Payment Modes
            </Text>
            <View className="flex-row gap-3">
              <View
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg border ${paymentMode?.cash ? "bg-primary/5 border-primary/20 text-primary" : "bg-base-200 border-transparent"}`}
              >
                <MaterialIcons
                  name="attach-money"
                  size={14}
                  color={paymentMode?.cash ? "#DC2D2A" : "#6E6E6E"}
                  style={{ marginRight: 4 }}
                />
                <Text className={`text-xs font-bold ${paymentMode?.cash ? "text-primary" : "text-accent"}`}>
                  Cash
                </Text>
              </View>
              <View
                className={`flex-1 flex-row items-center justify-center py-2 px-3 rounded-lg border ${paymentMode?.stripe ? "bg-primary/5 border-primary/20 text-primary" : "bg-base-200 border-transparent"}`}
              >
                <MaterialIcons
                  name="credit-card"
                  size={14}
                  color={paymentMode?.stripe ? "#DC2D2A" : "#6E6E6E"}
                  style={{ marginRight: 4 }}
                />
                <Text className={`text-xs font-bold ${paymentMode?.stripe ? "text-primary" : "text-accent"}`}>
                  Card/Online
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text className="text-xs font-semibold text-accent/50 italic py-1 text-center">
            Service is disabled
          </Text>
        )}
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
        {renderServiceCard(
          "restaurant",
          "Eat In / Dine-In",
          settings?.is_eat_in,
          settings?.eat_in_payment_mode,
        )}
        {renderServiceCard(
          "takeout-dining",
          "Takeaway",
          settings?.is_take_away,
          settings?.takeaway_payment_mode,
        )}
        {renderServiceCard(
          "local-shipping",
          "Delivery",
          settings?.is_delivery,
          settings?.delivery_payment_mode,
        )}
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
