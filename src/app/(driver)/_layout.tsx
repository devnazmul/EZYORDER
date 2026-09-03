import { useAuth } from "@/src/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DriverLayout: React.FC = () => {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();

  if (!token) {
    return <Redirect href="/(auth)/login" />;
  }

  const role = (user?.type || "").toLowerCase().trim();
  if (role !== "driver") {
    return <Redirect href="/(owner)/home" />;
  }



  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#DC2D2A",
        tabBarInactiveTintColor: "#6E6E6E",
        tabBarStyle: {
          height: 60 + (insets.bottom > 0 ? insets.bottom + 8 : 12),
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#e2e2e2",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          elevation: 8,
          shadowColor: "#000000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          paddingBottom: insets.bottom > 0 ? insets.bottom + 4 : 12,
          paddingTop: 12,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarLabel: ({ color }) => <TabBarLabel title="Dashboard" color={color} />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-orders"
        options={{
          title: "My Orders",
          tabBarLabel: ({ color }) => <TabBarLabel title="My Orders" color={color} />,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="receipt" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

DriverLayout.displayName = "Driver Layout";
export default DriverLayout;

interface ITabBarLabelProps {
  title: string;
  color: string;
}

function TabBarLabel({ title, color }: Readonly<ITabBarLabelProps>) {
  return (
    <Text
      style={{
        color,
        fontSize: 10.5,
        fontWeight: "600",
        marginTop: 2,
        textAlign: "center",
      }}
      numberOfLines={1}
      adjustsFontSizeToFit
    >
      {title}
    </Text>
  );
}
