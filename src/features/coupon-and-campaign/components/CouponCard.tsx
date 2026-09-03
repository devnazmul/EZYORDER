import { formatDateTime } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Alert, Share, Text, TouchableOpacity, View } from "react-native";
import * as Clipboard from "expo-clipboard";

interface CouponCardProps {
  coupon: {
    id: number | string;
    name: string;
    code: string;
    discount_amount: number | string;
    discount_type?: string;
    coupon_start_date?: string;
    coupon_end_date?: string;
    is_auto_apply?: number | boolean;
    is_active?: number | boolean;
    redemptions?: number | string;
    description?: string;
  };
}

export default function CouponCard({ coupon }: CouponCardProps) {
  // Format discount text (e.g. "15% OFF" or "$10.00 OFF")
  const discountDisplay = useMemo(() => {
    const amount = Number(coupon.discount_amount || 0);
    if (coupon.discount_type === "percentage") {
      return `${amount}% OFF`;
    }
    // Fixed amount formatting
    return `$${amount.toFixed(2)} OFF`;
  }, [coupon.discount_amount, coupon.discount_type]);

  const isActive = coupon.is_active !== undefined ? !!coupon.is_active : true;
  const isAutoApply = !!coupon.is_auto_apply;

  // Format date range nicely
  const dateRangeStr = useMemo(() => {
    if (!coupon.coupon_start_date && !coupon.coupon_end_date) return "Always Valid";
    const startFormatted = coupon.coupon_start_date
      ? formatDateTime(coupon.coupon_start_date.split(" ")[0])
      : "";
    const endFormatted = coupon.coupon_end_date
      ? formatDateTime(coupon.coupon_end_date.split(" ")[0])
      : "";
    if (startFormatted && endFormatted) {
      return `${startFormatted} - ${endFormatted}`;
    }
    return startFormatted || endFormatted;
  }, [coupon.coupon_start_date, coupon.coupon_end_date]);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(coupon.code);
    Alert.alert("Copied!", `Coupon code "${coupon.code}" copied to clipboard.`);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use code ${coupon.code} to get ${discountDisplay} at our restaurant! Valid until ${coupon.coupon_end_date?.split(" ")[0] || "further notice"}.`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <View className="bg-base-300 border border-base-200 rounded-lg mb-4 shadow-sm flex-row overflow-hidden min-h-[120px]">
      
      {/* Left Ticket Part: Value & Type */}
      <View className="bg-primary/5 items-center justify-center p-4 w-[110px] border-r border-dashed border-base-200 relative">
        <Text className="text-sm font-black text-primary text-center">
          {discountDisplay}
        </Text>
        <Text className="text-[10px] text-accent uppercase tracking-widest mt-1.5 font-bold">
          {coupon.discount_type === "percentage" ? "Percent" : "Flat discount"}
        </Text>
        
        {/* Ticket punch hole decorations */}
        <View className="w-4 h-4 rounded-full bg-base-100 absolute -top-2 -right-2 border border-base-200" />
        <View className="w-4 h-4 rounded-full bg-base-100 absolute -bottom-2 -right-2 border border-base-200" />
      </View>

      {/* Right Ticket Part: Coupon Details */}
      <View className="flex-1 p-4 justify-between">
        
        {/* Top Title & Code badge */}
        <View>
          <View className="flex-row justify-between items-start mb-1.5">
            <Text className="text-sm font-bold text-neutral flex-1 mr-2" numberOfLines={2}>
              {coupon.name || "Special Discount"}
            </Text>
            
            <View className={`px-2 py-[2px] rounded-full ${isActive ? "bg-green-500/10" : "bg-neutral/10"}`}>
              <Text className={`text-[8px] font-black uppercase ${isActive ? "text-green-500" : "text-accent"}`}>
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* Description (if exists) */}
          {coupon.description ? (
            <Text className="text-[11px] text-accent font-semibold leading-4 mb-2" numberOfLines={2}>
              {coupon.description}
            </Text>
          ) : null}
        </View>

        {/* Bottom Details (Dates, Auto Apply, Redemptions, Code copy) */}
        <View className="gap-y-1.5 mt-2">
          {/* Validity dates & Redemptions */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="event" size={12} color="#6E6E6E" />
              <Text className="text-[10px] text-accent font-semibold">{dateRangeStr}</Text>
            </View>
            {coupon.redemptions !== undefined && (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="confirmation-number" size={12} color="#6E6E6E" />
                <Text className="text-[10px] text-accent font-bold">Used: {coupon.redemptions}</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-between pt-2 border-t border-base-100">
            {/* Auto Apply indicator */}
            {isAutoApply ? (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="flash-on" size={12} color="#00677F" />
                <Text className="text-[9px] font-bold text-secondary uppercase tracking-tight">Auto Applies</Text>
              </View>
            ) : (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="lock-open" size={12} color="#6E6E6E" />
                <Text className="text-[9px] font-bold text-accent uppercase tracking-tight">Needs Code</Text>
              </View>
            )}

            {/* Code Copy & Share Trigger */}
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={handleShare}
                className="p-1 rounded bg-base-100 active:bg-base-200"
              >
                <MaterialIcons name="share" size={14} color="#6E6E6E" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCopyCode}
                className="bg-base-200 border border-dashed border-accent/40 rounded-lg px-2.5 py-1.5 flex-row items-center gap-1 active:bg-base-100"
              >
                <Text className="text-[11px] font-black text-neutral uppercase tracking-widest">
                  {coupon.code}
                </Text>
                <MaterialIcons name="content-copy" size={10} color="#000000" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </View>
    </View>
  );
}
