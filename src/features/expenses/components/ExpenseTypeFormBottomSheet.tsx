// 1. React / React Native
import React, { useMemo } from "react";
import { View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { DefaultValues, useFormContext } from "react-hook-form";

// 4. Shared components
import { CustomForm } from "@/components/form/CustomForm";
import { InputField, SwitchField } from "@/components/form/input";
import BottomSheet from "@/components/reuseable/BottomSheet";
import Button from "@/components/reuseable/Button";
import CustomText from "@/components/reuseable/CustomText";

// 5. Feature components/hooks/services
import { useAuth } from "@/hooks";
import {
  useCreateExpenseTypeMutation,
  useUpdateExpenseTypeMutation,
} from "../hooks";
import { expenseTypeFormSchema } from "../schema";
import { ExpenseService } from "../services";

// 6. Types
import type { IExpenseTypeFormData } from "../schema";
import type { IExpenseType } from "../types";

// 7. Constants/utils
import { COLORS } from "@/constants/colors";
import { HP, WP } from "@/utils/getResponsiveSizes";

interface IExpenseTypeFormBottomSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly initialExpenseType?: IExpenseType | null;
}

function FormBottomActions({
  onClose,
  submitButtonLabel,
  isSubmitting,
  onSubmit,
}: {
  readonly onClose: () => void;
  readonly submitButtonLabel: string;
  readonly isSubmitting: boolean;
  readonly onSubmit: (data: IExpenseTypeFormData) => Promise<void>;
}) {
  const { handleSubmit } = useFormContext<IExpenseTypeFormData>();

  return (
    <View
      style={{ padding: WP("4%"), paddingBottom: HP("6%") }}
      className="flex-row items-center gap-3 border-t border-base-200 bg-base-200"
    >
      <Button
        label="Cancel"
        onPress={onClose}
        variant="outline"
        containerClassName="flex-1 !shadow-none"
        disabled={isSubmitting}
      />
      <Button
        label={submitButtonLabel}
        onPress={handleSubmit(onSubmit)}
        variant="primary"
        containerClassName="flex-1"
        isLoading={isSubmitting}
        disabled={isSubmitting}
      />
    </View>
  );
}

export default function ExpenseTypeFormBottomSheet({
  visible,
  onClose,
  initialExpenseType,
}: Readonly<IExpenseTypeFormBottomSheetProps>) {
  const { user } = useAuth();
  const restaurantId = user?.restaurant?.[0]?.id || user?.business_id;

  const createMutation = useCreateExpenseTypeMutation();
  const updateMutation = useUpdateExpenseTypeMutation();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues = useMemo<DefaultValues<IExpenseTypeFormData>>(() => {
    if (initialExpenseType) {
      return {
        id: initialExpenseType.id,
        name: initialExpenseType.name || "",
        description: initialExpenseType.description || "",
        restaurant_id: Number(restaurantId) || 0,
        is_active: (initialExpenseType.is_active !== 0
          ? "1"
          : "0") as unknown as boolean,
      };
    }

    return {
      name: "",
      description: "",
      restaurant_id: Number(restaurantId) || 0,
      is_active: "1" as unknown as boolean,
    };
  }, [initialExpenseType, restaurantId]);

  const handleSubmit = async (formData: IExpenseTypeFormData) => {
    try {
      if (initialExpenseType) {
        const payload = ExpenseService.toUpdateExpenseTypePayload(formData);
        await updateMutation.mutateAsync(payload);
      } else {
        const payload = ExpenseService.toCreateExpenseTypePayload(formData);
        await createMutation.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      console.error("Expense type form submit error:", error);
    }
  };

  let submitButtonLabel = initialExpenseType ? "Update Type" : "Create Type";
  if (isSubmitting) {
    submitButtonLabel = "Saving...";
  }

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      snapPoints={["75%"]}
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
    >
      <CustomForm<IExpenseTypeFormData>
        schema={expenseTypeFormSchema}
        defaultValues={defaultValues}
        submitHandler={handleSubmit}
        showFormActionButton={false}
        className="flex-1"
        style={{ flex: 1, flexDirection: "column" }}
      >
        {/* Header */}
        <View
          style={{ paddingHorizontal: WP("5%") }}
          className="flex-row items-center justify-between py-3 mb-2 border-b border-base-200"
        >
          <View className="flex-row items-center gap-2">
            <View
              style={{ width: WP("9%"), height: WP("9%") }}
              className="rounded-full bg-primary/10 items-center justify-center"
            >
              <MaterialIcons
                name={initialExpenseType ? "edit" : "add-circle-outline"}
                size={WP("5%")}
                color={COLORS.primary}
              />
            </View>
            <CustomText variant="primary" size="lg" weight="semibold">
              {initialExpenseType ? "Edit Expense Type" : "Add Expense Type"}
            </CustomText>
          </View>

          {/* Header Right Status Switch */}
          <SwitchField
            name="is_active"
            label={(isActive) => (isActive ? "Active" : "Inactive")}
            labelProps={(isActive) => ({
              style: { color: isActive ? COLORS.primary : COLORS.accent },
            })}
            confirmPrompt
          />
        </View>

        {/* Scrollable Fields */}
        <BottomSheetScrollView
          style={{ flexShrink: 1, paddingHorizontal: WP("5%") }}
          className="py-4"
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: HP("6%") }}
        >
          <View className="gap-y-4">
            {/* Name Field */}
            <InputField
              name="name"
              label="Type Name "
              placeholder="e.g. Utility Bills, Office Supplies"
            />

            {/* Description Field */}
            <InputField
              name="description"
              label="Description"
              placeholder="Additional details about this type..."
              multiline
              numberOfLines={5}
            />
          </View>
        </BottomSheetScrollView>

        {/* Fixed Bottom Action Buttons - FilterDrawer layout pattern */}
        <FormBottomActions
          onClose={onClose}
          submitButtonLabel={submitButtonLabel}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        />
      </CustomForm>
    </BottomSheet>
  );
}
