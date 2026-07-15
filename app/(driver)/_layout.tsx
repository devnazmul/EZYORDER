import { Stack } from "expo-router";

const DriverLayout: React.FC = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
    </Stack>
  );
};
DriverLayout.displayName = "Driver Layout";
export default DriverLayout;
