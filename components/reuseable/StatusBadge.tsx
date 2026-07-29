import Badge from "@/components/reuseable/Badge";
import { getStatusBadgeConfig } from "@/utils/getStatusBadgeConfig";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";

interface StatusBadgeProps {
  status: string;
  icon?: React.ComponentProps<typeof MaterialIcons>["name"];
  iconColor?: string;
  containerClassName?: string;
  textClassName?: string;
  label?: string;
}

export default function StatusBadge({
  status,
  icon,
  iconColor,
  containerClassName = "",
  textClassName = "",
  label,
}: StatusBadgeProps) {
  const config = getStatusBadgeConfig(status);

  const resolvedIconName = icon || config.iconName;
  const resolvedIconColor = iconColor || config.iconColor;
  const resolvedContainerClass = containerClassName
    ? `${config.containerClass} ${containerClassName}`
    : config.containerClass;
  const resolvedTextClass = textClassName
    ? `${config.textClass} ${textClassName}`
    : config.textClass;
  const resolvedLabel = label || status || "Unknown";

  return (
    <Badge
      text={resolvedLabel}
      icon={
        <MaterialIcons
          name={resolvedIconName}
          size={12}
          color={resolvedIconColor}
          style={{ marginRight: 2 }}
        />
      }
      containerClassName={resolvedContainerClass}
      textClassName={resolvedTextClass}
    />
  );
}
