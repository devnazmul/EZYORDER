import React, { useState } from "react";
import { RefreshControl, ScrollView, ScrollViewProps } from "react-native";

interface RefreshableScrollViewProps extends ScrollViewProps {
  onRefresh?: () => Promise<void> | void;
  refreshing?: boolean;
}

export default function RefreshableScrollView({
  children,
  onRefresh,
  refreshing,
  className,
  contentContainerStyle = { paddingBottom: 32 },
  showsVerticalScrollIndicator = false,
  ...props
}: RefreshableScrollViewProps) {
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

  const isRefreshing = refreshing !== undefined ? refreshing : localRefreshing;

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
