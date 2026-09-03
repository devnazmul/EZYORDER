import { Badge, CustomText, StatusBadge } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { getPaymentMethodsConfig } from "@/utils";
import { WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

export interface IServiceCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  isEnabled: boolean | number;
  paymentMode?: { cash: number; stripe: number };
}

interface IPaymentModeBadgeProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  isEnabled: boolean;
  color: string;
}

function PaymentModeBadge({
  icon,
  label,
  isEnabled,
  color,
}: Readonly<IPaymentModeBadgeProps>) {
  const badgeIconSize = WP("3.5%");

  return (
    <View
      className="flex-1"
      accessibilityRole="text"
      accessibilityLabel={`${label}: ${isEnabled ? "Enabled" : "Disabled"}`}
    >
      <Badge
        text={label}
        icon={
          <MaterialIcons
            name={icon}
            size={badgeIconSize}
            color={isEnabled ? color : COLORS.accent}
          />
        }
        containerClassName={`justify-center py-2 px-3 rounded-lg border ${
          isEnabled ? "" : "bg-base-200 border-transparent"
        }`}
        containerStyle={
          isEnabled
            ? {
                backgroundColor: `${color}10`,
                borderColor: `${color}40`,
              }
            : undefined
        }
        textClassName={isEnabled ? "" : "text-accent"}
        textStyle={isEnabled ? { color } : undefined}
      />
    </View>
  );
}

export function ServiceCard({
  icon,
  title,
  isEnabled,
  paymentMode,
}: Readonly<IServiceCardProps>) {
  const enabled = !!isEnabled;
  const cashConfig = getPaymentMethodsConfig("cash");
  const cardConfig = getPaymentMethodsConfig("card");

  const isCashEnabled = Boolean(paymentMode?.cash);
  const isCardEnabled = Boolean(paymentMode?.stripe);
  const headerIconSize = WP("4.5%");

  return (
    <View className="bg-base-300 border border-base-200 rounded-xl p-4 shadow-sm mb-4">
      <View className="flex-row items-center justify-between pb-3 border-b border-base-200/50 mb-3">
        <View className="flex-row items-center gap-2">
          <View
            className={`p-1.5 rounded-lg ${enabled ? "bg-primary/10" : "bg-neutral/5"}`}
          >
            <MaterialIcons
              name={icon}
              size={headerIconSize}
              color={enabled ? COLORS.primary : COLORS.accent}
            />
          </View>
          <CustomText variant="primary" size="sm" weight="bold">
            {title}
          </CustomText>
        </View>
        <StatusBadge status={enabled ? "active" : "inactive"} />
      </View>

      {enabled ? (
        <View className="">
          <CustomText
            variant="secondary"
            size="xs"
            weight="semibold"
            className="mb-2"
          >
            Accepted Payment Modes
          </CustomText>
          <View className="flex-row gap-2">
            <PaymentModeBadge
              icon={cashConfig.icon}
              label={cashConfig.label}
              isEnabled={isCashEnabled}
              color={cashConfig.color}
            />
            <PaymentModeBadge
              icon={cardConfig.icon}
              label="Card/Online"
              isEnabled={isCardEnabled}
              color={cardConfig.color}
            />
          </View>
        </View>
      ) : (
        <CustomText
          variant="tertiary"
          size="xs"
          weight="semibold"
          className="italic py-1 text-center"
        >
          Service is disabled
        </CustomText>
      )}
    </View>
  );
}

export default ServiceCard;
