// 1. React / React Native
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. Shared components
import { Badge, CustomText } from "@/components/reuseable";

// 4. Feature components
import CouponCopyButton from "./CouponCopyButton";

// 5. Types
import type { ICoupon } from "../types/coupon.types";

// 6. Constants/utils
import { COLORS } from "@/constants";
import { formatAmount, formatDate, getGeneralStatusConfig } from "@/utils";
import { shareCoupon } from "../utils/shareCoupon";

interface ICouponCardProps {
  coupon: ICoupon;
  currencySymbol?: string;
}

export default function CouponCard({
  coupon,
  currencySymbol = "£",
}: Readonly<ICouponCardProps>) {
  const discountDisplay =
    coupon.discount_type === "percentage"
      ? `${coupon.discount_amount || 0}% Off`
      : `${formatAmount(coupon.discount_amount, currencySymbol)} Off`;

  const statusConfig = getGeneralStatusConfig(
    coupon.is_active ? "active" : "inactive",
  );

  const handleShare = () => {
    shareCoupon(coupon, discountDisplay);
  };

  return (
    <View
      className="bg-base-300 border border-base-200 rounded-xl shadow-sm flex-row min-h-[120px]"
      style={{ overflow: "hidden" }}
    >
      {/* Left Ticket Part: Value & Type */}
      <View className="bg-primary/5 items-center justify-center p-3 sm:p-4 w-[100px] sm:w-[120px] border-r border-dashed border-base-200 relative overflow-hidden rounded-l-xl">
        <CustomText
          variant="brand-primary"
          size="sm"
          weight="bold"
          className="text-center"
          numberOfLines={2}
        >
          {discountDisplay}
        </CustomText>
        <CustomText
          variant="tertiary"
          size="xs"
          weight="bold"
          className="mt-1.5 text-center"
          numberOfLines={1}
        >
          {coupon.discount_type === "percentage" ? "Percent" : "Flat discount"}
        </CustomText>
      </View>

      {/* Right Ticket Part: Coupon Details */}
      <View
        className="flex-1 p-3 sm:p-4 justify-between"
        style={{ overflow: "visible" }}
      >
        <View>
          {/* Top Row: Title & Share Button on Top Right */}
          <View className="flex-row justify-between items-start mb-1.5 gap-2">
            <CustomText
              variant="primary"
              size="sm"
              weight="bold"
              className="flex-1 mr-1"
              numberOfLines={2}
            >
              {coupon.name || "Special Discount"}
            </CustomText>

            <TouchableOpacity
              onPress={handleShare}
              className="p-1 rounded bg-base-100 active:bg-base-200 shrink-0"
            >
              <MaterialIcons name="share" size={14} color={COLORS.accent} />
            </TouchableOpacity>
          </View>

          {/* Row 2: Active / Inactive Status Badge */}
          <View className="flex-row items-center mb-1.5 flex-wrap">
            <Badge
              text={statusConfig.label}
              icon={
                <MaterialIcons
                  name={statusConfig.iconName}
                  size={10}
                  color={statusConfig.iconColor}
                  style={{ marginRight: 2 }}
                />
              }
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

          {/* Row 3: Used Coupons */}
          {!!coupon.redemptions && (
            <View className="flex-row items-center gap-1 mb-1.5 flex-wrap">
              <MaterialIcons
                name="confirmation-number"
                size={12}
                color={COLORS.accent}
              />
              <CustomText variant="tertiary" size="xs" weight="semibold">
                Redemptions: {Number(coupon.redemptions)}
              </CustomText>
            </View>
          )}

          {/* Row 4: Dates below Used Coupons */}
          {(!!coupon.coupon_start_date || !!coupon.coupon_end_date) && (
            <View className="flex-row items-center gap-1 mb-1.5 flex-wrap">
              <MaterialIcons name="event" size={12} color={COLORS.accent} />
              {!!coupon.coupon_start_date && (
                <CustomText variant="tertiary" size="xs" weight="semibold">
                  {formatDate(coupon.coupon_start_date, "DD-MM-YYYY")}
                </CustomText>
              )}
              {!!coupon.coupon_start_date && !!coupon.coupon_end_date && (
                <CustomText variant="tertiary" size="xs" weight="semibold">
                  -
                </CustomText>
              )}
              {!!coupon.coupon_end_date && (
                <CustomText variant="tertiary" size="xs" weight="semibold">
                  {formatDate(coupon.coupon_end_date, "DD-MM-YYYY")}
                </CustomText>
              )}
            </View>
          )}
        </View>

        {/* Bottom Right: Auto Applies / Coupon Code */}
        <View
          className="flex-row items-center justify-end pt-2 border-t border-base-100 mt-2 z-10"
          style={{ overflow: "visible" }}
        >
          {coupon.is_auto_apply ? (
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="flash-on" size={12} color={COLORS.primary} />
              <CustomText variant="brand-primary" size="xs" weight="bold">
                Auto Applies
              </CustomText>
            </View>
          ) : (
            <CouponCopyButton code={coupon.code} />
          )}
        </View>
      </View>
    </View>
  );
}
