// 3. External libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 5. Feature apis
import {
  createExpense,
  createExpenseType,
  deleteExpenseType,
  updateExpense,
  updateExpenseType,
  uploadReceiptFile,
} from "../../apis/expenses";

// 6. Types
import type {
  ICreateExpensePayload,
  ICreateExpenseTypePayload,
  IUpdateExpensePayload,
  IUpdateExpenseTypePayload,
} from "../../types/expenses.types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.matrices() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.trends() });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.paymentMethodBreakdowns(),
      });
    },
  });
};

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateExpensePayload) => updateExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.matrices() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.trends() });
      queryClient.invalidateQueries({
        queryKey: EXPENSE_KEYS.paymentMethodBreakdowns(),
      });
    },
  });
};

export const useUploadReceiptMutation = () => {
  return useMutation({
    mutationFn: ({
      fileUri,
      fileName,
      mimeType,
    }: {
      fileUri: string;
      fileName?: string;
      mimeType?: string;
    }) => uploadReceiptFile(fileUri, fileName, mimeType),
  });
};

export const useCreateExpenseTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateExpenseTypePayload) =>
      createExpenseType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.types() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() });
    },
  });
};

export const useUpdateExpenseTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateExpenseTypePayload) =>
      updateExpenseType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.types() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() });
    },
  });
};

export const useDeleteExpenseTypeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteExpenseType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.types() });
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.lists() });
    },
  });
};
