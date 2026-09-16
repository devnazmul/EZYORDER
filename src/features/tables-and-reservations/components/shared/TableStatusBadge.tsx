// 4. Shared components
import { Badge } from "@/components/reuseable";

// 5. Feature types & utils
import type { TableStatus } from "../../types/table.types";
import { getTableStatusConfig } from "../../utils/getTableStatusConfig";

// 7. Constants/utils
import { getResponsiveFontSize } from "@/utils";

interface ITableStatusBadgeProps {
  status?: TableStatus;
}

export default function TableStatusBadge({
  status,
}: Readonly<ITableStatusBadgeProps>) {
  const cfg = getTableStatusConfig(status);

  return (
    <Badge
      text={cfg.label}
      containerClassName={`border ${cfg.bgClass}`}
      textClassName={`font-bold capitalize ${cfg.textClass}`}
      textStyle={{ fontSize: getResponsiveFontSize("xs") - 2 }}
      iconName={cfg.iconName}
      iconColor={cfg.iconColor}
      iconSize={10}
    />
  );
}
