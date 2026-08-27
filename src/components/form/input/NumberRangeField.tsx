// 1. React / React Native
import React from "react";
import { Text, TextInput, View } from "react-native";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import InputError from "./InputError";

// 7. Constants / utils
import { handleFieldSideEffects } from "./handleFieldSideEffects";
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface INumberRangeFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly minLabel?: string;
  readonly maxLabel?: string;
  readonly minPlaceholder?: string;
  readonly maxPlaceholder?: string;
  readonly className?: string;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

// Helper sub-component for number range input item
interface INumberItemInputProps {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
}

function NumberItemInput({
  label,
  value,
  placeholder,
  onChangeText,
}: Readonly<INumberItemInputProps>) {
  return (
    <View
      style={{ padding: WP("2.5%") }}
      className="flex-1 bg-base-100 border border-base-200 rounded-xl"
    >
      <Text
        style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
        className="font-semibold text-accent capitalize mb-1"
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.accent}
        keyboardType="numeric"
        accessibilityLabel={label}
        className="text-neutral font-semibold p-0 m-0"
        style={{ fontSize: getResponsiveFontSize("xs") }}
      />
    </View>
  );
}

export default function NumberRangeField({
  name,
  label,
  minLabel = "Min Price",
  maxLabel = "Max Price",
  minPlaceholder = "Min",
  maxPlaceholder = "Max",
  className = "",
  onFieldChange,
}: Readonly<INumberRangeFieldProps>) {
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const range = (value as { min?: string; max?: string }) || {
          min: "",
          max: "",
        };

        const handleRangeChange = (key: "min" | "max", textVal: string) => {
          const newRange = {
            ...range,
            [key]: textVal,
          };
          onChange(newRange);
          handleFieldSideEffects(
            name,
            newRange,
            getValues,
            setValue,
            onFieldChange,
          );
        };

        return (
          <View className={`w-full ${className}`}>
            {Boolean(label) && (
              <Text
                style={{ fontSize: getResponsiveFontSize("sm") }}
                className="font-semibold text-accent capitalize mb-3"
              >
                {label}
              </Text>
            )}
            <View className="flex-row items-center gap-3">
              <NumberItemInput
                label={minLabel}
                value={range.min || ""}
                placeholder={minPlaceholder}
                onChangeText={(text) => handleRangeChange("min", text)}
              />
              <NumberItemInput
                label={maxLabel}
                value={range.max || ""}
                placeholder={maxPlaceholder}
                onChangeText={(text) => handleRangeChange("max", text)}
              />
            </View>

            {Boolean(error?.message) && (
              <InputError errorMessage={error?.message || ""} />
            )}
          </View>
        );
      }}
    />
  );
}
