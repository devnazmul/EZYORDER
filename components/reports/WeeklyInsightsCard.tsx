import React from "react";
import { Text, View } from "react-native";
import Button from "@/components/reuseable/Button";

interface WeeklyInsightsCardProps {
  onViewInsight: () => void;
  containerClassName?: string;
}

export default function WeeklyInsightsCard({
  onViewInsight,
  containerClassName = "",
}: WeeklyInsightsCardProps) {
  return (
    <View className={`bg-neutral rounded-lg p-6 relative overflow-hidden shadow-lg ${containerClassName}`}>
      <View className="z-10">
        <Text className="text-md font-bold text-white mb-1">
          Weekly Insights Ready
        </Text>
        <Text className="text-xs text-white/70 leading-5 mb-4">
          Your kitchen efficiency has improved by 12% compared to last week. Check the deep-dive analysis.
        </Text>
        <Button
          label="View Insight"
          onPress={onViewInsight}
          variant="primary"
          containerClassName="w-32 py-2"
        />
      </View>
      {/* Abstract decorative background glow */}
      <View className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/20 rounded-full" />
    </View>
  );
}
