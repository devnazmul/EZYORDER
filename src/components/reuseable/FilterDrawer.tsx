// 1. React / React Native
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultValues,
  FieldValues,
  FormProvider,
  Resolver,
  useForm,
} from "react-hook-form";
import { ZodType } from "zod";

// 4. Shared components
import BottomSheet from "./BottomSheet";
import Button from "./Button";

// 5. Form Input Components
import {
  ChipsField,
  DateField,
  DateRangeField,
  DropdownField,
  IDropdownOption,
  InputField,
  NumberRangeField,
  TimeRangeField,
} from "../form/input";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";

export type IFilterFieldType =
  | "chips"
  | "date-range"
  | "time-range"
  | "number-range"
  | "text"
  | "date"
  | "dropdown";

export interface IFilterField {
  id: string;
  label: string;
  type: IFilterFieldType;
  options?: { id: string; label: string }[]; // For chips or dropdown type
  dropdownOptions?: IDropdownOption[]; // For dropdown type option mapping
  keyboardType?: KeyboardTypeOptions;
  isMultiSelect?: boolean;
  onFieldChange?: (
    value: unknown,
    currentValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

export interface IFilterDrawerProps<
  T extends FieldValues = Record<string, unknown>,
> {
  fields: IFilterField[];
  values: T;
  onApply: (values: T) => void;
  onClear: () => void;
  schema?: ZodType<T>;
  triggerClassName?: string;
}

// ==================== HELPER RENDERERS ====================

function renderFilterField(field: IFilterField) {
  switch (field.type) {
    case "chips":
      return (
        <ChipsField
          key={field.id}
          name={field.id}
          label={field.label}
          options={field.options || []}
          isMultiSelect={field.isMultiSelect}
          onFieldChange={field.onFieldChange}
        />
      );

    case "dropdown":
      return (
        <DropdownField
          key={field.id}
          name={field.id}
          label={field.label}
          options={field.options}
          dropdownOptions={field.dropdownOptions}
          isMultiSelect={field.isMultiSelect}
          onFieldChange={field.onFieldChange}
        />
      );

    case "date":
      return (
        <DateField
          key={field.id}
          name={field.id}
          label={field.label}
          onFieldChange={field.onFieldChange}
        />
      );

    case "date-range":
      return (
        <DateRangeField
          key={field.id}
          name={field.id}
          label={field.label}
          onFieldChange={field.onFieldChange}
        />
      );

    case "time-range":
      return (
        <TimeRangeField
          key={field.id}
          name={field.id}
          label={field.label}
          onFieldChange={field.onFieldChange}
        />
      );

    case "number-range":
      return (
        <NumberRangeField
          key={field.id}
          name={field.id}
          label={field.label}
          onFieldChange={field.onFieldChange}
        />
      );

    case "text":
      return (
        <InputField
          key={field.id}
          name={field.id}
          label={field.label}
          keyboardType={field.keyboardType}
        />
      );

    default:
      return null;
  }
}

// ==================== MAIN COMPONENT ====================

export default function FilterDrawer<
  T extends FieldValues = Record<string, unknown>,
>({
  fields,
  values,
  onApply,
  onClear,
  schema,
  triggerClassName = "",
}: Readonly<IFilterDrawerProps<T>>) {
  const [isOpen, setIsOpen] = useState(false);

  const methods = useForm<T>({
    defaultValues: values as DefaultValues<T>,
    resolver: schema
      ? (zodResolver(
          schema as unknown as Parameters<typeof zodResolver>[0],
        ) as Resolver<T>)
      : undefined,
  });

  const resetForm = methods.reset;
  // Sync form values when drawer transitions to open state
  useEffect(() => {
    if (isOpen) {
      resetForm(values as DefaultValues<T>);
    }
  }, [isOpen, resetForm, values]);

  // Compute active filter count dynamically based on current values prop
  const activeFilterCount = useMemo(() => {
    let count = 0;
    Object.keys(values).forEach((key) => {
      const val = values[key];
      if (val === "all" || (Array.isArray(val) && val.includes("all"))) {
        return;
      }
      if (typeof val === "object" && val !== null) {
        const obj = val as Record<string, unknown>;
        if (obj.start || obj.end || obj.min || obj.max) count++;
      } else if (val) {
        count++;
      }
    });
    return count;
  }, [values]);

  const handleClear = () => {
    const cleared: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "chips" || f.type === "dropdown") {
        cleared[f.id] = f.isMultiSelect ? ["all"] : "all";
      } else if (f.type === "date-range" || f.type === "time-range") {
        cleared[f.id] = { start: "", end: "" };
      } else if (f.type === "number-range") {
        cleared[f.id] = { min: "", max: "" };
      } else if (f.type === "text" || f.type === "date") {
        cleared[f.id] = "";
      }
    });

    methods.reset(cleared as DefaultValues<T>);
    onClear();
  };

  const handleApply = methods.handleSubmit((data) => {
    onApply(data as unknown as T);
    setIsOpen(false);
  });

  return (
    <>
      {/* Reusable Trigger Button rendered inside component */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Filter options"
        className={`relative bg-base-300 border border-base-200 rounded-lg p-2.5 items-center justify-center ${triggerClassName}`}
      >
        <MaterialIcons
          name="filter-list"
          size={WP("4.75%")}
          color={COLORS.primary}
        />
        {activeFilterCount > 0 && (
          <View className="absolute -top-1 -right-1 bg-primary w-5 h-5 rounded-full items-center justify-center border-2 border-base-300">
            <Text className="text-[8px] font-bold text-white">
              {activeFilterCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <BottomSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        snapPoints={["80%"]}
        keyboardBehavior="interactive"
        android_keyboardInputMode="adjustResize"
      >
        <FormProvider {...methods}>
          {/* Header */}
          <View
            style={{ paddingHorizontal: WP("5%") }}
            className="flex-row justify-between items-center py-2 border-b border-base-200"
          >
            <Text
              style={{ fontSize: getResponsiveFontSize("lg") }}
              className="font-bold text-neutral capitalize "
            >
              Filters
            </Text>
          </View>

          {/* Scrollable Fields */}
          <BottomSheetScrollView
            style={{ paddingHorizontal: WP("5%") }}
            className="flex-1 py-4"
            contentContainerStyle={{ paddingBottom: HP("6%") }}
          >
            <View className="gap-y-6">
              {fields.map((field) => renderFilterField(field))}
            </View>
          </BottomSheetScrollView>

          {/* Bottom Actions */}
          <View
            style={{ padding: WP("4%"), paddingBottom: HP("6%") }}
            className="flex-row items-center gap-3 border-t border-base-200 bg-base-200"
          >
            <Button
              label="Clear All"
              onPress={handleClear}
              variant="outline"
              containerClassName="flex-1 !shadow-none"
            />
            <Button
              label="Apply Filters"
              onPress={handleApply}
              variant="primary"
              containerClassName="flex-1"
            />
          </View>
        </FormProvider>
      </BottomSheet>
    </>
  );
}
