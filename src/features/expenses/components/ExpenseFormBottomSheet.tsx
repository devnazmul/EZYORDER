// 1. React / React Native
import React, { useMemo } from "react";
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import dayjs from "dayjs";

// 4. Shared components
import { CustomForm } from "@/components/form/CustomForm";
import {
  DateField,
  DropdownField,
  FileUploadField,
  InputField,
} from "@/components/form/input";
import BottomSheet from "@/components/reuseable/BottomSheet";
import CustomText from "@/components/reuseable/CustomText";

// 5. Feature components/hooks/services
import { useAuth } from "@/hooks";
import { useExpenseTypesQuery, useSubmitExpense } from "../hooks";
import { expenseFormSchema } from "../schema";

// 6. Types
import type { IDropdownOption } from "@/components/form/input";
import type { IExpenseFormData } from "../schema";
import type { IExpense } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { formatDate, getPaymentMethodsConfig } from "@/utils";
import { HP, WP } from "@/utils/getResponsiveSizes";

interface IExpenseFormBottomSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly initialExpense?: IExpense | null;
}

// Static payment method options (defined outside to avoid re-creation or memoization on render)
const PAYMENT_METHOD_OPTIONS: IDropdownOption[] = [
  "cash",
  "card",
  "bank_transfer",
  "online",
].map((method) => {
  const config = getPaymentMethodsConfig(method);
  return {
    label: config.label || method,
    value: method,
  };
});

export default function ExpenseFormBottomSheet({
  visible,
  onClose,
  initialExpense,
}: Readonly<IExpenseFormBottomSheetProps>) {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id || "";

  // Submission Hook
  const { submitExpense, isSubmitting, isUploading } = useSubmitExpense({
    onSuccess: onClose,
  });

  // Queries
  const { data: expenseTypesData } = useExpenseTypesQuery(restaurantId, 1000);

  // Map Expense Types to DropdownOptions
  const expenseTypeOptions: IDropdownOption[] = useMemo(() => {
    if (!expenseTypesData?.data) return [];
    return expenseTypesData.data.map((type) => ({
      label: type.name,
      value: String(type.id),
    }));
  }, [expenseTypesData]);

  // Compute Initial Form Values
  const defaultValues = useMemo<Partial<IExpenseFormData>>(() => {
    if (initialExpense) {
      const typeValue =
        typeof initialExpense.expense_type === "object" &&
        initialExpense.expense_type
          ? String(initialExpense.expense_type.id)
          : String(initialExpense.expense_type || "");

      const formattedPaymentDate =
        formatDate(initialExpense.payment_date, "YYYY-MM-DD") ||
        dayjs().format("YYYY-MM-DD");

      return {
        id: initialExpense.id,
        amount:
          initialExpense.amount !== undefined && initialExpense.amount !== null
            ? (String(initialExpense.amount) as unknown as number)
            : ("" as unknown as number),
        expense_type: typeValue,
        payment_method: initialExpense.payment_method || "cash",
        payment_date: formattedPaymentDate,
        paid_by: initialExpense.paid_by || user?.name || "",
        note: initialExpense.note || "",
        description: initialExpense.description || "",
        restaurant_id: Number(restaurantId) || 0,
        is_active: initialExpense.is_active !== 0,
        reciepts:
          initialExpense.reciepts?.map((r) => r.url || r.path || "") || [],
      };
    }

    return {
      amount: "" as unknown as number,
      expense_type: "",
      payment_method: "cash",
      payment_date: dayjs().format("YYYY-MM-DD"),
      paid_by: user?.name || "",
      note: "",
      description: "",
      restaurant_id: Number(restaurantId) || 0,
      is_active: true,
      reciepts: [],
    };
  }, [initialExpense, restaurantId, user?.name]);

  let submitButtonLabel = initialExpense ? "Update Expense" : "Create Expense";
  if (isUploading) {
    submitButtonLabel = "Uploading Receipts...";
  } else if (isSubmitting) {
    submitButtonLabel = "Saving...";
  }

  return (
    <BottomSheet visible={visible} onClose={onClose} snapPoints={["85%"]}>
      <BottomSheetScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="none"
        contentContainerStyle={{
          paddingHorizontal: WP("5%"),
          paddingBottom: HP("5%"),
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-3 mb-2 border-b border-base-200">
          <View className="flex-row items-center gap-2">
            <View
              style={{ width: WP("9%"), height: WP("9%") }}
              className="rounded-full bg-primary/10 items-center justify-center"
            >
              <MaterialIcons
                name={initialExpense ? "edit" : "add-circle-outline"}
                size={WP("5%")}
                color={COLORS.primary}
              />
            </View>
            <CustomText variant="primary" size="lg" weight="semibold">
              {initialExpense ? "Edit Expense" : "Add New Expense"}
            </CustomText>
          </View>
        </View>

        {/* CustomForm */}
        <CustomForm<IExpenseFormData>
          schema={expenseFormSchema}
          defaultValues={defaultValues}
          submitHandler={submitExpense}
          submitButtonLabel={submitButtonLabel}
          cancelHandler={onClose}
          actionButtonClassName="mt-6"
        >
          <View className="gap-y-4">
            {/* Amount Field */}
            <InputField
              name="amount"
              label="Amount"
              placeholder="0.00"
              keyboardType="decimal-pad"
            />

            {/* Expense Type Field */}
            <DropdownField
              name="expense_type"
              label="Expense Type"
              placeholder="Select expense type"
              dropdownOptions={expenseTypeOptions}
            />

            {/* Payment Method Field */}
            <DropdownField
              name="payment_method"
              label="Payment Method"
              placeholder="Select payment method"
              dropdownOptions={PAYMENT_METHOD_OPTIONS}
            />

            {/* Payment Date Field */}
            <DateField name="payment_date" label="Payment Date" />

            {/* Paid By Field */}
            <InputField
              name="paid_by"
              label="Paid By"
              placeholder="Vendor or payee name"
            />

            {/* Note Field */}
            <InputField
              name="note"
              label="Note"
              placeholder="Short note or title"
            />

            {/* Description Field */}
            <InputField
              name="description"
              label="Description"
              placeholder="Additional details about this expense..."
              multiline
              numberOfLines={3}
            />

            {/* Receipt Attachments Field */}
            <FileUploadField
              name="reciepts"
              label="Receipt Attachments"
              buttonText="Attach Receipt Image or PDF"
            />
          </View>
        </CustomForm>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}
