import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function KitchenScreen() {
  return (
    <SafeAreaView edges={[]} className="flex-1 bg-base-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-neutral">Kitchen Screen</Text>
      </View>
    </SafeAreaView>
  );
}
