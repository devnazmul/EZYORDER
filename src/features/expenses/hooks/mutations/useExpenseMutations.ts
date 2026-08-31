// 3. External libraries
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 5. Feature apis
import {
  createExpense,
  updateExpense,
  uploadReceiptFile,
} from "../../apis/expenses";

// 6. Types
import type {
  ICreateExpensePayload,
  IUpdateExpensePayload,
} from "../../types/expenses.types";

// 7. Constants/utils
import { EXPENSE_KEYS } from "@/constants/queryKeys";

export const useCreateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateExpensePayload) => createExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
    },
  });
};

export const useUpdateExpenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateExpensePayload) => updateExpense(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
    },
  });
};

export const useUploadReceiptMutation = () => {
  return useMutation({
    mutationFn: async ({
      fileUri,
      fileName,
      mimeType,
    }: {
      fileUri: string;
      fileName?: string;
      mimeType?: string;
    }) => {
      const url = await uploadReceiptFile(fileUri, fileName, mimeType);
      if (!url) {
        throw new Error("Failed to upload receipt image");
      }
      return url;
    },
  });
};
