// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import CustomText from "../CustomText";

// 7. Constants/utils
import { COLORS } from "@/constants";
import { WP } from "@/utils";

export interface IBottomSheetCardProps {
  icon?: keyof typeof MaterialIcons.glyphMap;
  title?: string;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
  containerClassName?: string;
}

export default function BottomSheetCard({
  icon,
  title,
  headerRight,
  children,
  containerClassName = "",
}: Readonly<IBottomSheetCardProps>) {
  return (
    <View
      className={`rounded-2xl border border-base-300 bg-base-200 p-4 gap-y-3 ${containerClassName}`.trim()}
    >
      {/* Card Header */}
      {icon || title || headerRight ? (
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            {icon ? (
              <View className="p-2 rounded-xl bg-primary/10">
                <MaterialIcons
                  name={icon}
                  size={WP("5%")}
                  color={COLORS.primary}
                />
              </View>
            ) : null}
            {title ? (
              <CustomText variant="primary" size="sm" weight="bold">
                {title}
              </CustomText>
            ) : null}
          </View>
          {headerRight}
        </View>
      ) : null}

      {/* Main Body Content */}
      {children}
    </View>
  );
}
