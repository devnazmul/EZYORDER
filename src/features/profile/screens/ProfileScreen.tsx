import {
  EmptyState,
  LoadingScreen,
  PageTitle,
  RefreshableScrollView,
} from "@/components/reuseable";

import { useAuth } from "@/src/context/AuthContext";
import { useOwnerProfileQuery } from "@/features/user-management/hooks/queries/useUserQueries";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { user: authUser } = useAuth();
  const userId = authUser?.id;

  const { data, isLoading, refetch } = useOwnerProfileQuery(userId || null);

  const profileUser = useMemo(() => {
    if (!data) return null;
    return data.user || data.data?.user || null;
  }, [data]);

  const initials = useMemo(() => {
    if (!profileUser) return "U";
    const first = profileUser.first_Name
      ? profileUser.first_Name.charAt(0)
      : "";
    const last = profileUser.last_Name ? profileUser.last_Name.charAt(0) : "";
    return (first + last).toUpperCase() || "U";
  }, [profileUser]);

  const fullName = useMemo(() => {
    if (!profileUser) return "User Name";
    const first = profileUser.first_Name || "";
    const last = profileUser.last_Name || "";
    return `${first} ${last}`.trim() || "User Name";
  }, [profileUser]);

  const formattedRole = useMemo(() => {
    if (!profileUser?.type) return "Staff";
    return profileUser.type
      .replace(/[-_]/g, " ")
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, [profileUser]);

  // Formatter for status properties
  const formatStatus = (status?: string) => {
    if (!status) return "N/A";
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderDetailItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    value: string | number | undefined | null,
  ) => {
    if (value === undefined || value === null || String(value).trim() === "")
      return null;
    return (
      <View className="flex-row items-start gap-3 py-3.5 border-b border-base-200/50">
        <View className="bg-primary/10 p-2 rounded-lg mt-0.5">
          <MaterialIcons name={icon} size={18} color="#DC2D2A" />
        </View>
        <View className="flex-1">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-wider">
            {label}
          </Text>
          <Text className="text-sm font-bold text-neutral mt-0.5">{value}</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View
          key="loading"
          className="flex-1 justify-center items-center py-20"
        >
          <LoadingScreen message="Loading profile..." useSafeArea={false} />
        </View>
      );
    }

    if (!profileUser) {
      return (
        <View
          key="empty"
          className="flex-1 justify-center items-center py-10 bg-base-100"
        >
          <EmptyState
            icon="error-outline"
            title="Profile Not Found"
            description="We were unable to retrieve your profile information. Please pull down to refresh."
          />
        </View>
      );
    }

    const hasAddressGroup = !!(
      profileUser.door_no ||
      profileUser.Address ||
      profileUser.post_code
    );

    return (
      <View key="loaded" className="gap-y-6">
        {/* 1. Header Profile Card */}
        <View className="bg-base-300 border border-base-200 rounded-xl p-5 shadow-sm items-center gap-3">
          <View className="w-24 h-24 rounded-full bg-primary/10 items-center justify-center border-4 border-base-200 shadow-sm overflow-hidden">
            {profileUser.image ? (
              <Image
                source={{ uri: profileUser.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-3xl font-black text-primary">
                {initials}
              </Text>
            )}
          </View>
          <View className="items-center">
            <Text className="text-lg font-black text-neutral text-center">
              {fullName}
            </Text>
            <View className="bg-primary/10 px-3 py-0.5 rounded-full mt-1.5 self-center">
              <Text className="text-[10px] font-bold text-primary uppercase tracking-wider">
                {formattedRole}
              </Text>
            </View>
          </View>
        </View>

        {/* 2. Personal Information */}
        <View className="bg-base-300 border border-base-200 rounded-xl px-4 py-1 shadow-sm">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest pt-3.5 pb-1">
            Personal Information
          </Text>
          {renderDetailItem("email", "Email Address", profileUser.email)}
          {renderDetailItem("phone", "Phone Number", profileUser.phone)}
        </View>

        {/* 3. Workplace & Role Status */}
        <View className="bg-base-300 border border-base-200 rounded-xl px-4 py-1 shadow-sm">
          <Text className="text-[10px] font-bold text-accent uppercase tracking-widest pt-3.5 pb-1">
            Role & Workplace Details
          </Text>
          {renderDetailItem("business", "Business ID", profileUser.business_id)}
          {renderDetailItem(
            "restaurant",
            "Waiter Status",
            formatStatus(profileUser.waiter_status),
          )}
          {renderDetailItem(
            "local-shipping",
            "Driver Status",
            formatStatus(profileUser.driver_status),
          )}
          {renderDetailItem(
            "credit-card",
            "Stripe Account ID",
            profileUser.stripe_id || "Not Configured",
          )}
          {renderDetailItem("event", "Trial Expiry", profileUser.trial_ends_at)}
        </View>

        {/* 4. Address Details */}
        {hasAddressGroup && (
          <View className="bg-base-300 border border-base-200 rounded-xl px-4 py-1 shadow-sm">
            <Text className="text-[10px] font-bold text-accent uppercase tracking-widest pt-3.5 pb-1">
              Address Information
            </Text>
            {renderDetailItem("tag", "Door / Unit Number", profileUser.door_no)}
            {renderDetailItem("place", "Street Address", profileUser.Address)}
            {renderDetailItem("map", "Postcode", profileUser.post_code)}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView edges={["left", "right"]} className="flex-1 bg-base-100">
      <RefreshableScrollView
        onRefresh={async () => {
          await refetch();
        }}
        className="flex-1 px-4 py-4"
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PageTitle title="My Profile" icon="person" />

        <View className="mt-2">{renderContent()}</View>
      </RefreshableScrollView>
    </SafeAreaView>
  );
}
