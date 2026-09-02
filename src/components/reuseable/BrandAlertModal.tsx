// 1. React / React Native
import React from "react";
import { Modal, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import Button from "./Button";
import CustomText from "./CustomText";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";

export type IBrandAlertType = "info" | "success" | "error" | "confirm";

export interface IBrandAlertConfig {
  readonly visible: boolean;
  readonly type: IBrandAlertType;
  readonly title: string;
  readonly description: string;
  readonly confirmText?: string;
  readonly cancelText?: string;
  readonly onConfirm?: () => void;
}

export interface IBrandAlertModalProps extends Omit<
  IBrandAlertConfig,
  "onConfirm"
> {
  readonly onConfirm: () => void;
  readonly onCancel?: () => void;
}

interface IAlertVisualConfig {
  readonly icon: keyof typeof MaterialIcons.glyphMap;
  readonly iconColor: string;
  readonly bgColor: string;
  readonly borderColor: string;
}

const BRAND_ALERT_TYPE_CONFIG: Record<IBrandAlertType, IAlertVisualConfig> = {
  success: {
    icon: "check-circle",
    iconColor: COLORS.success,
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-100",
  },
  error: {
    icon: "error-outline",
    iconColor: COLORS.error,
    bgColor: "bg-rose-50",
    borderColor: "border-rose-100",
  },
  confirm: {
    icon: "help-outline",
    iconColor: COLORS.primary,
    bgColor: "bg-amber-50",
    borderColor: "border-amber-100",
  },
  info: {
    icon: "info-outline",
    iconColor: COLORS.info,
    bgColor: "bg-blue-50",
    borderColor: "border-blue-100",
  },
};

export default function BrandAlertModal({
  visible,
  type = "info",
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: Readonly<IBrandAlertModalProps>) {
  const { icon, iconColor, bgColor, borderColor } =
    BRAND_ALERT_TYPE_CONFIG[type] || BRAND_ALERT_TYPE_CONFIG.info;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-base-300 w-full max-w-[320px] rounded-lg p-6 border border-slate-100/10 shadow-2xl items-center">
          {/* Circular Icon Header */}
          <View
            className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${bgColor} border ${borderColor}`}
          >
            <MaterialIcons name={icon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <CustomText
            variant="primary"
            size="sm"
            weight="semibold"
            className="text-center capitalize mb-2 tracking-wide"
          >
            {title}
          </CustomText>

          {/* Description */}
          {Boolean(description) && (
            <CustomText
              variant="tertiary"
              size="xs"
              weight="medium"
              className="text-center leading-4 mb-6 px-1"
            >
              {description}
            </CustomText>
          )}

          {/* Action Buttons */}
          {type === "confirm" ? (
            <View className="flex-row gap-3 w-full">
              <View className="flex-1">
                <Button
                  label={cancelText || "Cancel"}
                  onPress={onCancel || (() => {})}
                  variant="secondary"
                />
              </View>
              <View className="flex-1">
                <Button
                  label={confirmText || "Confirm"}
                  onPress={onConfirm}
                  variant="primary"
                />
              </View>
            </View>
          ) : (
            <Button
              label={confirmText || "OK"}
              onPress={onConfirm}
              variant="primary"
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
