import Badge from "@/components/reuseable/Badge";
import Button from "@/components/reuseable/Button";
import { formatAmount } from "@/utils/formatters";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export interface PaymentCollectionSectionProps {
  paymentMethod: "Cash" | "Prepaid";
  totalAmount: number;
  collectedAmount: string;
  setCollectedAmount: (val: string) => void;
  currencySymbol: string;
  isPending?: boolean;
  onConfirmPayment: () => void;
  containerClassName?: string;
}

export default function PaymentCollectionSection({
  paymentMethod,
  totalAmount,
  collectedAmount,
  setCollectedAmount,
  currencySymbol,
  isPending = false,
  onConfirmPayment,
  containerClassName = "",
}: PaymentCollectionSectionProps) {
  // Calculations for Cash Payment
  const numCollected = parseFloat(collectedAmount) || 0;
  const numTotal = totalAmount || 0;
  const isExactAmount = Math.abs(numCollected - numTotal) < 0.01 && numCollected > 0;
  const isUnderAmount = numCollected > 0 && numCollected < numTotal;

  return (
    <View className={`gap-y-2.5 mt-4 ${containerClassName}`}>
      <View className="flex-row justify-between items-center">
        <Text className="text-xs font-bold text-neutral capitalize tracking-wider">Payment Handling</Text>
      </View>

      {paymentMethod === "Cash" ? (
        <View className="bg-slate-50 rounded-2xl p-4 border border-base-200 shadow-sm gap-y-3.5">
          {/* Target Collection Hero Box */}
          <View className="bg-slate-100/80 border border-base-200 rounded-xl p-3.5 flex-row items-center justify-between">
            <View className="flex-row items-start gap-3 flex-1 mr-2">
              <View className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 items-center justify-center shrink-0">
                <MaterialIcons name="payments" size={20} color="#DC2D2A" />
              </View>
              <View className="flex-1">
                <Text className="text-xs font-bold text-neutral capitalize tracking-wider">
                  Cash to Collect
                </Text>
                <Text className="text-[11px] text-accent font-medium mt-0.5" numberOfLines={2}>
                  Collect exact amount from customer
                </Text>
              </View>
            </View>
            <View className="items-end gap-1.5 shrink-0">
              <Badge
                text="COD"
                icon={<MaterialIcons name="payments" size={10} color="#b45309" />}
                containerClassName="bg-amber-500/10 border border-amber-500/20"
                textClassName="text-amber-800 font-extrabold text-[9px]"
              />
              <Text className="text-base font-bold text-neutral]">
                {formatAmount(totalAmount, currencySymbol)}
              </Text>
            </View>
          </View>

          {/* Exact Amount Button (Shade of bg-primary) */}
          <TouchableOpacity
            onPress={() => setCollectedAmount(totalAmount.toFixed(2))}
            activeOpacity={0.7}
            className={`px-3.5 py-2 rounded-lg flex-row items-center gap-1.5 border self-start ${
              isExactAmount ? "bg-primary border-primary" : "bg-primary/10 border-primary/30"
            }`}
          >
            <MaterialIcons name="check-circle" size={14} color={isExactAmount ? "#ffffff" : "#DC2D2A"} />
            <Text className={`text-xs font-bold ${isExactAmount ? "text-white" : "text-primary"}`}>
              Exact - {formatAmount(totalAmount, currencySymbol)}
            </Text>
          </TouchableOpacity>

          {/* Custom Cash Input Field */}
          <View>
            <Text className="text-[10px] font-bold text-neutral/70 capitalize tracking-wider mb-1.5">
              Enter Collected Cash
            </Text>
            <View className="bg-white border border-base-300 rounded-lg px-3.5 py-2.5 flex-row items-center shadow-inner">
              <Text className="font-semibold text-accent mr-2 text-sm">{currencySymbol}</Text>
              <BottomSheetTextInput
                value={collectedAmount}
                onChangeText={setCollectedAmount}
                placeholder="0.00"
                keyboardType="numeric"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-neutral font-bold text-base p-0 m-0"
                editable={!isPending}
              />
              {collectedAmount ? (
                <TouchableOpacity onPress={() => setCollectedAmount("")} activeOpacity={0.7} className="p-1">
                  <MaterialIcons name="cancel" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {/* Live Remaining Balance / Exact Status */}
          {isUnderAmount ? (
            <View className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="warning-amber" size={18} color="#d97706" />
                <Text className="text-xs font-semibold text-amber-900">Remaining due:</Text>
              </View>
              <Text className="text-sm font-black text-amber-700">
                {formatAmount(totalAmount - numCollected, currencySymbol)}
              </Text>
            </View>
          ) : isExactAmount ? (
            <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex-row items-center gap-2">
              <MaterialIcons name="check-circle" size={18} color="#2563eb" />
              <Text className="text-xs font-bold text-blue-900">Exact amount collected.</Text>
            </View>
          ) : null}

          {/* Confirm Payment Button */}
          <Button
            label={isPending ? "Confirming Payment..." : "Confirm Payment"}
            onPress={onConfirmPayment}
            disabled={isPending || numCollected <= 0}
            variant="primary"
            containerClassName="mt-1 !shadow-none"
          />
        </View>
      ) : (
        <View className="bg-emerald-50/90 border border-emerald-200 rounded-2xl p-4 flex items-center justify-center">
          <View className="flex-row items-start gap-3">
            <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center">
              <MaterialIcons name="verified-user" size={20} color="#059669" />
            </View>
            <View className="flex-1">
              <Text className="font-bold text-emerald-900 text-xs capitalize tracking-wider">
                Payment Fully Settled
              </Text>
              <Text className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Order is prepaid. No cash collection required.
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
