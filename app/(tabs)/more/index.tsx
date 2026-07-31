import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import COLORS from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreSettingsHub() {
  const { user, logout } = useAuth();

  // Generate full name from user fields
  const fullName = useMemo(() => {
    if (!user) return "Unnamed User";
    const first = user.first_Name || "";
    const last = user.last_Name || "";
    return `${first} ${last}`.trim() || "Unnamed User";
  }, [user]);

  // Generate restaurant name dynamically
  const restaurantName = useMemo(() => {
    return user?.restaurant?.[0]?.Name || "EZYORDER";
  }, [user]);

  // Generate initials from user name or fallback to owner initials
  const initials = useMemo(() => {
    if (!user) return "GP";
    const first = user.first_Name ? user.first_Name[0] : "";
    const last = user.last_Name ? user.last_Name[0] : "";
    return `${first}${last}`.toUpperCase() || "GP";
  }, [user]);

  // Display role label from user roles list or fallback
  const roleLabel = useMemo(() => {
    const roleName = user?.roles?.[0]?.name || user?.type || "Staff";
    return roleName
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [user]);

  // Generate profile subtitle dynamically
  const subtitleText = useMemo(() => {
    if (!fullName) return roleLabel;
    if (fullName.toLowerCase() === restaurantName.toLowerCase()) {
      return roleLabel;
    }
    return `${fullName} • ${roleLabel}`;
  }, [fullName, roleLabel, restaurantName]);

  const handleItemPress = (title: string) => {
    if (title === "Menu Management") {
      router.push("/more/menu");
      return;
    }
    if (title === "Tables & Reservations") {
      router.push("/more/tables-and-reservations");
      return;
    }
    if (title === "User Management") {
      router.push("/more/user-management");
      return;
    }
    if (title === "Discounts & Campaigns") {
      router.push("/more/discounts-and-campaigns");
      return;
    }
    if (title === "Expenses") {
      router.push("/more/expenses");
      return;
    }
    if (title === "Partners") {
      router.push("/more/partners");
      return;
    }
    if (title === "Business Settings") {
      router.push("/more/business-settings");
      return;
    }
    if (title === "Profile") {
      router.push("/more/profile");
      return;
    }
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 1. Header Profile Card */}
        <View
          style={{ padding: WP("3%"), marginBottom: WP("3%") }}
          className="bg-base-300 border border-base-200 rounded-xl shadow-sm flex-row items-center gap-4"
        >
          <View
            style={{ width: WP("13%"), height: WP("13%"), borderWidth: 2 }}
            className="rounded-full bg-primary/10 items-center justify-center border-base-100 shadow-sm overflow-hidden"
          >
            {user?.image ? (
              <Image source={{ uri: user.image }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text style={{ fontSize: getResponsiveFontSize("lg") }} className="font-bold text-primary">
                {initials}
              </Text>
            )}
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: getResponsiveFontSize("md") }} className="font-bold text-neutral">
              {restaurantName}
            </Text>
            <Text
              style={{ fontSize: getResponsiveFontSize("xs") }}
              className="font-semibold text-accent mt-0.5"
            >
              {subtitleText}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.7}
            style={{ width: WP("8%"), height: WP("8%") }}
            className="rounded-lg bg-primary/10 items-center justify-center border border-primary/20"
          >
            <MaterialIcons name="logout" size={WP("5%")} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. Menu Settings Sections */}
        <View className="gap-y-6">
          {/* RESTAURANT SECTION */}
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-bold text-accent capitalize tracking-wider px-1 mb-2"
            >
              Restaurant
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Menu Management")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-primary/10 items-center justify-center"
                  >
                    <MaterialIcons name="restaurant-menu" size={WP("5%")} color={COLORS.primary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Menu Management
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Tables & Reservations")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-primary/10 items-center justify-center"
                  >
                    <MaterialIcons name="table-restaurant" size={WP("5%")} color={COLORS.primary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Tables & Reservations
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ADMINISTRATION SECTION */}
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-bold text-accent capitalize tracking-wider px-1 mb-2"
            >
              Administration
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Discounts & Campaigns")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-secondary/10 items-center justify-center"
                  >
                    <MaterialIcons name="sell" size={WP("5%")} color={COLORS.secondary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Discounts & Campaigns
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("User Management")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-secondary/10 items-center justify-center"
                  >
                    <MaterialIcons name="people" size={WP("5%")} color={COLORS.secondary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    User Management
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Expenses")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-secondary/10 items-center justify-center"
                  >
                    <MaterialIcons name="receipt" size={WP("5%")} color={COLORS.secondary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Expenses
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Partners")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-secondary/10 items-center justify-center"
                  >
                    <MaterialIcons name="handshake" size={WP("5%")} color={COLORS.secondary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Partners
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Business Settings")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-secondary/10 items-center justify-center"
                  >
                    <MaterialIcons name="settings" size={WP("5%")} color={COLORS.secondary} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Business Settings
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          </View>

          {/* ACCOUNT SECTION */}
          <View>
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className="font-bold text-accent capitalize tracking-wider px-1 mb-2"
            >
              Account
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Profile")}
                activeOpacity={0.7}
                style={{ padding: WP("3%") }}
                className="flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    style={{ width: WP("8%"), height: WP("8%") }}
                    className="rounded-lg bg-base-200 items-center justify-center"
                  >
                    <MaterialIcons name="person" size={WP("5%")} color={COLORS.accent} />
                  </View>
                  <Text style={{ fontSize: getResponsiveFontSize("sm") }} className="font-bold text-neutral">
                    Profile
                  </Text>
                </View>
                <MaterialIcons name="chevron-right" size={WP("5%")} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
