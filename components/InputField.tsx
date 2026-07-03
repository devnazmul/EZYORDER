import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { TextInput, TextInputProps, View, Text, TouchableOpacity } from "react-native";

interface InputFieldProps extends TextInputProps {
  label: string;
  iconName?: React.ComponentProps<typeof MaterialIcons>["name"];
  error?: string;
  rightIconName?: React.ComponentProps<typeof MaterialIcons>["name"];
  onRightIconPress?: () => void;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  iconName,
  error,
  rightIconName,
  onRightIconPress,
  ...props
}) => {
  return (
    <View className="mt-4">
      <Text className="text-xs font-semibold text-accent mb-2 block">{label}</Text>
      <View
        className={`flex-row items-center h-12 bg-base-100 border rounded-lg px-3 ${
          error ? "border-error" : "border-base-200"
        }`}
      >
        {iconName && (
          <MaterialIcons name={iconName} size={20} color="#6E6E6E" />
        )}
        <TextInput
          className="flex-1 h-full text-neutral text-sm ml-2"
          placeholderTextColor="#9ca3af"
          {...props}
        />
        {rightIconName && (
          <TouchableOpacity onPress={onRightIconPress} className="p-1">
            <MaterialIcons name={rightIconName} size={20} color="#6E6E6E" />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text className="text-xs text-error mt-1">{error}</Text>}
    </View>
  );
};

export default InputField;
