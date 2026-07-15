import { QueryClient } from "@tanstack/react-query";
import { Stack } from "expo-router";
import "../../global.css";

const queryClient = new QueryClient();

const DriverLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};
DriverLayout.displayName = "Driver Layout";
export default DriverLayout;
