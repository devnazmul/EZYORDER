import { Stack } from "expo-router";

export default function MoreLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="business-settings" />
      <Stack.Screen name="discounts-and-campaigns" />
      <Stack.Screen name="dishes" />
      <Stack.Screen name="expense-types" />
      <Stack.Screen name="expenses" />
      <Stack.Screen name="menu" />
      <Stack.Screen name="partners" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="tables-and-reservations" />
      <Stack.Screen name="user-management" />
    </Stack>
  );
}
