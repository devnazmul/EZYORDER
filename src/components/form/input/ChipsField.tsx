// 1. React / React Native
import React from "react";
import { View } from "react-native";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import FilterChips from "@/components/reuseable/FilterChips";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

// 7. Constants / utils
import { toggleMultiSelectValue } from "@/utils/toggleMultiSelectValue";
import { handleFieldSideEffects } from "./handleFieldSideEffects";

export interface IChipsFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly options: { id: string; label: string }[];
  readonly isMultiSelect?: boolean;
  readonly isBottomSheet?: boolean;
  readonly className?: string;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

export default function ChipsField({
  name,
  label,
  options,
  isMultiSelect = false,
  isBottomSheet = true,
  className = "",
  onFieldChange,
}: Readonly<IChipsFieldProps>) {
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const isEmptyValue =
          value === undefined ||
          value === null ||
          value === "" ||
          (Array.isArray(value) && value.length === 0);

        let selectedId: string | string[];
        if (isEmptyValue) {
          selectedId = isMultiSelect ? ["all"] : "all";
        } else {
          selectedId = value as string | string[];
        }

        const handleChipSelect = (optionId: string) => {
          let nextVal: unknown;
          if (!isMultiSelect) {
            nextVal = optionId;
          } else {
            const current = Array.isArray(value)
              ? (value as string[])
              : [typeof value === "string" ? value : "all"];
            nextVal = toggleMultiSelectValue(current, optionId);
          }

          onChange(nextVal);
          handleFieldSideEffects(
            name,
            nextVal,
            getValues,
            setValue,
            onFieldChange,
          );
        };

        return (
          <View className={`w-full ${className}`}>
            <InputLabel label={label} className="capitalize mb-3" />
            <FilterChips
              chips={options}
              selectedId={selectedId}
              onSelect={handleChipSelect}
              isBottomSheet={isBottomSheet}
            />
            {Boolean(error?.message) && (
              <InputError errorMessage={error?.message || ""} />
            )}
          </View>
        );
      }}
    />
  );
}
