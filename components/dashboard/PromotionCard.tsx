import React from "react";
import { Image, Text, View } from "react-native";

interface PromotionCardProps {
  promo: any;
}

export default function PromotionCard({ promo }: PromotionCardProps) {
  console.log(promo);
  return (
    <View className="w-60 bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm mr-4">
      <View className="relative w-full h-32 rounded-lg mb-3 bg-base-200 overflow-hidden">
        <Image source={{ uri: promo.image }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
        <View className="absolute top-2 right-2 bg-green-500 px-2 py-0.5 rounded-full">
          <Text className="text-white text-[8px] font-bold tracking-wide">{promo.status}</Text>
        </View>
      </View>
      <Text className="text-xs font-bold text-neutral mb-1">{promo.name}</Text>
      <Text className="text-[11px] text-accent leading-4" numberOfLines={2}>
        {promo.code} - {promo.usage}
      </Text>
    </View>
  );
}
