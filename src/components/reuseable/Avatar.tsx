// 1. React / React Native
import React from "react";
import { Image, StyleProp, View, ViewStyle } from "react-native";

// 4. Shared components & utils
import { getInitials, resolveImageUrl } from "@/utils";
import { WP } from "@/utils/getResponsiveSizes";
import CustomText from "./CustomText";

export interface IAvatarProps {
  imageUri?: string | null;
  name?: string | null;
  size?: number;
  containerClassName?: string;
  containerStyle?: StyleProp<ViewStyle>;
  textClassName?: string;
}

export default function Avatar({
  imageUri,
  name,
  size,
  containerClassName = "",
  containerStyle,
  textClassName = "",
}: Readonly<IAvatarProps>) {
  const resolvedUri = resolveImageUrl(imageUri ?? undefined);
  const initials = getInitials(name ?? undefined);

  // Default size using WP if not specified
  const avatarSize = size ?? WP("16%");
  const borderRadius = avatarSize / 2;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name ? `Avatar for ${name}` : "User avatar"}
      style={[
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius,
        },
        containerStyle,
      ]}
      className={`border-2 border-primary/20 bg-base-200 overflow-hidden items-center justify-center ${containerClassName}`}
    >
      {resolvedUri ? (
        <Image
          source={{ uri: resolvedUri }}
          className="w-full h-full"
          resizeMode="cover"
        />
      ) : (
        <CustomText
          variant="currency"
          size={Math.max(14, Math.round(avatarSize * 0.35))}
          weight="extrabold"
          className={textClassName}
        >
          {initials}
        </CustomText>
      )}
    </View>
  );
}
