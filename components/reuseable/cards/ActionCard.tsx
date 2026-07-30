import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";
import React from "react";
import { StyleProp, Text, TouchableOpacity, View, ViewStyle } from "react-native";

export interface ActionCardProps {
  /**
   * Title text or custom title component shown in the card header.
   */
  title?: string | React.ReactNode;
  /**
   * Optional node rendered on the right side of the card header.
   */
  headerRight?: React.ReactNode;
  /**
   * Main content area of the card.
   */
  children?: React.ReactNode;
  /**
   * Label for the bottom action button.
   */
  actionLabel?: string;
  /**
   * Handler for bottom action button press.
   */
  onActionPress?: () => void;
  /**
   * Custom action element rendered in place of the default bottom action button.
   */
  actionElement?: React.ReactNode;
  /**
   * Indicates whether the card is in a loading state.
   */
  isLoading?: boolean;
  /**
   * Text displayed when card is in loading state. Defaults to "Loading...".
   */
  loadingText?: string;
  /**
   * Optional custom skeleton loader node rendered when isLoading is true.
   */
  skeleton?: React.ReactNode;
  /**
   * Outer container Tailwind className overrides.
   */
  containerClassName?: string;
  /**
   * Header wrapper Tailwind className overrides.
   */
  headerClassName?: string;
  /**
   * Title text Tailwind className overrides.
   */
  titleClassName?: string;
  /**
   * Body content wrapper Tailwind className overrides.
   */
  bodyClassName?: string;
  /**
   * Body content wrapper inline style overrides.
   */
  bodyStyle?: StyleProp<ViewStyle>;
  /**
   * Action button wrapper Tailwind className overrides.
   */
  actionClassName?: string;
  /**
   * Action button text Tailwind className overrides.
   */
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
}: ActionCardProps) {
  if (isLoading) {
    if (skeleton) {
      return <>{skeleton}</>;
    }
    return (
      <View
        key="loading"
        style={{ padding: WP("4%") }}
        className={`bg-base-300 rounded-xl border border-base-200 shadow-sm justify-center items-center min-h-[120px] ${containerClassName}`}
      >
        <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-accent capitalize">
          {loadingText}
        </Text>
      </View>
    );
  }

  return (
    <View
      key="loaded"
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
      {actionElement ? (
        actionElement
      ) : actionLabel && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.75}
          className={`w-full items-center justify-center border-t border-base-200 bg-primary py-4 ${actionClassName}`}
        >
          <Text
            style={{ fontSize: getResponsiveFontSize("xs") }}
            className={`font-semibold capitalize text-white ${actionTextClassName}`}
          >
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
