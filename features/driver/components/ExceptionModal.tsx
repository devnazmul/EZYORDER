import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";

interface ExceptionModalProps {
  visible: boolean;
  title: string;
  onClose: () => void;
  onSubmit: (reason: string, description?: string) => void;
  isLoading?: boolean;
}

export default function ExceptionModal({
  visible,
  title,
  onClose,
  onSubmit,
  isLoading = false,
}: ExceptionModalProps) {
  const [selectedReason, setSelectedReason] = useState("");
  const [description, setDescription] = useState("");

  const reasons = ["Customer Unavailable", "Wrong Address", "Order Damaged", "Other"];

  const handleSub = () => {
    if (!selectedReason) return;
    onSubmit(selectedReason, description);
    // Reset state after submit
    setSelectedReason("");
    setDescription("");
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-5">
        <View className="bg-base-300 w-full max-w-[340px] rounded-3xl p-6 border border-base-200 shadow-xl">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-md font-black text-neutral uppercase tracking-wider">
              {title}
            </Text>
            <TouchableOpacity onPress={onClose} disabled={isLoading}>
              <Feather name="x" size={20} color="#6E6E6E" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="max-h-[300px]">
            {/* Reason Selection */}
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Select a Reason
            </Text>
            <View className="flex-col gap-2 mb-4">
              {reasons.map((reason) => {
                const isSelected = selectedReason === reason;
                return (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => setSelectedReason(reason)}
                    disabled={isLoading}
                    className={`p-3 rounded-xl border flex-row items-center justify-between ${
                      isSelected
                        ? "bg-rose-50 border-primary"
                        : "bg-base-100 border-base-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isSelected ? "text-primary" : "text-slate-700"
                      }`}
                    >
                      {reason}
                    </Text>
                    {isSelected && <Feather name="check" size={14} color="#DC2D2A" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Description Details */}
            <Text className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              Additional Details (Optional)
            </Text>
            <TextInput
              multiline
              numberOfLines={3}
              value={description}
              onChangeText={setDescription}
              placeholder="Provide context or explanation..."
              placeholderTextColor="#9ca3af"
              disabled={isLoading}
              className="bg-base-100 border border-base-200 rounded-xl p-3 text-xs text-slate-700 h-20 mb-4"
              textAlignVertical="top"
            />
          </ScrollView>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-base-100 border border-base-200 rounded-xl items-center"
            >
              <Text className="text-xs font-bold text-slate-600">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSub}
              disabled={!selectedReason || isLoading}
              className={`flex-1 py-3 rounded-xl items-center ${
                !selectedReason || isLoading ? "bg-primary/50" : "bg-primary"
              }`}
            >
              <Text className="text-xs font-bold text-white">
                {isLoading ? "Submitting..." : "Submit"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
