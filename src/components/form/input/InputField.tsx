import COLORS from "@/constants/colors";
import { getResponsiveFontSize, HP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import InputError from "./InputError";
import InputLabel from "./InputLabel";

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

          return (
            <View>
              <View
                className={`flex-row items-center justify-between bg-base-100 w-full px-3 rounded-lg border ${borderClass}`}
                style={{ height: Math.max(44, HP("5%")) }}
              >
                {iconName && (
                  <MaterialIcons
                    name={iconName}
                    size={iconSize}
                    color={iconColor}
                    className="mr-1"
                  />
                )}

                <TextInput
                  {...textInputProps}
                  value={value}
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
                  className="flex-1 text-neutral h-full outline-none"
                  style={{
                    fontSize: getResponsiveFontSize("sm"),
                    ...((textInputProps.style as any) || {}),
                  }}
                  autoCapitalize={textInputProps.autoCapitalize || "none"}
                  autoCorrect={textInputProps.autoCorrect ?? false}
                />

                {isPassword && (
                  <TouchableOpacity
                    onPress={() => setIsVisible(!isVisible)}
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
