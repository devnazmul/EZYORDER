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
import dayjs from "dayjs";
import {
  Control,
  Controller,
  DefaultValues,
  FieldPath,
  FieldValues,
  FormProvider,
  Resolver,
  useForm,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";
import { ZodType } from "zod";

// 4. Shared components
import InputError from "../form/input/InputError";
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import DatePickerModal from "./DatePickerModal";
import Dropdown, { IDropdownOption } from "./Dropdown";
import FilterChips from "./FilterChips";
import DateField from "./inputs/DateField";
import DateRangeField from "./inputs/DateRangeField";
import NumberRangeField from "./inputs/NumberRangeField";
import TextField from "./inputs/TextField";
import TimeRangeField from "./inputs/TimeRangeField";
import TimePickerModal from "./TimePickerModal";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { toggleMultiSelectValue } from "@/utils/toggleMultiSelectValue";

export type IFilterFieldType =
  | "chips"
  | "date-range"
  | "time-range"
  | "number-range"
  | "text"
  | "date"
  | "dropdown";

export type IDatePickerType = "start" | "end" | "single";

export interface IActiveDatePickerState {
  fieldId: string;
  type: IDatePickerType;
}

export interface IActiveTimePickerState {
  fieldId: string;
  type: "start" | "end";
}

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

// ==================== HELPER RENDERERS & UTILS ====================

function FieldLabel({ label }: Readonly<{ label: string }>) {
  return (
    <Text
      style={{ fontSize: getResponsiveFontSize("sm") }}
      className="font-semibold text-accent capitalize mb-3"
    >
      {label}
    </Text>
  );
}

function getSelectedValue(
  val: unknown,
  isMultiSelect?: boolean,
): string | string[] {
  if (
    val === undefined ||
    val === null ||
    val === "" ||
    (Array.isArray(val) && val.length === 0)
  ) {
    return isMultiSelect ? ["all"] : "all";
  }
  return val as string | string[];
}

// ==================== SUB-COMPONENTS ====================

interface IFilterDrawerFieldProps {
  field: IFilterField;
  control: Control<Record<string, unknown>>;
  getValues: UseFormGetValues<Record<string, unknown>>;
  setValue: UseFormSetValue<Record<string, unknown>>;
  setActiveDatePicker: (val: IActiveDatePickerState | null) => void;
  setActiveTimePicker: (val: IActiveTimePickerState | null) => void;
  formatDateLabel: (dateStr?: string) => string;
  formatTimeLabel: (timeStr?: string) => string;
}

function FilterDrawerField({
  field,
  control,
  getValues,
  setValue,
  setActiveDatePicker,
  setActiveTimePicker,
  formatDateLabel,
  formatTimeLabel,
}: Readonly<IFilterDrawerFieldProps>) {
  return (
    <Controller
      control={control}
      name={field.id}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const errorMessage = error?.message;

        const handleValueChange = (newVal: unknown) => {
          onChange(newVal);
          if (field.onFieldChange) {
            const currentFormValues = getValues();
            const updatedFormValues = {
              ...currentFormValues,
              [field.id]: newVal,
            };
            const sideEffects = field.onFieldChange(newVal, updatedFormValues);
            if (sideEffects) {
              Object.keys(sideEffects).forEach((key) => {
                setValue(key, sideEffects[key]);
              });
            }
          }
        };

        const renderInput = () => {
          switch (field.type) {
            case "chips": {
              if (!field.options) return null;
              const selectedId = getSelectedValue(value, field.isMultiSelect);

              const handleChipSelect = (optionId: string) => {
                let updatedVal: unknown;
                if (!field.isMultiSelect) {
                  updatedVal = optionId;
                } else {
                  const current = Array.isArray(value)
                    ? (value as string[])
                    : [typeof value === "string" ? value : "all"];
                  updatedVal = toggleMultiSelectValue(current, optionId);
                }
                handleValueChange(updatedVal);
              };

              return (
                <View>
                  <FieldLabel label={field.label} />
                  <FilterChips
                    chips={field.options}
                    selectedId={selectedId}
                    onSelect={handleChipSelect}
                    isBottomSheet={true}
                  />
                </View>
              );
            }

            case "date-range": {
              const range = (value as { start?: string; end?: string }) || {
                start: "",
                end: "",
              };
              return (
                <DateRangeField
                  label={field.label}
                  startDateValue={range.start}
                  endDateValue={range.end}
                  onSelectStartDate={() =>
                    setActiveDatePicker({ fieldId: field.id, type: "start" })
                  }
                  onSelectEndDate={() =>
                    setActiveDatePicker({ fieldId: field.id, type: "end" })
                  }
                  formatDateLabel={formatDateLabel}
                />
              );
            }

            case "time-range": {
              const range = (value as { start?: string; end?: string }) || {
                start: "",
                end: "",
              };
              return (
                <TimeRangeField
                  label={field.label}
                  startTimeValue={range.start}
                  endTimeValue={range.end}
                  onSelectStartTime={() =>
                    setActiveTimePicker({ fieldId: field.id, type: "start" })
                  }
                  onSelectEndTime={() =>
                    setActiveTimePicker({ fieldId: field.id, type: "end" })
                  }
                  formatTimeLabel={formatTimeLabel}
                />
              );
            }

            case "number-range": {
              const range = (value as { min?: string; max?: string }) || {
                min: "",
                max: "",
              };

              const updateRange = (key: "min" | "max", textVal: string) => {
                handleValueChange({
                  ...range,
                  [key]: textVal,
                });
              };

              return (
                <NumberRangeField
                  label={field.label}
                  minValue={range.min}
                  maxValue={range.max}
                  onChangeMinText={(text) => updateRange("min", text)}
                  onChangeMaxText={(text) => updateRange("max", text)}
                />
              );
            }

            case "text": {
              const textVal = (value as string) || "";
              return (
                <TextField
                  label={field.label}
                  value={textVal}
                  keyboardType={field.keyboardType || "default"}
                  onChangeText={(text) => handleValueChange(text)}
                />
              );
            }

            case "dropdown": {
              const selectedVal = getSelectedValue(value, field.isMultiSelect);

              const dropdownOptions: IDropdownOption[] =
                field.dropdownOptions ||
                field.options?.map((opt) => ({
                  label: opt.label,
                  value: opt.id,
                })) ||
                [];

              return (
                <View>
                  <FieldLabel label={field.label} />
                  <Dropdown
                    options={dropdownOptions}
                    selectedValue={selectedVal}
                    isMultiSelect={field.isMultiSelect}
                    onSelect={(val) => handleValueChange(val)}
                    placeholder={`Select ${field.label}`}
                    triggerClassName="justify-between bg-base-100 border border-base-200 rounded-xl px-[3%] py-[3%]"
                  />
                </View>
              );
            }

            case "date": {
              const dateVal = (value as string) || "";
              return (
                <DateField
                  label={field.label}
                  value={dateVal}
                  onPress={() =>
                    setActiveDatePicker({ fieldId: field.id, type: "single" })
                  }
                  formatDateLabel={formatDateLabel}
                />
              );
            }

            default:
              return null;
          }
        };

        return (
          <View className="w-full">
            {renderInput()}
            {errorMessage && <InputError errorMessage={errorMessage} />}
          </View>
        );
      }}
    />
  );
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

  const [activeDatePicker, setActiveDatePicker] =
    useState<IActiveDatePickerState | null>(null);
  const [activeTimePicker, setActiveTimePicker] =
    useState<IActiveTimePickerState | null>(null);

  const methods = useForm<T>({
    defaultValues: values as DefaultValues<T>,
    resolver: schema
      ? (zodResolver(
          schema as unknown as Parameters<typeof zodResolver>[0],
        ) as Resolver<T>)
      : undefined,
  });

  // Sync form values when drawer transitions to open state
  useEffect(() => {
    if (isOpen) {
      methods.reset(values as DefaultValues<T>);
    }
  }, [isOpen]);

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

  const updateFieldValue = (fieldId: string, newVal: unknown) => {
    methods.setValue(
      fieldId as FieldPath<T>,
      newVal as unknown as T[FieldPath<T>],
      { shouldValidate: true, shouldDirty: true },
    );

    const field = fields.find((f) => f.id === fieldId);
    if (field?.onFieldChange) {
      const currentFormValues = methods.getValues() as Record<string, unknown>;
      const updatedFormValues = {
        ...currentFormValues,
        [fieldId]: newVal,
      };
      const sideEffects = field.onFieldChange(newVal, updatedFormValues);
      if (sideEffects) {
        Object.keys(sideEffects).forEach((key) => {
          methods.setValue(
            key as FieldPath<T>,
            sideEffects[key] as unknown as T[FieldPath<T>],
          );
        });
      }
    }
  };

  const handleDateSelect = (dateStr: string) => {
    if (!activeDatePicker) return;
    const { fieldId, type } = activeDatePicker;

    if (type === "single") {
      updateFieldValue(fieldId, dateStr);
    } else {
      const currentRange = (methods.getValues(
        fieldId as FieldPath<T>,
      ) as unknown as {
        start?: string;
        end?: string;
      }) || { start: "", end: "" };

      updateFieldValue(fieldId, {
        ...currentRange,
        [type]: dateStr,
      });
    }
    setActiveDatePicker(null);
  };

  const handleTimeSelect = (timeStr: string) => {
    if (!activeTimePicker) return;
    const { fieldId, type } = activeTimePicker;

    const currentRange = (methods.getValues(
      fieldId as FieldPath<T>,
    ) as unknown as {
      start?: string;
      end?: string;
    }) || { start: "", end: "" };

    updateFieldValue(fieldId, {
      ...currentRange,
      [type]: timeStr,
    });

    setActiveTimePicker(null);
  };

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

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "Select Date";
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format("MMM D, YYYY") : dateStr;
  };

  const formatTimeLabel = (timeStr?: string) => {
    if (!timeStr) return "Select Time";
    return timeStr;
  };

  // Watch fields for active date/time picker selection displays
  const activeDateValue = useMemo(() => {
    if (!activeDatePicker) return undefined;
    const val = methods.getValues(activeDatePicker.fieldId as FieldPath<T>);
    if (activeDatePicker.type === "single") return val as unknown as string;
    return (val as unknown as { start?: string; end?: string })?.[
      activeDatePicker.type
    ];
  }, [activeDatePicker, methods]);

  const activeTimeValue = useMemo(() => {
    if (!activeTimePicker) return undefined;
    const val = methods.getValues(activeTimePicker.fieldId as FieldPath<T>);
    return (val as unknown as { start?: string; end?: string })?.[
      activeTimePicker.type
    ];
  }, [activeTimePicker, methods]);

  return (
    <>
      {/* Reusable Trigger Button rendered inside component */}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
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
              {fields.map((field) => (
                <FilterDrawerField
                  key={field.id}
                  field={field}
                  control={
                    methods.control as unknown as Control<
                      Record<string, unknown>
                    >
                  }
                  getValues={
                    methods.getValues as unknown as UseFormGetValues<
                      Record<string, unknown>
                    >
                  }
                  setValue={
                    methods.setValue as unknown as UseFormSetValue<
                      Record<string, unknown>
                    >
                  }
                  setActiveDatePicker={setActiveDatePicker}
                  setActiveTimePicker={setActiveTimePicker}
                  formatDateLabel={formatDateLabel}
                  formatTimeLabel={formatTimeLabel}
                />
              ))}
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

      {/* Embedded Date Picker Modal */}
      {activeDatePicker && (
        <DatePickerModal
          visible={true}
          onClose={() => setActiveDatePicker(null)}
          selectedDate={activeDateValue}
          onSelectDate={handleDateSelect}
        />
      )}

      {/* Embedded Time Picker Modal */}
      {activeTimePicker && (
        <TimePickerModal
          visible={true}
          onClose={() => setActiveTimePicker(null)}
          selectedTime={activeTimeValue}
          onSelectTime={handleTimeSelect}
        />
      )}
    </>
  );
}
