// 1. React / React Native
import { useMemo, useState } from "react";
import { Alert } from "react-native";

// 3. External libraries / Shared hooks / Shared context
import { useAuth } from "@/context/AuthContext";
import { useQueryClient } from "@tanstack/react-query";

// 5. Feature components/hooks/services
import { useDeleteExpenseTypeMutation } from "./mutations/useExpenseMutations";
import { useExpenseTypesInfiniteQuery } from "./queries/useExpenseQueries";

// 6. Types
import type { IExpenseType } from "../types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";

export function useExpenseTypes() {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id || user?.business_id;
  const queryClient = useQueryClient();

  const [selectedExpenseType, setSelectedExpenseType] =
    useState<IExpenseType | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExpenseType, setEditingExpenseType] =
    useState<IExpenseType | null>(null);

  const deleteMutation = useDeleteExpenseTypeMutation();

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    isError,
  } = useExpenseTypesInfiniteQuery(restaurantId || "", 10);

  const expenseTypesList = useMemo(
    () =>
      data?.pages.flatMap((page) => {
        if (Array.isArray(page?.data)) return page.data;
        return [];
      }) ?? [],
    [data],
  );

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({
      queryKey: EXPENSE_KEYS.types(),
    });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleCreate = () => {
    setEditingExpenseType(null);
    setIsFormOpen(true);
  };

  const handleEdit = (type: IExpenseType) => {
    setEditingExpenseType(type);
    setIsFormOpen(true);
  };

  const handleDelete = (type: IExpenseType) => {
    Alert.alert(
      "Delete Expense Type",
      `Are you sure you want to delete "${type.name}"? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMutation.mutateAsync(type.id);
          },
        },
      ],
    );
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingExpenseType(null);
  };

  const isRefreshing = isFetching && !isFetchingNextPage && !isLoading;

  return {
    expenseTypesList,
    selectedExpenseType,
    setSelectedExpenseType,
    isFormOpen,
    editingExpenseType,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isError,
    isRefreshing,
    handleRefresh,
    handleLoadMore,
    handleCreate,
    handleEdit,
    handleDelete,
    closeForm,
  };
}
