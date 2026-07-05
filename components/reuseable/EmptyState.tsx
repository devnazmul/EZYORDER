import React from "react";
import { Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface EmptyStateProps {
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  title?: string;
  description: string;
  pyClassName?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  pyClassName = "py-12",
}: EmptyStateProps) {
  return (
    <View className={`items-center justify-center ${pyClassName} px-4`}>
      {icon && (
        <MaterialIcons name={icon} size={40} color="#A3A3A3" style={{ marginBottom: 8 }} />
      )}
      {title && (
        <Text className="text-sm font-bold text-neutral mb-1 text-center">
          {title}
        </Text>
      )}
      <Text className="text-xs text-accent text-center leading-4 max-w-[280px]">
        {description}
      </Text>
    </View>
  );
}
