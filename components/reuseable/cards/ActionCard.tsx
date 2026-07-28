import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
        className={`bg-base-300 p-4 rounded-xl border border-base-200 shadow-sm min-h-[120px] justify-center items-center ${containerClassName}`}
      >
        <Text className="text-xs text-accent capitalize">{loadingText}</Text>
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
          className={`p-4 pb-3 border-b border-base-200 flex-row justify-between items-center ${headerClassName}`}
        >
          {typeof title === "string" ? (
            <Text className={`text-sm font-semibold text-neutral capitalize ${titleClassName}`}>{title}</Text>
          ) : (
            title
          )}
          {headerRight}
        </View>
      ) : null}

      {/* Main Content Body */}
      {bodyClassName ? <View className={bodyClassName}>{children}</View> : children}

      {/* Bottom Action Area */}
      {actionElement ? (
        actionElement
      ) : actionLabel && onActionPress ? (
        <TouchableOpacity
          onPress={onActionPress}
          activeOpacity={0.7}
          className={`w-full py-4 items-center justify-center border-t border-base-200 bg-primary ${actionClassName}`}
        >
          <Text className={`text-xs font-semibold text-primary capitalize text-white ${actionTextClassName}`}>
            {actionLabel}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}
