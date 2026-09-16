import { Text, View } from "react-native";

import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabBarLabel } from "@/components/reuseable";
import { COLORS } from "@/constants";
import { useNotificationsQuery } from "@/features/notifications";
import type { ITabItemConfig } from "@/types";
import { getTabBarScreenOptions } from "@/utils";

interface INotificationBadgeProps {
  count: number;
}

function NotificationBadge({ count }: Readonly<INotificationBadgeProps>) {
  if (!count || count <= 0) return null;

  const displayCount = count > 99 ? "99+" : String(count);

  return (
    <View
      style={{
        position: "absolute",
        top: -4,
        right: -7,
        backgroundColor: COLORS.primary,
        minWidth: 17,
        height: 16,
        borderRadius: 9999,
        paddingHorizontal: 1,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: COLORS.base300,
      }}
    >
      <Text
        style={{
          color: COLORS.base300,
          fontSize: 9,
          fontWeight: "bold",
          textAlign: "center",
          includeFontPadding: false,
        }}
      >
        {displayCount}
      </Text>
    </View>
  );
}

const OWNER_TABS_CONFIG: ITabItemConfig[] = [
  { name: "home", title: "Dashboard", icon: "dashboard" },
  { name: "orders", title: "Orders", icon: "receipt" },
  { name: "reports", title: "Reports", icon: "bar-chart" },
  {
    name: "notifications",
    title: "Notifications",
    icon: "notifications",
    hasBadge: true,
  },
  { name: "more", title: "More", icon: "more-horiz" },
];

export default function OwnerTabsLayout() {
  const insets = useSafeAreaInsets();
  const { data: notificationData } = useNotificationsQuery();
  const unreadCount = Number(notificationData?.unreadCount || 0);

  return (
    <Tabs screenOptions={getTabBarScreenOptions(insets)}>
      {OWNER_TABS_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarLabel: ({ color }) => (
              <TabBarLabel title={tab.title} color={color as string} />
            ),
            tabBarIcon: ({ color }) => (
              <View style={{ width: 24, height: 24 }}>
                <MaterialIcons name={tab.icon} size={24} color={color} />
                {tab.hasBadge && <NotificationBadge count={unreadCount} />}
              </View>
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
