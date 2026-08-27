// 1. React / React Native
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import TimePickerModal from "@/components/reuseable/TimePickerModal";
import InputError from "./InputError";

// 7. Constants / utils
import { handleFieldSideEffects } from "./handleFieldSideEffects";
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface ITimeRangeFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly startLabel?: string;
  readonly endLabel?: string;
  readonly className?: string;
  readonly formatTimeLabel?: (timeStr?: string) => string;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

// Helper sub-component for time picker trigger item
interface ITimeItemButtonProps {
  label: string;
  formattedTime: string;
  onPress: () => void;
}

function TimeItemButton({
  label,
  formattedTime,
  onPress,
}: Readonly<ITimeItemButtonProps>) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${formattedTime}`}
      style={{ padding: WP("2.5%") }}
      className="flex-1 flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
    >
      <View>
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") - 1 }}
          className="font-semibold text-accent capitalize"
        >
          {label}
        </Text>
        <Text
          style={{ fontSize: getResponsiveFontSize("xs") }}
          className="font-semibold text-neutral mt-0.5"
        >
          {formattedTime}
        </Text>
      </View>
      <MaterialIcons
        name="access-time"
        size={WP("4.5%")}
        color={COLORS.primary}
      />
    </TouchableOpacity>
  );
}

export default function TimeRangeField({
  name,
  label,
  startLabel = "Start Time",
  endLabel = "End Time",
  className = "",
  formatTimeLabel = (timeStr) => timeStr || "Select Time",
  onFieldChange,
}: Readonly<ITimeRangeFieldProps>) {
  const [activePickerType, setActivePickerType] = useState<
    "start" | "end" | null
  >(null);
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const range = (value as { start?: string; end?: string }) || {
          start: "",
          end: "",
        };

        const handleSelectTime = (timeStr: string) => {
          if (!activePickerType) return;
          const newRange = {
            ...range,
            [activePickerType]: timeStr,
          };

          onChange(newRange);
          setActivePickerType(null);
          handleFieldSideEffects(
            name,
            newRange,
            getValues,
            setValue,
            onFieldChange,
          );
        };

        const selectedTimeForPicker = activePickerType
          ? range[activePickerType]
          : undefined;

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
              <TimeItemButton
                label={startLabel}
                formattedTime={formatTimeLabel(range.start)}
                onPress={() => setActivePickerType("start")}
              />
              <TimeItemButton
                label={endLabel}
                formattedTime={formatTimeLabel(range.end)}
                onPress={() => setActivePickerType("end")}
              />
            </View>

            {Boolean(error?.message) && (
              <InputError errorMessage={error?.message || ""} />
            )}

            {Boolean(activePickerType) && (
              <TimePickerModal
                visible={true}
                onClose={() => setActivePickerType(null)}
                selectedTime={selectedTimeForPicker}
                onSelectTime={handleSelectTime}
              />
            )}
          </View>
        );
      }}
    />
  );
}
