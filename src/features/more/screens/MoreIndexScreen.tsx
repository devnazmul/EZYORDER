import { CustomText, ScreenContainer } from "@/components/reuseable";
import COLORS from "@/constants/colors";
import { useAuth } from "@/src/context/AuthContext";
import { formatLabel, getInitials } from "@/utils";
import { WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { SETTING_SECTIONS } from "../constants/more.config";

export default function MoreSettingsHub() {
  const { user, logout } = useAuth();

  const first = user?.first_Name || "";
  const last = user?.last_Name || "";
  const fullName = `${first} ${last}`.trim() || "Unnamed User";
  const restaurantName = user?.restaurant?.[0]?.Name || "EZYORDER";

  const initials = first || last ? getInitials(`${first} ${last}`) : "--";

  const roleName = user?.roles?.[0]?.name || user?.type || "Staff";
  const roleLabel = formatLabel(roleName) || "Staff";

  const subtitleText =
    !fullName || fullName.toLowerCase() === restaurantName.toLowerCase()
      ? roleLabel
      : `${fullName} • ${roleLabel}`;

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", style: "destructive", onPress: () => logout() },
      ],
    );
  };

  return (
    <ScreenContainer safeAreaEdges={["left", "right"]}>
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
            <Image
              source={{ uri: user.image }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <CustomText size="lg" weight="bold" variant="currency">
              {initials}
            </CustomText>
          )}
        </View>
        <View className="flex-1">
          <CustomText size="md" weight="bold" variant="primary">
            {restaurantName}
          </CustomText>
          <CustomText
            size="xs"
            weight="semibold"
            variant="secondary"
            className="mt-0.5"
          >
            {subtitleText}
          </CustomText>
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
        {SETTING_SECTIONS.map((section) => (
          <View key={section.title}>
            <CustomText
              size="sm"
              weight="semibold"
              variant="tertiary"
              className="tracking-wider px-1 mb-2"
            >
              {section.title}
            </CustomText>
            <View className="bg-base-300 border border-base-200 rounded-xl overflow-hidden shadow-sm">
              {section.items.map((item, idx) => {
                const isLast = idx === section.items.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() => router.push(item.route)}
                    activeOpacity={0.7}
                    style={{ padding: WP("3%") }}
                    className={`flex-row items-center justify-between ${
                      !isLast ? "border-b border-base-200/50" : ""
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        style={{ width: WP("8%"), height: WP("8%") }}
                        className={`rounded-lg items-center justify-center ${item.bgClassName}`}
                      >
                        <MaterialIcons
                          name={item.icon}
                          size={WP("5%")}
                          color={item.color}
                        />
                      </View>
                      <CustomText size="sm" weight="bold" variant="primary">
                        {item.title}
                      </CustomText>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={WP("5%")}
                      color={COLORS.accent}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
