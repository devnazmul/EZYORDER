import COLORS from "@/constants/colors";
import { getResponsiveFontSize, HP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  iconName?: React.ComponentProps<typeof MaterialIcons>["name"];
  error?: string;
  rightIconName?: React.ComponentProps<typeof MaterialIcons>["name"];
  onRightIconPress?: () => void;
  containerClassName?: string;
}

export default function InputField({
  label,
  iconName,
  error,
  rightIconName,
  onRightIconPress,
  containerClassName = "",
  onFocus,
  onBlur,
  ...props
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderClass = error ? "border-error" : isFocused ? "border-primary" : "border-base-200";
  const iconColor = error ? COLORS.error : isFocused ? COLORS.primary : COLORS.accent;
  const iconSize = getResponsiveFontSize("sm") + 6;

  return (
    <View className={containerClassName}>
      <Text
        style={{ fontSize: getResponsiveFontSize("sm") - 1 }}
        className="font-semibold text-accent mb-1.5"
      >
        {label}
      </Text>
      <View
        className={`flex-row items-center justify-between bg-base-100 border rounded-lg ${borderClass} px-3`}
        style={{ height: Math.max(44, HP("5%")) }}
      >
        {iconName && <MaterialIcons name={iconName} size={iconSize} color={iconColor} className="mr-1" />}
        <TextInput
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="flex-1 text-neutral "
          placeholderTextColor={COLORS.accent}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
        {rightIconName && (
          <TouchableOpacity
            onPress={onRightIconPress}
            className="p-1"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MaterialIcons name={rightIconName} size={iconSize} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="text-error mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}
