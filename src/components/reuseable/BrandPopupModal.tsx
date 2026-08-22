import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface BrandPopupModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
  bgColor?: string;
  borderColor?: string;
  children?: React.ReactNode;
}

export default function BrandPopupModal({
  visible,
  onClose,
  title,
  description,
  icon = "info-outline",
  iconColor = "#3b82f6",
  bgColor = "bg-blue-50",
  borderColor = "border-blue-100",
  children,
}: BrandPopupModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-slate-900/60 justify-center items-center px-6">
        <View className="bg-base-300 w-full max-w-[320px] rounded-lg p-6 border border-slate-100/10 shadow-2xl items-center relative">
          {/* Close button on top-right */}
          <TouchableOpacity
            onPress={onClose}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100/10 items-center justify-center"
          >
            <MaterialIcons name="close" size={16} color="#94a3b8" />
          </TouchableOpacity>

          {/* Circular Icon Header */}
          <View className={`w-14 h-14 rounded-full items-center justify-center mb-4 ${bgColor} border ${borderColor}`}>
            <MaterialIcons name={icon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <Text className="text-sm font-black text-slate-900 text-center capitalize mb-2 tracking-wide">
            {title}
          </Text>

          {/* Description */}
          {description ? (
            <Text className="text-xs font-bold text-slate-500 text-center leading-4 mb-4 px-1">
              {description}
            </Text>
          ) : null}

          {/* Custom Content Children */}
          <View className="w-full">
            {children}
          </View>
        </View>
      </View>
    </Modal>
  );
}
