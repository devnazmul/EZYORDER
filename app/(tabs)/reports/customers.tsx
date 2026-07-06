import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AppHeader from "@/components/AppHeader";

export default function CustomersReport() {
  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-base-100">
      <AppHeader />
      
      {/* Header back navigation */}
      <View className="flex-row items-center px-4 py-4 gap-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center rounded-full bg-base-300 shadow-sm border border-base-200"
          activeOpacity={0.8}
        >
          <MaterialIcons name="chevron-left" size={28} color="#000000" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-neutral">Customers</Text>
      </View>

      {/* Main content placeholder */}
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
          <MaterialIcons name="group" size={40} color="#DC2D2A" />
        </View>
        <Text className="text-lg font-bold text-neutral">Customer Analytics</Text>
        <Text className="text-xs text-accent text-center mt-2 px-4 leading-5">
          Detailed customer profiles, segmentations, and user behaviors will be displayed here in future releases.
        </Text>
      </View>
    </SafeAreaView>
  );
}
