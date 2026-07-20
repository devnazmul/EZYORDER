import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Button from "@/components/reuseable/Button";
import BrandAlertModal, { BrandAlertConfig } from "@/components/reuseable/BrandAlertModal";

interface HelpDrawerProps {
  orderId: string | number | null;
  visible: boolean;
  onClose: () => void;
  triggerExceptionModal?: (
    orderId: string | number,
    type: "failed" | "cancel" | "damaged",
    title: string,
    reasons: string[],
  ) => void;
  handleRetry?: (orderId: string | number) => void;
}

export default function HelpDrawer({
  orderId,
  visible,
  onClose,
  triggerExceptionModal,
  handleRetry,
}: HelpDrawerProps) {
  const [alertConfig, setAlertConfig] = useState<BrandAlertConfig>({
    visible: false,
    title: "",
    description: "",
    type: "info",
  });

  if (!orderId) return null;

  const showAlert = (
    title: string,
    description: string,
    type: "info" | "success" | "error" | "confirm" = "info",
    onConfirm?: () => void,
  ) => {
    setAlertConfig({
      visible: true,
      title,
      description,
      type,
      confirmText: "Confirm",
      cancelText: "Cancel",
      onConfirm: () => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
        if (onConfirm) onConfirm();
      },
    });
  };

  const handleFailedDelivery = () => {
    onClose();
    triggerExceptionModal?.(
      orderId,
      "failed",
      "Reason For Failure",
      ["Customer Unavailable", "Wrong Address", "Order Damaged", "Other"],
    );
  };

  const handleWrongAddress = () => {
    onClose();
    showAlert(
      "Incorrect Address",
      "To update the address details, please contact the dispatch support center.",
      "info",
    );
  };

  const handleOrderDamaged = () => {
    onClose();
    triggerExceptionModal?.(
      orderId,
      "damaged",
      "Report Damage",
      ["Packaging Ruined", "Items Spilled", "Cold Food", "Other"],
    );
  };

  const handleRetryDelivery = () => {
    onClose();
    handleRetry?.(orderId);
  };

  const handleCancelOrder = () => {
    onClose();
    triggerExceptionModal?.(
      orderId,
      "cancel",
      "Cancel Delivery",
      ["Customer Request", "Address Issue", "Force Majeure", "Other"],
    );
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 bg-black/60 justify-end">
        {/* Backdrop tap to close */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={onClose}
          className="absolute inset-0 w-full h-full"
        />

        <View className="bg-base-300 w-full rounded-t-lg p-6 border-t border-slate-100/10 shadow-2xl">
          {/* Drag handle */}
          <View className="w-12 h-1 bg-slate-200 rounded-full self-center mb-5" />

          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-slate-900 capitalize">Help & Exceptions</Text>
              <Text className="text-[10px] text-slate-400 font-semibold mt-0.5 capitalize">
                Report delivery issues or retry actions
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 items-center justify-center"
            >
              <MaterialIcons name="close" size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* Grid list of help items */}
          <View className="gap-2.5 mb-6">
            <Button
              label="Failed Delivery"
              onPress={handleFailedDelivery}
              variant="secondary"
              containerClassName="border border-rose-100/50 bg-rose-50/20"
            />
            <Button
              label="Wrong Address"
              onPress={handleWrongAddress}
              variant="secondary"
              containerClassName="border border-amber-100/50 bg-amber-50/20"
            />
            <Button
              label="Order Damaged"
              onPress={handleOrderDamaged}
              variant="secondary"
              containerClassName="border border-orange-100/50 bg-orange-50/20"
            />
            <Button
              label="Retry Delivery"
              onPress={handleRetryDelivery}
              variant="secondary"
              containerClassName="border border-blue-100/50 bg-blue-50/20"
            />
            <Button
              label="Cancel Order"
              onPress={handleCancelOrder}
              variant="secondary"
              containerClassName="border border-slate-200/50 bg-slate-50/20"
            />
          </View>

          <Button label="Close Help" onPress={onClose} variant="primary" />
        </View>
      </View>

      <BrandAlertModal
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        description={alertConfig.description}
        confirmText={alertConfig.confirmText}
        cancelText={alertConfig.cancelText}
        onConfirm={alertConfig.onConfirm || (() => {})}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, visible: false }))}
      />
    </Modal>
  );
}
