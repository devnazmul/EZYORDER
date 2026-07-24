import { Stack } from "expo-router";

export default function OrdersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerTintColor: "#DC2D2A",
        headerTitleStyle: {
          fontWeight: "bold",
          color: "#000000",
        },
        headerStyle: {
          backgroundColor: "#FFFFFF",
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="todays-orders"
        options={{
          headerShown: false,
          title: "Today's Orders",
        }}
      />
      <Stack.Screen
        name="all-orders"
        options={{
          headerShown: false,
          title: "All Orders",
        }}
      />

      <Stack.Screen
        name="kitchen-screen"
        options={{
          headerShown: false,
          title: "Kitchen Screen",
        }}
      />
    </Stack>
  );
}
