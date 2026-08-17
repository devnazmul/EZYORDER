import ENV from "@/config/env";
import { useData } from "@/context/context/DataContext";
import { formatAmount, formatDateTime } from "@/utils/formatters";
import { getCurrencySymbol } from "@/utils/getCurrencySymbol";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Alert, Image, Modal, ScrollView, Share, Text, TouchableOpacity, View } from "react-native";

interface ExpenseDetailModalProps {
  visible: boolean;
  onClose: () => void;
  expense: {
    id: number | string;
    amount: number | string;
    payment_date: string;
    payment_method: string;
    paid_by?: string;
    note?: string;
    description?: string;
    expense_type: string | number;
    reciepts?: any[];
    shareable_link?: string;
  } | null;
  expenseTypes: any[];
}

export default function ExpenseDetailModal({
  visible,
  onClose,
  expense,
  expenseTypes,
}: ExpenseDetailModalProps) {
  const { settings } = useData();
  const [previewImageUri, setPreviewImageUri] = useState<string | null>(null);

  // Resolve currency symbol
  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(settings?.currency);
  }, [settings?.currency]);

  // Map category details
  const categoryName = useMemo(() => {
    if (!expense) return "Other";
    const typeId = String(expense.expense_type);
    const matchedType = expenseTypes.find((opt) => String(opt?.id) === typeId);
    return matchedType?.name || (typeof expense.expense_type === "string" ? expense.expense_type : "Other");
  }, [expense, expenseTypes]);

  // Payment Method formatted label
  const paymentMethodLabel = useMemo(() => {
    if (!expense) return "N/A";
    const method = String(expense.payment_method || "").toLowerCase();
    if (method === "card") return "Credit/Debit Card";
    if (method === "cash") return "Cash";
    if (method === "bank" || method === "bank_transfer") return "Bank Transfer";
    return expense.payment_method || "N/A";
  }, [expense]);

  // Safe receipt URL builder
  const getReceiptImageUri = (receipt: any) => {
    if (!receipt) return "";
    const path = typeof receipt === "string" ? receipt : receipt.path || receipt.file || "";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    // Remove trailing "/api" if present on EXPO_PUBLIC_API_BASE_URL
    const baseUrl = ENV.API_BASE_URL.replace(/\/api\/?$/, "");
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  };

  const handleShare = async () => {
    if (!expense?.shareable_link) return;
    try {
      const baseUrl = ENV.API_BASE_URL.replace(/\/api\/?$/, "");
      const shareUrl = `${baseUrl}${expense.shareable_link}`;
      await Share.share({
        message: `Expense Receipt (${categoryName} - ${formattedAmount}): ${shareUrl}`,
        url: shareUrl,
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to share receipt link");
    }
  };

  if (!expense) return null;

  const formattedAmount = formatAmount(expense.amount, currencySymbol);

  const formattedDate = expense.payment_date ? formatDateTime(expense.payment_date.split(" ")[0]) : "N/A";
  const receiptsList = expense.reciepts || [];

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          {/* Backdrop clickable to close */}
          <TouchableOpacity activeOpacity={1} onPress={onClose} className="absolute inset-0" />

          {/* Modal Bottom Sheet Content Container */}
          <View className="bg-base-100 rounded-t-lg p-6 max-h-[80%] border-t border-base-200">
            {/* Header Bar */}
            <View className="flex-row justify-between items-center mb-6">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="receipt-long" size={20} color="#DC2D2A" />
                <Text className="text-sm font-black text-neutral uppercase tracking-widest">
                  Expense Details
                </Text>
              </View>
              <TouchableOpacity onPress={onClose} className="p-1 rounded-full bg-base-300">
                <MaterialIcons name="close" size={20} color="#6E6E6E" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Amount Banner */}
              <View className="bg-base-300 rounded-lg p-5 items-center justify-center mb-6 border border-base-200">
                <Text className="text-xs font-bold text-accent uppercase tracking-widest mb-1">
                  Amount Paid
                </Text>
                <Text className="text-3xl font-black text-primary">{formattedAmount}</Text>
              </View>

              {/* Information Grid Section */}
              <View className="space-y-4 mb-6">
                {/* Paid By / Vendor */}
                <View className="flex-row justify-between py-2.5 border-b border-base-200">
                  <Text className="text-xs font-bold text-accent">Paid By / Vendor</Text>
                  <Text className="text-xs font-bold text-neutral text-right flex-1 ml-4" numberOfLines={2}>
                    {expense.paid_by || "N/A"}
                  </Text>
                </View>

                {/* Expense Type / Category */}
                <View className="flex-row justify-between py-2.5 border-b border-base-200">
                  <Text className="text-xs font-bold text-accent">Category</Text>
                  <Text className="text-xs font-bold text-neutral text-right">{categoryName}</Text>
                </View>

                {/* Payment Date */}
                <View className="flex-row justify-between py-2.5 border-b border-base-200">
                  <Text className="text-xs font-bold text-accent">Payment Date</Text>
                  <Text className="text-xs font-bold text-neutral text-right">{formattedDate}</Text>
                </View>

                {/* Payment Method */}
                <View className="flex-row justify-between py-2.5 border-b border-base-200">
                  <Text className="text-xs font-bold text-accent">Payment Method</Text>
                  <Text className="text-xs font-bold text-neutral text-right">{paymentMethodLabel}</Text>
                </View>

                {/* Share Receipt Link */}
                {expense.shareable_link ? (
                  <View className="flex-row justify-between py-2.5 border-b border-base-200 items-center">
                    <Text className="text-xs font-bold text-accent">Receipt Link</Text>
                    <TouchableOpacity
                      onPress={handleShare}
                      className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20 active:opacity-70"
                    >
                      <MaterialIcons name="share" size={12} color="#DC2D2A" />
                      <Text className="text-xs font-bold text-primary">Share</Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                {/* Notes */}
                <View className="py-2.5">
                  <Text className="text-xs font-bold text-accent mb-1.5">Note Log</Text>
                  <Text className="text-xs text-neutral leading-5 font-semibold bg-base-300/40 p-3 rounded-lg border border-base-200">
                    {expense.note || "No notes logged for this entry."}
                  </Text>
                </View>

                {/* Description */}
                {expense.description ? (
                  <View className="py-2.5">
                    <Text className="text-xs font-bold text-accent mb-1.5">Description</Text>
                    <Text className="text-xs text-neutral leading-5 font-semibold bg-base-300/40 p-3 rounded-lg border border-base-200">
                      {expense.description}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Receipts Attachment Previews */}
              {receiptsList.length > 0 ? (
                <View className="mb-6">
                  <Text className="text-xs font-bold text-accent mb-3">
                    Receipt Attachments ({receiptsList.length})
                  </Text>
                  <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex-row">
                    {receiptsList.map((receipt, idx) => {
                      const uri = getReceiptImageUri(receipt);
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => setPreviewImageUri(uri)}
                          activeOpacity={0.8}
                          className="mr-3 rounded-lg overflow-hidden border border-base-200 bg-base-300"
                        >
                          <Image source={{ uri }} className="w-24 h-24" resizeMode="cover" />
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Full-screen Receipt Image Preview Modal */}
      <Modal
        visible={previewImageUri !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImageUri(null)}
      >
        <View className="flex-1 bg-black/90 justify-center items-center">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setPreviewImageUri(null)}
            className="absolute inset-0"
          />
          {previewImageUri ? (
            <Image source={{ uri: previewImageUri }} className="w-[90%] h-[80%]" resizeMode="contain" />
          ) : null}
          <TouchableOpacity
            onPress={() => setPreviewImageUri(null)}
            className="absolute top-12 right-6 p-2 rounded-full bg-black/50 border border-white/20"
          >
            <MaterialIcons name="close" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
}
