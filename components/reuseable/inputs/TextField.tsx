import React from "react";
import { Text, TextInput, View, KeyboardTypeOptions } from "react-native";

interface TextFieldProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChangeText: (text: string) => void;
  keyboardType?: KeyboardTypeOptions;
}

export default function TextField({
  label,
  placeholder = "Enter value...",
  value = "",
  onChangeText,
  keyboardType = "default",
}: TextFieldProps) {
  return (
    <View>
      {label && (
        <Text className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3">
          {label}
        </Text>
      )}
      <View className="bg-base-100 border border-base-200 rounded-xl p-3">
        <TextInput
          keyboardType={keyboardType}
          placeholder={placeholder}
          placeholderTextColor="#6E6E6E"
          value={value}
          onChangeText={onChangeText}
          className="text-xs font-semibold text-neutral p-0"
        />
      </View>
    </View>
  );
}
