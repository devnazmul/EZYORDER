import COLORS from "@/constants/colors";
import { WP } from "@/utils/getResponsiveSizes";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

interface EmptyStateProps {
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  title?: string;
  description: string;
  pyClassName?: string;
}

export default function EmptyState({ icon, title, description, pyClassName = "py-12" }: EmptyStateProps) {
  return (
    <View className={`items-center justify-center ${pyClassName} px-4`}>
      {icon && (
        <View className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
          <MaterialIcons name={icon} size={WP("5%")} color={COLORS.primary} />
        </View>
      )}
      {title && <Text className="text-sm font-bold text-neutral mb-1 text-center">{title}</Text>}
      <Text className="text-xs text-accent text-center leading-4 max-w-[280px]">{description}</Text>
    </View>
  );
}
