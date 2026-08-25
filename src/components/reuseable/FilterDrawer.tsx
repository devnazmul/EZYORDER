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
import dayjs from "dayjs";

// 4. Shared components
import BottomSheet from "./BottomSheet";
import Button from "./Button";
import DatePickerModal from "./DatePickerModal";
import Dropdown, { IDropdownOption } from "./Dropdown";
import FilterChips from "./FilterChips";
import DateField from "./inputs/DateField";
import DateRangeField from "./inputs/DateRangeField";
import NumberRangeField from "./inputs/NumberRangeField";
import TextField from "./inputs/TextField";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { toggleMultiSelectValue } from "@/utils/toggleMultiSelectValue";

export type IFilterFieldType =
  "chips" | "date-range" | "number-range" | "text" | "date" | "dropdown";

export type IDatePickerType = "start" | "end" | "single";

export interface IActiveDatePickerState {
  fieldId: string;
  type: IDatePickerType;
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

export interface IFilterDrawerProps {
  fields: IFilterField[];
  values: Record<string, unknown>;
  onApply: (values: Record<string, unknown>) => void;
  onClear: () => void;
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

function applyFieldChange(
  field: IFilterField,
  updated: Record<string, unknown>,
): Record<string, unknown> {
  let result = updated;
  if (field.onFieldChange) {
    const sideEffects = field.onFieldChange(result[field.id], result);
    if (sideEffects) {
      result = { ...result, ...sideEffects };
    }
  }
  return result;
}

function renderChipsField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  handleChipSelect: (field: IFilterField, optionId: string) => void,
) {
  if (!field.options) return null;
  const selectedId = (localValues[field.id] as string | string[]) || "all";
  return (
    <View key={field.id}>
      <FieldLabel label={field.label} />
      <FilterChips
        chips={field.options}
        selectedId={selectedId}
        onSelect={(optionId) => handleChipSelect(field, optionId)}
        isBottomSheet={true}
      />
    </View>
  );
}

function renderDateRangeField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  setActiveDatePicker: (val: IActiveDatePickerState | null) => void,
  formatDateLabel: (dateStr?: string) => string,
) {
  const range = (localValues[field.id] as { start?: string; end?: string }) || {
    start: "",
    end: "",
  };
  return (
    <DateRangeField
      key={field.id}
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

function renderNumberRangeField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  setLocalValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
) {
  const range = (localValues[field.id] as { min?: string; max?: string }) || {
    min: "",
    max: "",
  };

  const updateRange = (key: "min" | "max", val: string) => {
    setLocalValues((prev) => ({
      ...prev,
      [field.id]: {
        ...((prev[field.id] as { min?: string; max?: string }) || {
          min: "",
          max: "",
        }),
        [key]: val,
      },
    }));
  };

  return (
    <NumberRangeField
      key={field.id}
      label={field.label}
      minValue={range.min}
      maxValue={range.max}
      onChangeMinText={(text) => updateRange("min", text)}
      onChangeMaxText={(text) => updateRange("max", text)}
    />
  );
}

function renderTextField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  setLocalValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
) {
  const textVal = (localValues[field.id] as string) || "";
  return (
    <TextField
      key={field.id}
      label={field.label}
      value={textVal}
      keyboardType={field.keyboardType || "default"}
      onChangeText={(text) => {
        setLocalValues((prev) => ({
          ...prev,
          [field.id]: text,
        }));
      }}
    />
  );
}

function renderDropdownField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  setLocalValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>,
) {
  const selectedVal =
    (localValues[field.id] as string | string[]) ||
    (field.isMultiSelect ? ["all"] : "all");

  const dropdownOptions: IDropdownOption[] =
    field.dropdownOptions ||
    field.options?.map((opt) => ({
      label: opt.label,
      value: opt.id,
    })) ||
    [];

  return (
    <View key={field.id}>
      <FieldLabel label={field.label} />
      <Dropdown
        options={dropdownOptions}
        selectedValue={selectedVal}
        isMultiSelect={field.isMultiSelect}
        onSelect={(val) => {
          setLocalValues((prev) => {
            const updated: Record<string, unknown> = {
              ...prev,
              [field.id]: val,
            };
            return applyFieldChange(field, updated);
          });
        }}
        placeholder={`Select ${field.label}`}
        triggerClassName="justify-between bg-base-100 border border-base-200 rounded-xl px-[3%] py-[3%]"
      />
    </View>
  );
}

function renderDateField(
  field: IFilterField,
  localValues: Record<string, unknown>,
  setActiveDatePicker: (val: IActiveDatePickerState | null) => void,
  formatDateLabel: (dateStr?: string) => string,
) {
  const dateVal = (localValues[field.id] as string) || "";
  return (
    <DateField
      key={field.id}
      label={field.label}
      value={dateVal}
      onPress={() => setActiveDatePicker({ fieldId: field.id, type: "single" })}
      formatDateLabel={formatDateLabel}
    />
  );
}

// ==================== SUB-COMPONENTS ====================

interface IFilterDrawerFieldProps {
  field: IFilterField;
  localValues: Record<string, unknown>;
  setLocalValues: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
  handleChipSelect: (field: IFilterField, optionId: string) => void;
  setActiveDatePicker: (val: IActiveDatePickerState | null) => void;
  formatDateLabel: (dateStr?: string) => string;
}

function FilterDrawerField({
  field,
  localValues,
  setLocalValues,
  handleChipSelect,
  setActiveDatePicker,
  formatDateLabel,
}: Readonly<IFilterDrawerFieldProps>) {
  switch (field.type) {
    case "chips":
      return renderChipsField(field, localValues, handleChipSelect);
    case "date-range":
      return renderDateRangeField(
        field,
        localValues,
        setActiveDatePicker,
        formatDateLabel,
      );
    case "number-range":
      return renderNumberRangeField(field, localValues, setLocalValues);
    case "text":
      return renderTextField(field, localValues, setLocalValues);
    case "dropdown":
      return renderDropdownField(field, localValues, setLocalValues);
    case "date":
      return renderDateField(
        field,
        localValues,
        setActiveDatePicker,
        formatDateLabel,
      );
    default:
      return null;
  }
}

// ==================== MAIN COMPONENT ====================

export default function FilterDrawer({
  fields,
  values,
  onApply,
  onClear,
  triggerClassName = "",
}: Readonly<IFilterDrawerProps>) {
  const [isOpen, setIsOpen] = useState(false);

  // Local scratch state to modify before applying
  const [localValues, setLocalValues] =
    useState<Record<string, unknown>>(values);
  const [activeDatePicker, setActiveDatePicker] =
    useState<IActiveDatePickerState | null>(null);

  // Sync local values when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalValues(values);
    }
  }, [isOpen, values]);

  // Compute active filter count dynamically
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

  const handleChipSelect = (field: IFilterField, optionId: string) => {
    setLocalValues((prev) => {
      let updated: Record<string, unknown>;

      if (!field.isMultiSelect) {
        updated = { ...prev, [field.id]: optionId };
      } else {
        const prevVal = prev[field.id];
        const current = Array.isArray(prevVal)
          ? (prevVal as string[])
          : [typeof prevVal === "string" ? prevVal : "all"];

        const next = toggleMultiSelectValue(current, optionId);
        updated = { ...prev, [field.id]: next };
      }

      return applyFieldChange(field, updated);
    });
  };

  const handleDateSelect = (dateStr: string) => {
    if (!activeDatePicker) return;
    const { fieldId, type } = activeDatePicker;

    if (type === "single") {
      setLocalValues((prev) => ({
        ...prev,
        [fieldId]: dateStr,
      }));
    } else {
      setLocalValues((prev) => {
        const currentRange = (prev[fieldId] as {
          start?: string;
          end?: string;
        }) || { start: "", end: "" };
        return {
          ...prev,
          [fieldId]: {
            ...currentRange,
            [type]: dateStr,
          },
        };
      });
    }
    setActiveDatePicker(null);
  };

  const handleClear = () => {
    const cleared: Record<string, unknown> = {};
    fields.forEach((f) => {
      if (f.type === "chips" || f.type === "dropdown") {
        cleared[f.id] = f.isMultiSelect ? ["all"] : "all";
      } else if (f.type === "date-range") {
        cleared[f.id] = { start: "", end: "" };
      } else if (f.type === "number-range") {
        cleared[f.id] = { min: "", max: "" };
      } else if (f.type === "text" || f.type === "date") {
        cleared[f.id] = "";
      }
    });
    setLocalValues(cleared);
    onClear();
  };

  const handleApply = () => {
    onApply(localValues);
    setIsOpen(false);
  };

  const formatDateLabel = (dateStr?: string) => {
    if (!dateStr) return "Select Date";
    const parsed = dayjs(dateStr);
    return parsed.isValid() ? parsed.format("MMM D, YYYY") : dateStr;
  };

  const activeDateValue = useMemo(() => {
    if (!activeDatePicker) return undefined;
    const val = localValues[activeDatePicker.fieldId];
    if (activeDatePicker.type === "single") return val as string;
    return (val as { start?: string; end?: string })?.[activeDatePicker.type];
  }, [activeDatePicker, localValues]);

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
                localValues={localValues}
                setLocalValues={setLocalValues}
                handleChipSelect={handleChipSelect}
                setActiveDatePicker={setActiveDatePicker}
                formatDateLabel={formatDateLabel}
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
    </>
  );
}
