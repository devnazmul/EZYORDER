import dayjs from "dayjs";
import BottomSheet from "@/components/reuseable/BottomSheet";
import Button from "@/components/reuseable/Button";
import FilterChips from "@/components/reuseable/FilterChips";
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useEffect, useMemo, useState } from "react";
import {
  KeyboardTypeOptions,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DatePickerModal from "./DatePickerModal";
import DateField from "./inputs/DateField";
import DateRangeField from "./inputs/DateRangeField";
import NumberRangeField from "./inputs/NumberRangeField";
import TextField from "./inputs/TextField";

export interface IFilterField {
  id: string;
  label: string;
  type: "chips" | "date-range" | "number-range" | "text" | "date";
  options?: { id: string; label: string }[]; // For chips type
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
  const [activeDatePicker, setActiveDatePicker] = useState<{
    fieldId: string;
    type: "start" | "end" | "single";
  } | null>(null);

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
    if (!field.isMultiSelect) {
      setLocalValues((prev) => {
        let updated: Record<string, unknown> = {
          ...prev,
          [field.id]: optionId,
        };
        if (field.onFieldChange) {
          const sideEffects = field.onFieldChange(optionId, updated);
          if (sideEffects) {
            updated = { ...updated, ...sideEffects };
          }
        }
        return updated;
      });
      return;
    }

    setLocalValues((prev) => {
      const prevFieldVal = prev[field.id];
      const current = Array.isArray(prevFieldVal)
        ? (prevFieldVal as string[])
        : [typeof prevFieldVal === "string" ? prevFieldVal : "all"];

      if (optionId === "all") {
        return {
          ...prev,
          [field.id]: ["all"],
        };
      }

      let next = current.filter((x: string) => x !== "all");
      if (next.includes(optionId)) {
        next = next.filter((x: string) => x !== optionId);
      } else {
        next.push(optionId);
      }

      if (next.length === 0) {
        next = ["all"];
      }

      let updated: Record<string, unknown> = {
        ...prev,
        [field.id]: next,
      };
      if (field.onFieldChange) {
        const sideEffects = field.onFieldChange(next, updated);
        if (sideEffects) {
          updated = { ...updated, ...sideEffects };
        }
      }
      return updated;
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
      if (f.type === "chips") {
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
        >
          <View className="gap-y-6">
            {fields.map((field) => {
              if (field.type === "chips" && field.options) {
                const selectedId =
                  (localValues[field.id] as string | string[]) || "all";
                return (
                  <View key={field.id}>
                    <Text
                      style={{ fontSize: getResponsiveFontSize("sm") }}
                      className="font-semibold text-accent capitalize  mb-3"
                    >
                      {field.label}
                    </Text>
                    <FilterChips
                      chips={field.options}
                      selectedId={selectedId}
                      onSelect={(optionId) => handleChipSelect(field, optionId)}
                      isBottomSheet={true}
                    />
                  </View>
                );
              }

              if (field.type === "date-range") {
                const range = (localValues[field.id] as {
                  start?: string;
                  end?: string;
                }) || { start: "", end: "" };
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

              if (field.type === "number-range") {
                const range = (localValues[field.id] as {
                  min?: string;
                  max?: string;
                }) || { min: "", max: "" };
                return (
                  <NumberRangeField
                    key={field.id}
                    label={field.label}
                    minValue={range.min}
                    maxValue={range.max}
                    onChangeMinText={(text) => {
                      setLocalValues((prev) => ({
                        ...prev,
                        [field.id]: {
                          ...((prev[field.id] as {
                            min?: string;
                            max?: string;
                          }) || { min: "", max: "" }),
                          min: text,
                        },
                      }));
                    }}
                    onChangeMaxText={(text) => {
                      setLocalValues((prev) => ({
                        ...prev,
                        [field.id]: {
                          ...((prev[field.id] as {
                            min?: string;
                            max?: string;
                          }) || { min: "", max: "" }),
                          max: text,
                        },
                      }));
                    }}
                  />
                );
              }

              if (field.type === "text") {
                const textVal =
                  typeof localValues[field.id] === "string"
                    ? (localValues[field.id] as string)
                    : "";
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

              if (field.type === "date") {
                const dateVal =
                  typeof localValues[field.id] === "string"
                    ? (localValues[field.id] as string)
                    : "";
                return (
                  <DateField
                    key={field.id}
                    label={field.label}
                    value={dateVal}
                    onPress={() =>
                      setActiveDatePicker({ fieldId: field.id, type: "single" })
                    }
                    formatDateLabel={formatDateLabel}
                  />
                );
              }

              return null;
            })}
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
          title={`Select Date`}
          selectedDate={
            activeDatePicker.type === "single"
              ? (localValues[activeDatePicker.fieldId] as string)
              : (
                  localValues[activeDatePicker.fieldId] as Record<
                    string,
                    string
                  >
                )?.[activeDatePicker.type]
          }
          onSelectDate={handleDateSelect}
        />
      )}
    </>
  );
}
