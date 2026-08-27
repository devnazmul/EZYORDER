// 1. React / React Native
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import dayjs from "dayjs";
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import DatePickerModal from "@/components/reuseable/DatePickerModal";
import InputError from "./InputError";

// 7. Constants / utils
import { handleFieldSideEffects } from "./handleFieldSideEffects";
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, WP } from "@/utils/getResponsiveSizes";

export interface IDateFieldProps {
  readonly name: string;
  readonly label?: string;
  readonly selectedLabel?: string;
  readonly className?: string;
  readonly formatDateLabel?: (dateStr: string) => string;
  readonly onFieldChange?: (
    val: unknown,
    formValues: Record<string, unknown>,
  ) => Record<string, unknown> | void;
}

export default function DateField({
  name,
  label,
  selectedLabel = "Selected Date",
  className = "",
  formatDateLabel = (dateStr) =>
    dateStr && dayjs(dateStr).isValid()
      ? dayjs(dateStr).format("MMM D, YYYY")
      : dateStr || "Select Date",
  onFieldChange,
}: Readonly<IDateFieldProps>) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);
  const { control, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const dateVal = (value as string) || "";

        const handleSelectDate = (dateStr: string) => {
          onChange(dateStr);
          setIsPickerVisible(false);
          handleFieldSideEffects(
            name,
            dateStr,
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
            <TouchableOpacity
              onPress={() => setIsPickerVisible(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`${label || selectedLabel}: ${formatDateLabel(dateVal)}`}
              style={{ padding: WP("3.5%") }}
              className="flex-row items-center justify-between bg-base-100 border border-base-200 rounded-xl"
            >
              <View>
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-semibold text-accent capitalize"
                >
                  {selectedLabel}
                </Text>
                <Text
                  style={{ fontSize: getResponsiveFontSize("xs") }}
                  className="font-semibold text-neutral mt-0.5"
                >
                  {formatDateLabel(dateVal)}
                </Text>
              </View>
              <MaterialIcons
                name="calendar-today"
                size={WP("4.5%")}
                color={COLORS.primary}
              />
            </TouchableOpacity>

            {Boolean(error?.message) && (
              <InputError errorMessage={error?.message || ""} />
            )}

            {isPickerVisible && (
              <DatePickerModal
                visible={true}
                onClose={() => setIsPickerVisible(false)}
                selectedDate={dateVal}
                onSelectDate={handleSelectDate}
              />
            )}
          </View>
        );
      }}
    />
  );
}
