import AppHeader from "@/components/AppHeader";
import RefreshableScrollView from "@/components/reuseable/RefreshableScrollView";
import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MoreSettingsHub() {
  const { user, logout } = useAuth();
  console.log(user);
  // Generate full name from user fields
  const fullName = useMemo(() => {
    if (!user) return "Gourmet Partner";
    const first = user.first_Name || "";
    const last = user.last_Name || "";
    return `${first} ${last}`.trim() || "Gourmet Partner";
  }, [user]);

  // Generate restaurant name dynamically
  const restaurantName = useMemo(() => {
    return user?.restaurant?.[0]?.Name || "Gourmet Express";
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
      router.push("/menu");
      return;
    }
    if (title === "Tables & Reservations") {
      router.push("/tables-and-reservations");
      return;
    }
    if (title === "User Management") {
      router.push("/user-management");
      return;
    }
    if (title === "Discounts & Campaigns") {
      router.push("/discounts-and-campaigns");
      return;
    }
    if (title === "Expenses") {
      router.push("/expenses");
      return;
    }
    Alert.alert(
      "Feature Coming Soon",
      `The "${title}" module is currently under development and will be available in the next app update.`,
      [{ text: "OK" }],
    );
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out of your account?", [
      { text: "Cancel", style: "cancel" },
      { text: "Log Out", style: "destructive", onPress: () => logout() },
    ]);
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <AppHeader />

      <RefreshableScrollView className="flex-1 px-4 py-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* 1. Header Profile Card */}
        <View className="bg-base-300 border border-base-200 rounded-xl p-5 mb-6 shadow-sm flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-primary-container items-center justify-center border-4 border-base-100 shadow-sm overflow-hidden">
            {user?.image ? (
              <Image source={{ uri: user.image }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <Text className="text-xl font-bold text-white">{initials}</Text>
            )}
          </View>
          <View className="flex-1">
            <Text className="text-md font-bold text-neutral">{restaurantName}</Text>
            <Text className="text-xs font-semibold text-accent mt-0.5">{subtitleText}</Text>
          </View>
        </View>

        {/* 2. Menu Settings Sections */}
        <View className="gap-y-6">
          {/* RESTAURANT SECTION */}
          <View>
            <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-2">
              Restaurant
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Menu Management")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                    <MaterialIcons name="restaurant-menu" size={20} color="#DC2D2A" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Menu Management</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Tables & Reservations")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
                    <MaterialIcons name="table-restaurant" size={20} color="#DC2D2A" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Tables & Reservations</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ADMINISTRATION SECTION */}
          <View>
            <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-2">
              Administration
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Discounts & Campaigns")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                    <MaterialIcons name="sell" size={20} color="#00677F" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Discounts & Campaigns</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("User Management")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                    <MaterialIcons name="people" size={20} color="#00677F" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">User Management</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Expenses")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                    <MaterialIcons name="receipt" size={20} color="#00677F" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Expenses</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Partners")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                    <MaterialIcons name="handshake" size={20} color="#00677F" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Partners</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Business Settings")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center">
                    <MaterialIcons name="settings" size={20} color="#00677F" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Business Settings</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>
            </View>
          </View>

          {/* ACCOUNT SECTION */}
          <View>
            <Text className="text-[10px] font-bold text-accent uppercase tracking-widest px-1 mb-2">
              Account
            </Text>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              <TouchableOpacity
                onPress={() => handleItemPress("Profile")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-base-200 items-center justify-center">
                    <MaterialIcons name="person" size={20} color="#6E6E6E" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Profile</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Settings")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4 border-b border-base-200/50"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-base-200 items-center justify-center">
                    <MaterialIcons name="tune" size={20} color="#6E6E6E" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Settings</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleItemPress("Change Password")}
                activeOpacity={0.7}
                className="flex-row items-center justify-between p-4"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-lg bg-base-200 items-center justify-center">
                    <MaterialIcons name="lock" size={20} color="#6E6E6E" />
                  </View>
                  <Text className="text-sm font-bold text-neutral">Change Password</Text>
                </View>
                <MaterialIcons name="chevron-right" size={20} color="#6E6E6E" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Logout & Version Footer */}
        <View className="mt-8 items-center gap-4">
          <TouchableOpacity
            onPress={handleLogout}
            activeOpacity={0.8}
            className="w-full max-w-xs border-2 border-primary py-3 rounded-lg flex-row items-center justify-center gap-2"
          >
            <MaterialIcons name="logout" size={18} color="#DC2D2A" />
            <Text className="text-xs font-black text-primary uppercase">Log Out</Text>
          </TouchableOpacity>

          <Text className="text-[10px] font-bold text-accent/60 tracking-wider">
            Version 2.4.0 (Build 108)
          </Text>
        </View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
