// 1. React / React Native
import React from "react";
import { FlatList, RefreshControl } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 4. Shared components
import { EmptyState, ErrorState } from "@/components/reuseable";

// 5. Feature components
import PartnerCardSkeleton from "./skeletons/PartnerCardSkeleton";

// 7. Constants/utils
import { COLORS } from "@/constants";

export interface IPartnerListLayoutProps<T extends { id: number | string }> {
  data?: T[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  error: unknown;
  onRefresh: () => Promise<void>;
  onRetry: () => void;
  emptyTitle: string;
  emptyDescription: string;
  emptyIcon: keyof typeof MaterialIcons.glyphMap;
  errorTitle: string;
  errorMessage: string;
  renderItem: (item: T) => React.ReactElement;
}

export default function PartnerListLayout<T extends { id: number | string }>({
  data,
  isLoading,
  isRefreshing,
  isError,
  error,
  onRefresh,
  onRetry,
  emptyTitle,
  emptyDescription,
  emptyIcon,
  errorTitle,
  errorMessage,
  renderItem,
}: Readonly<IPartnerListLayoutProps<T>>) {
  if (isLoading || isRefreshing) {
    return <PartnerCardSkeleton count={5} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={errorTitle}
        message={error instanceof Error ? error.message : errorMessage}
        onRetry={onRetry}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        key="empty"
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      className="flex-1"
      contentContainerStyle={{ gap: 16, paddingBottom: 80 }}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={onRefresh}
          colors={[COLORS.primary]}
          tintColor={COLORS.primary}
        />
      }
      renderItem={({ item }) => renderItem(item)}
    />
  );
}
