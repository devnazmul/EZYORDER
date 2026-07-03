import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Reports() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl font-bold text-neutral">Reports & Analytics</Text>
      </View>
    </SafeAreaView>
  );
}
