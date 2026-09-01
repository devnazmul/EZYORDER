// 1. React / React Native
import { useState } from "react";

// 5. Feature components/hooks/services
import {
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useUploadReceiptMutation,
} from "./mutations/useExpenseMutations";
import { ExpenseService } from "../services";

// 6. Types
import type { IExpenseFormData } from "../schema";

interface IUseSubmitExpenseOptions {
  readonly onSuccess?: () => void;
}

export function useSubmitExpense(options?: IUseSubmitExpenseOptions) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadReceiptMutation = useUploadReceiptMutation();
  const createMutation = useCreateExpenseMutation();
  const updateMutation = useUpdateExpenseMutation();

  const submitExpense = async (formData: IExpenseFormData) => {
    try {
      setIsUploading(true);
      const rawReceipts = formData.reciepts || [];
      const processedReceipts: string[] = [];

      // Step 1: Upload raw local receipt files
      for (const receipt of rawReceipts) {
        if (
          typeof receipt === "string" &&
          (receipt.startsWith("file://") ||
            receipt.startsWith("content://") ||
            receipt.startsWith("ph://") ||
            receipt.startsWith("blob:"))
        ) {
          const uploadedPath = await uploadReceiptMutation.mutateAsync({
            fileUri: receipt,
          });
          if (uploadedPath) {
            processedReceipts.push(uploadedPath);
          } else {
            throw new Error("Failed to upload receipt file");
          }
        } else if (typeof receipt === "string" && receipt.trim().length > 0) {
          processedReceipts.push(receipt);
        }
      }

      // Step 2: Create or Update Expense Payload & Mutation
      if (formData.id) {
        const payload = ExpenseService.toUpdatePayload(
          formData,
          processedReceipts,
        );
        await updateMutation.mutateAsync(payload);
      } else {
        const payload = ExpenseService.toCreatePayload(
          formData,
          processedReceipts,
        );
        await createMutation.mutateAsync(payload);
      }

      options?.onSuccess?.();
    } catch (err) {
      console.error("Failed to submit expense:", err);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting =
    createMutation.isPending || updateMutation.isPending || isUploading;

  return {
    submitExpense,
    isSubmitting,
    isUploading,
  };
}
