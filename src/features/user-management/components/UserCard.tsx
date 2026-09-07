// 1. React / React Native
import { View } from "react-native";

// 4. Shared components
import { Avatar, Badge, CustomText } from "@/components/reuseable";

// 5. Feature components / hooks / utils
import { getUserRoleConfig } from "../utils";

// 6. Types
import type { IUser } from "../types";

// 7. Constants/utils
import { WP } from "@/utils";

export interface IUserCardProps {
  user: IUser;
}

export default function UserCard({ user }: Readonly<IUserCardProps>) {
  const fullName = `${user.first_Name || ""} ${user.last_Name || ""}`.trim();

  const roleConfig = getUserRoleConfig(user.role?.name);

  return (
    <View className="bg-base-300 border border-base-200 rounded-2xl p-4 shadow-sm flex-row items-center justify-between">
      <View className="flex-row items-center gap-3 flex-1">
        <Avatar imageUri={user.image} name={fullName} size={WP(12)} />

        {/* User Info */}
        <View className="flex-1">
          <View className="flex-row items-center gap-2">
            <CustomText
              size="sm"
              weight="bold"
              variant="primary"
              numberOfLines={2}
              className="shrink"
            >
              {fullName}
            </CustomText>
            <Badge
              text={roleConfig.label}
              containerStyle={{ backgroundColor: `${roleConfig.color}1A` }}
              textStyle={{ color: roleConfig.color }}
              textClassName="uppercase"
            />
          </View>

          {/* Email Row */}
          <CustomText
            type="email"
            size="xs"
            numberOfLines={1}
            className="mt-1.5 flex-1"
          >
            {user.email}
          </CustomText>

          {/* Phone Row */}
          {user.phone ? (
            <CustomText
              type="phone"
              size="xs"
              numberOfLines={1}
              className="mt-1 flex-1"
            >
              {user.phone}
            </CustomText>
          ) : null}
        </View>
      </View>
    </View>
  );
}
