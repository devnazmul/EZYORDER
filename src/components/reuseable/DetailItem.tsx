// 1. React / React Native
import React from "react";
import { TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components & constants
import { COLORS } from "@/constants";
import {
  handleCallPhone,
  handleOpenMaps,
  handleOpenUrl,
  handleSendEmail,
} from "@/utils";
import { WP } from "@/utils/getResponsiveSizes";
import CustomText from "./CustomText";

export type IDetailItemLabelType =
  "default" | "phone" | "address" | "email" | "url";

export interface IDetailItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  value: string | number | undefined | null;
  labelType?: IDetailItemLabelType;
  isLast?: boolean;
}

export default function DetailItem({
  icon,
  label,
  value,
  labelType = "default",
  isLast = false,
}: Readonly<IDetailItemProps>) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  const strValue = String(value).trim();
  const iconSize = WP("4.5%");
  const isInteractive = labelType !== "default";

  const handlePress = () => {
    switch (labelType) {
      case "phone":
        handleCallPhone(strValue);
        break;
      case "address":
        handleOpenMaps(strValue);
        break;
      case "email":
        handleSendEmail(strValue);
        break;
      case "url":
        handleOpenUrl(strValue);
        break;
      default:
        break;
    }
  };

  const renderValueText = () => (
    <CustomText
      variant="primary"
      size="sm"
      weight="medium"
      style={isInteractive ? { color: COLORS.primary } : undefined}
    >
      {value}
    </CustomText>
  );

  return (
    <View
      style={{ paddingVertical: WP("2.5%"), gap: WP("3%") }}
      className={`flex-row items-start ${
        isLast ? "" : "border-b border-base-200/50"
      }`}
    >
      <View
        style={{ padding: WP("2%"), borderRadius: WP("2%") }}
        className="bg-primary/10 mt-0.5"
      >
        <MaterialIcons name={icon} size={iconSize} color={COLORS.primary} />
      </View>
      <View className="flex-1" style={{ flexDirection: "column", gap: 2 }}>
        <CustomText variant="secondary" size="xs" weight="semibold">
          {label}
        </CustomText>
        {isInteractive ? (
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityRole="link"
            accessibilityLabel={`${label}: ${value}`}
          >
            {renderValueText()}
          </TouchableOpacity>
        ) : (
          renderValueText()
        )}
      </View>
    </View>
  );
}
