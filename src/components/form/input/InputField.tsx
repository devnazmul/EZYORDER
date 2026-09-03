// 1. React / React Native
import React, { useState } from "react";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

// 2. Expo / Navigation
import { MaterialIcons } from "@expo/vector-icons";

// 3. External libraries
import { Controller, useFormContext } from "react-hook-form";

// 4. Shared components
import InputError from "./InputError";
import InputLabel from "./InputLabel";

// 7. Constants / utils
import { COLORS } from "@/constants/colors";
import { getResponsiveFontSize, HP } from "@/utils/getResponsiveSizes";

export interface IInputFieldProps extends TextInputProps {
  readonly name: string;
  readonly label?: string;
  readonly iconName?: keyof typeof MaterialIcons.glyphMap;
  readonly isPassword?: boolean;
  readonly className?: string;
}

export default function InputField({
  name,
  label,
  iconName,
  isPassword = false,
  className,
  ...textInputProps
}: Readonly<IInputFieldProps>) {
  const [isVisible, setIsVisible] = useState(!isPassword);
  const [isFocused, setIsFocused] = useState(false);

  const {
    control,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <View className={`w-full flex-col gap-y-1.5 ${className || ""}`}>
      <InputLabel label={label} />

      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => {
          const borderClass = errorMessage
            ? "border-error"
            : isFocused
              ? "border-primary"
              : "border-base-200";

          const iconColor = errorMessage
            ? COLORS.error
            : isFocused
              ? COLORS.primary
              : COLORS.accent;

          const iconSize = getResponsiveFontSize("sm") + 6;

          const isMultiline = Boolean(textInputProps.multiline);
          const multilineMinHeight = textInputProps.numberOfLines
            ? Math.max(72, textInputProps.numberOfLines * 24 + 20)
            : Math.max(88, HP("10%"));

          return (
            <View>
              <View
                className={`flex-row ${
                  isMultiline ? "items-start " : "items-center"
                } justify-between bg-base-100 w-full  px-3 rounded-lg border ${borderClass} ${isMultiline ? "pt-2" : ""}`}
                style={
                  isMultiline
                    ? { minHeight: multilineMinHeight }
                    : { height: Math.max(44, HP("5%")) }
                }
              >
                {iconName && (
                  <MaterialIcons
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                    className={isMultiline ? "mr-1 mt-0.5" : "mr-1"}
                  />
                )}

                <TextInput
                  {...textInputProps}
                  value={
                    value !== undefined && value !== null ? String(value) : ""
                  }
                  onChangeText={onChange}
                  onFocus={(e) => {
                    setIsFocused(true);
                    textInputProps.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                    setIsFocused(false);
                    onBlur();
                    textInputProps.onBlur?.(e);
                  }}
                  secureTextEntry={isPassword && !isVisible}
                  placeholderTextColor={COLORS.accent}
                  textAlignVertical={isMultiline ? "top" : "center"}
                  className={`flex-1 text-neutral h-full outline-none`}
                  style={[
                    { fontSize: getResponsiveFontSize("sm") },
                    isMultiline && { paddingTop: 0 },
                    textInputProps.style,
                  ]}
                  autoCapitalize={textInputProps.autoCapitalize || "none"}
                  autoCorrect={textInputProps.autoCorrect ?? false}
                />

                {isPassword && (
                  <TouchableOpacity
                    onPress={() => setIsVisible(!isVisible)}
                    accessibilityRole="button"
                    accessibilityLabel={
                      isVisible ? "Hide password" : "Show password"
                    }
                    className="p-2"
                  >
                    <MaterialIcons
                      name={isVisible ? "visibility-off" : "visibility"}
                      size={iconSize}
                      color={iconColor}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <InputError errorMessage={errorMessage} />
            </View>
          );
        }}
      />
    </View>
  );
}
