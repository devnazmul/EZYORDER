// 1. React / React Native
import React from "react";
import {
  StyleProp,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// 7. Constants / utils
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

// ==================== TYPES ====================

export interface IActionCardProps {
  title?: string | React.ReactNode;
  headerRight?: React.ReactNode;
  children?: React.ReactNode;
  actionLabel?: string;
  onActionPress?: () => void;
  actionElement?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  skeleton?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  bodyStyle?: StyleProp<ViewStyle>;
  actionClassName?: string;
  actionTextClassName?: string;
}

export default function ActionCard({
  title,
  headerRight,
  children,
  actionLabel,
  onActionPress,
  actionElement,
  isLoading = false,
  loadingText = "Loading...",
  skeleton,
  containerClassName = "",
  headerClassName = "",
  titleClassName = "",
  bodyClassName = "",
  bodyStyle,
  actionClassName = "",
  actionTextClassName = "",
}: Readonly<IActionCardProps>) {
  if (isLoading) {
    if (skeleton) return <>{skeleton}</>;
    return (
      <View
        style={{ padding: WP("4%") }}
        className={`bg-base-300 rounded-xl border border-base-200 shadow-sm justify-center items-center min-h-[120px] ${containerClassName}`}
      >
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="text-accent capitalize"
        >
          {loadingText}
        </Text>
      </View>
    );
  }

  let renderedFooter: React.ReactNode = null;
  if (actionElement) {
    renderedFooter = actionElement;
  } else if (actionLabel && onActionPress) {
    renderedFooter = (
      <TouchableOpacity
        onPress={onActionPress}
        activeOpacity={0.75}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
        className={`w-full items-center justify-center border-t border-base-200 bg-primary py-4 ${actionClassName}`}
      >
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className={`font-semibold capitalize text-white ${actionTextClassName}`}
        >
          {actionLabel}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View
      className={`bg-base-300 rounded-xl overflow-hidden border border-base-200 shadow-sm ${containerClassName}`}
    >
      {/* Title Header */}
      {title || headerRight ? (
        <View
          style={{ paddingHorizontal: WP("4%") }}
          className={`border-b border-base-200 flex-row justify-between items-center py-4 ${headerClassName}`}
        >
          {typeof title === "string" ? (
            <Text
              style={{ fontSize: getResponsiveFontSize("sm") }}
              className={`font-semibold text-neutral capitalize ${titleClassName}`}
            >
              {title}
            </Text>
          ) : (
            title
          )}
          {headerRight}
        </View>
      ) : null}

      {/* Main Content Body */}
      {bodyClassName || bodyStyle ? (
        <View style={bodyStyle} className={bodyClassName}>
          {children}
        </View>
      ) : (
        children
      )}

      {/* Bottom Action Area */}
      {renderedFooter}
    </View>
  );
}
