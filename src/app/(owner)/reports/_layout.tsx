import { Stack } from "expo-router";

export default function ReportsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="orders" />
      <Stack.Screen name="sales" />
      <Stack.Screen name="customers" />
    </Stack>
  );
}
