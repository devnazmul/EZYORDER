import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";

interface PartnerCardProps {
  item: {
    id: number | string;
    delivery: number;
    delivery_order_commission?: string;
    delivery_shop_link?: string;
    eat_in: number;
    eat_in_order_commission?: string;
    eat_in_shop_link?: string;
    takeaway: number;
    takeaway_order_commission?: string;
    takeaway_link?: string;
    contact_details?: string;
    api_key?: string | null;
    payment_terms?: string | null;
    is_active: number;
    restaurant_partner?: {
      name: string;
    } | null;
  };
}

export default function PartnerCard({ item }: PartnerCardProps) {
  const partnerName = item.restaurant_partner ? JSON.stringify(item.restaurant_partner) : `Unnamed Partner`;
  const isActive = item.is_active === 1;

  const parseContactDetails = (contactDetailsStr: any) => {
    if (!contactDetailsStr) return null;
    if (typeof contactDetailsStr === "object") return contactDetailsStr;
    try {
      return JSON.parse(contactDetailsStr);
    } catch {
      return { contact_person: contactDetailsStr };
    }
  };

  const contact = parseContactDetails(item.contact_details);

  const handleOpenLink = (url?: string) => {
    if (!url) return;
    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }
    Linking.openURL(formattedUrl).catch((err) => {
      console.error("Failed to open URL:", err);
    });
  };

  return (
    <View className="bg-base-200 border border-base-300 rounded-2xl p-4 overflow-hidden">
      {/* Header: Name and Active status */}
      <View className="flex-row justify-between items-center mb-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-primary/10 p-2 rounded-xl">
            <MaterialIcons name="business" size={20} color="#DC2D2A" />
          </View>
          <Text className="text-sm font-bold text-neutral">{partnerName}</Text>
        </View>
        <View
          className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
            isActive ? "bg-green-500/10" : "bg-neutral/10"
          }`}
        >
          <View className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-green-500" : "bg-neutral-500"}`} />
          <Text
            className={`text-[9px] font-bold uppercase tracking-wider ${
              isActive ? "text-green-500" : "text-accent"
            }`}
          >
            {isActive ? "Connected" : "Disconnected"}
          </Text>
        </View>
      </View>

      {/* Commission Details Grid */}
      <View className="bg-base-100 border border-base-300 rounded-xl p-3 mb-3 gap-y-3">
        {/* Eat In Channel */}
        {item.eat_in !== 0 && (
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="store" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Eat In ({item.eat_in})</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">{item.eat_in_order_commission} Commision</Text>
              {item.eat_in_shop_link ? (
                <TouchableOpacity onPress={() => handleOpenLink(item.eat_in_shop_link)} activeOpacity={0.7}>
                  <Text className="text-[10px] text-primary underline mt-0.5" numberOfLines={1}>
                    {item.eat_in_shop_link}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        {/* Delivery Channel */}
        {item.delivery !== 0 && (
          <View className="flex-row justify-between items-center border-t border-base-300/50 pt-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="delivery-dining" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Delivery ({item.delivery})</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">
                {item.delivery_order_commission} Commision
              </Text>
              {item.delivery_shop_link ? (
                <TouchableOpacity onPress={() => handleOpenLink(item.delivery_shop_link)} activeOpacity={0.7}>
                  <Text className="text-[10px] text-primary underline mt-0.5" numberOfLines={1}>
                    {item.delivery_shop_link}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}

        {/* Takeaway Channel */}
        {item.takeaway !== 0 && (
          <View className="flex-row justify-between items-center border-t border-base-300/50 pt-3">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="shopping-bag" size={14} color="#6E6E6E" />
              <Text className="text-xs text-accent">Takeaway ({item.takeaway})</Text>
            </View>
            <View className="items-end">
              <Text className="text-xs font-bold text-neutral">
                {item.takeaway_order_commission} Commision
              </Text>
              {item.takeaway_link ? (
                <TouchableOpacity onPress={() => handleOpenLink(item.takeaway_link)} activeOpacity={0.7}>
                  <Text className="text-[10px] text-primary underline mt-0.5" numberOfLines={1}>
                    {item.takeaway_link}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
      </View>

      {/* Extra Partner info: Contact, API Key, Payment Terms */}
      <View className="px-1 gap-y-1">
        {contact && (contact.contact_person || contact.contact_number) ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold text-accent">Contact:</Text>
            <Text className="text-[10px] text-neutral font-semibold">
              {[contact.contact_person, contact.contact_number].filter(Boolean).join(" - ")}
            </Text>
          </View>
        ) : null}

        {item.payment_terms ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold text-accent">Payment Terms:</Text>
            <Text className="text-[10px] text-neutral font-semibold">{item.payment_terms}</Text>
          </View>
        ) : null}

        {item.api_key ? (
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] font-bold text-accent">API Key:</Text>
            <Text className="text-[10px] text-neutral font-semibold" numberOfLines={1}>
              {item.api_key}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
