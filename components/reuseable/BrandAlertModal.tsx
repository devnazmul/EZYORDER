import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, View } from "react-native";
import Button from "./Button";

export interface BrandAlertConfig {
  visible: boolean;
  type: "info" | "success" | "error" | "confirm";
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
}

interface BrandAlertModalProps extends Omit<BrandAlertConfig, "onConfirm"> {
  onConfirm: () => void;
  onCancel?: () => void;
}

export default function BrandAlertModal({
  visible,
  type,
  title,
  description,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
}: BrandAlertModalProps) {
  const getIconAndColors = () => {
    switch (type) {
      case "success":
        return {
          icon: "check-circle" as const,
          iconColor: "#10b981",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-100",
        };
      case "error":
        return {
          icon: "error-outline" as const,
          iconColor: "#ef4444",
          bgColor: "bg-rose-50",
          borderColor: "border-rose-100",
        };
      case "confirm":
        return {
          icon: "help-outline" as const,
          iconColor: "#f59e0b",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-100",
        };
      case "info":
      default:
        return {
          icon: "info-outline" as const,
          iconColor: "#3b82f6",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-100",
        };
    }
  };

  const { icon, iconColor, bgColor, borderColor } = getIconAndColors();

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onCancel}>
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-base-300 w-full max-w-[320px] rounded-lg p-6 border border-slate-100/10 shadow-2xl items-center">
          {/* Circular Icon Header */}
          <View className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${bgColor} border ${borderColor}`}>
            <MaterialIcons name={icon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <Text className="text-sm font-black text-slate-900 text-center capitalize mb-2 tracking-wide">
            {title}
          </Text>

          {/* Description */}
          <Text className="text-xs font-bold text-slate-500 text-center leading-4 mb-6 px-1">
            {description}
          </Text>

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
