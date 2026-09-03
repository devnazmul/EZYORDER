import BottomSheet from "@/components/reuseable/BottomSheet";
import BrandAlertModal, { BrandAlertConfig } from "@/components/reuseable/BrandAlertModal";
import Button from "@/components/reuseable/Button";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Text, View } from "react-native";

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
    triggerExceptionModal?.(orderId, "failed", "Reason For Failure", [
      "Customer Unavailable",
      "Wrong Address",
      "Order Damaged",
      "Other",
    ]);
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
    triggerExceptionModal?.(orderId, "damaged", "Report Damage", [
      "Packaging Ruined",
      "Items Spilled",
      "Cold Food",
      "Other",
    ]);
  };

  const handleRetryDelivery = () => {
    onClose();
    handleRetry?.(orderId);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["37%"]}>
      {/* Header */}
      <View className="flex-row items-center gap-3 border-b border-base-200 pb-3 px-6 pt-2">
        <View className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 items-center justify-center">
          <MaterialIcons name="error-outline" size={18} color="#e11d48" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-neutral tracking-wider">Help & Exception Handling</Text>
          <Text className="text-[10px] text-slate-400 font-semibold mt-0.5 capitalize">
            Report delivery issues or retry actions
          </Text>
        </View>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        {/* Grid list of help items */}
        <View className="gap-2.5 mb-6">
          <Button
            label="Failed Delivery"
            onPress={handleFailedDelivery}
            containerClassName="!border-rose-200 !bg-rose-50"
            buttonClassName="!text-rose-600"
            icon={<MaterialIcons name="block" size={16} color="#e11d48" />}
          />
          <Button
            label="Wrong Address"
            onPress={handleWrongAddress}
            containerClassName="!border-amber-200 !bg-amber-50"
            buttonClassName="!text-amber-600"
            icon={<MaterialIcons name="place" size={16} color="#d97706" />}
          />
          <Button
            label="Order Damaged"
            onPress={handleOrderDamaged}
            containerClassName="!border-orange-200 !bg-orange-50"
            buttonClassName="!text-orange-600"
            icon={<MaterialIcons name="view-in-ar" size={16} color="#ea580c" />}
          />
          <Button
            label="Retry Delivery"
            onPress={handleRetryDelivery}
            containerClassName="!border-blue-200 !bg-blue-50"
            buttonClassName="!text-blue-600"
            icon={<MaterialIcons name="sync" size={16} color="#2563eb" />}
          />
        </View>
      </BottomSheetScrollView>

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
    </BottomSheet>
  );
}
