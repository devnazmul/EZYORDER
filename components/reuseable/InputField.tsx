import COLORS from "@/constants/colors";
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
      <Text className="text-xs font-semibold text-accent mb-2">{label}</Text>
      <View className={`flex-row items-center h-12 bg-base-100 border rounded-lg px-3 ${borderClass}`}>
        {iconName && <MaterialIcons name={iconName} size={20} color={iconColor} />}
        <TextInput
          className="flex-1 h-full text-neutral text-sm ml-2"
          placeholderTextColor="#9ca3af"
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
            <MaterialIcons name={rightIconName} size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
}
