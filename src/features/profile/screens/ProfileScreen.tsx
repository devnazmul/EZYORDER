// 1. React / React Native
import React from "react";
import { Image, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { useQueryClient } from "@tanstack/react-query";

// 4. Shared components & context
import {
  ActionCard,
  Badge,
  CustomText,
  EmptyState,
  ScreenContainer,
} from "@/components/reuseable";
import { useAuth } from "@/context/AuthContext";

// 5. Feature components/hooks
import { useOwnerProfileQuery } from "@/features/user-management/hooks/queries/useUserQueries";
import { ProfileScreenSkeleton } from "../components";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { USER_KEYS } from "@/constants/queryKeys";
import { formatLabel, getInitials } from "@/utils";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const userId = user?.id;

  const { data, isLoading, isFetching } = useOwnerProfileQuery(userId || null);

  const profileUser = data?.user || null;

  const first = profileUser?.first_Name || "";
  const last = profileUser?.last_Name || "";
  const fullName = `${first} ${last}`.trim() || "---";
  const initials = first || last ? getInitials(`${first} ${last}`) : "--";
  const formattedRole = formatLabel(profileUser?.type) || "Staff";

  const renderDetailItem = (
    icon: keyof typeof MaterialIcons.glyphMap,
    label: string,
    value: string | number | undefined | null,
    isLast = false,
  ) => {
    if (value === undefined || value === null || String(value).trim() === "")
      return null;
    return (
      <View
        className={`flex-row items-start gap-3 py-3.5 ${!isLast ? "border-b border-base-200/50" : ""}`}
      >
        <View className="bg-primary/10 p-2 rounded-lg mt-0.5">
          <MaterialIcons name={icon} size={18} color={COLORS.primary} />
        </View>
        <View className="flex-1">
          <CustomText size="xs" weight="bold" variant="tertiary">
            {label}
          </CustomText>
          <CustomText size="sm" weight="bold" className="mt-0.5">
            {value}
          </CustomText>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading || isFetching) {
      return <ProfileScreenSkeleton key="skeleton" />;
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
              <CustomText size="3xl" weight="extrabold" variant="currency">
                {initials}
              </CustomText>
            )}
          </View>
          <View className="items-center">
            <CustomText size="lg" weight="bold" className="text-center">
              {fullName}
            </CustomText>
            <View className="mt-1.5">
              <Badge
                text={formattedRole}
                containerClassName="bg-primary/10"
                textClassName="text-primary"
              />
            </View>
          </View>
        </View>

        {/* 2. Personal Information */}
        <ActionCard title="Personal Information" bodyClassName="px-4 py-1">
          {renderDetailItem("email", "Email Address", profileUser.email)}
          {renderDetailItem("phone", "Phone Number", profileUser.phone, true)}
        </ActionCard>

        {/* 3. Workplace & Role Status */}
        {!!profileUser.trial_ends_at && (
          <ActionCard
            title="Role & Workplace Details"
            bodyClassName="px-4 py-1"
          >
            {renderDetailItem(
              "event",
              "Trial Expiry",
              profileUser.trial_ends_at,
              true,
            )}
          </ActionCard>
        )}

        {/* 4. Address Details */}
        {hasAddressGroup && (
          <ActionCard title="Address Information" bodyClassName="px-4 py-1">
            {renderDetailItem("tag", "Door / Unit Number", profileUser.door_no)}
            {renderDetailItem("place", "Street Address", profileUser.Address)}
            {renderDetailItem("map", "Postcode", profileUser.post_code, true)}
          </ActionCard>
        )}
      </View>
    );
  };

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: USER_KEYS.owner(userId || null),
    });
  };

  return (
    <ScreenContainer
      onRefresh={handleRefresh}
      safeAreaEdges={["left", "right"]}
    >
      <View>{renderContent()}</View>
    </ScreenContainer>
  );
}
