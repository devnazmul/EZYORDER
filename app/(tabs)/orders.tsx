import React from "react";
import { SafeAreaView, Text, View } from "react-native";

export default function Orders() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-neutral">Orders History</Text>
      </View>
    </SafeAreaView>
  );
}
