import React, { useState } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";

interface IRefreshableScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
}

/**
 * @deprecated
 * DEPRECATED: `RefreshableScrollView` is deprecated. Please use `ScreenContainer` from `@/components/reuseable` instead.
 * `ScreenContainer` provides integrated pull-to-refresh capabilities, safe area handling, and keyboard scrolling.
 *
 * FIXME: Remove this component in future versions after migrating all remaining consumers to `ScreenContainer`.
 */
export default function RefreshableScrollView({
  children,
  onRefresh,
  refreshing,
  className,
  contentContainerStyle = { paddingBottom: 32 },
  showsVerticalScrollIndicator = false,
  ...props
}: Readonly<IRefreshableScrollViewProps>) {
  const [localRefreshing, setLocalRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    try {
      setLocalRefreshing(true);
      await onRefresh();
    } finally {
      setLocalRefreshing(false);
    }
  };

  const isRefreshing = refreshing ?? localRefreshing;

  return (
    <ScrollView
      className={`flex-1 ${className}`}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={["#DC2D2A"]}
            tintColor="#DC2D2A"
          />
        ) : undefined
      }
      {...props}
    >
      {children}
    </ScrollView>
  );
}
