import COLORS from "@/constants/colors";
import { getResponsiveFontSize, HP, WP } from "@/utils/getResponsiveSizes";
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

  return (
    <View className={containerClassName}>
      <Text style={{ fontSize: getResponsiveFontSize("xs") }} className="font-semibold text-accent mb-1.5">
        {label}
      </Text>
      <View
        style={{ height: HP("5%"), paddingHorizontal: WP("3%") }}
        className={`flex-row items-center bg-base-100 border rounded-lg ${borderClass}`}
      >
        {iconName && <MaterialIcons name={iconName} size={WP("4.6%")} color={iconColor} />}
        <TextInput
          style={{ fontSize: getResponsiveFontSize("sm") }}
          className="flex-1 h-full text-neutral ml-2"
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
          <TouchableOpacity onPress={onRightIconPress} className="p-1">
            <MaterialIcons name={rightIconName} size={WP("4.6%")} color={iconColor} />
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
